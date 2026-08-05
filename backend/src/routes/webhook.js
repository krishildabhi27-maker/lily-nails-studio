// Razorpay webhook — the ONLY place an order becomes PAID.
// Mounted with a raw body parser so the HMAC signature can be verified.
import { Router } from "express";
import { supabase } from "../db/supabase.js";
import { verifyWebhookSignature } from "../services/razorpay.js";
import { createShipment } from "../services/shiprocket.js";

export const webhook = Router();

// POST /api/webhook/razorpay
webhook.post("/razorpay", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const raw = req.body; // Buffer (see raw parser in index.js)
  if (!verifyWebhookSignature(raw, signature)) {
    return res.status(400).json({ error: "Invalid signature." });
  }

  let event;
  try { event = JSON.parse(raw.toString("utf8")); }
  catch { return res.status(400).json({ error: "Bad payload." }); }

  // Acknowledge fast; Razorpay retries on non-2xx.
  res.json({ received: true });

  try {
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload.payment?.entity;
      const rzpOrderId = payment?.order_id || event.payload.order?.entity?.id;
      if (!rzpOrderId) return;

      // Find the order.
      const { data: order } = await supabase.from("orders")
        .select("*").eq("razorpay_order_id", rzpOrderId).single();
      if (!order) { console.warn("[webhook] no order for rzp", rzpOrderId); return; }

      // Never ship failed/cancelled orders.
      if (order.status === "FAILED" || order.status === "CANCELLED") {
        console.warn(`[webhook] ${order.order_code} is ${order.status} — skipping.`);
        return;
      }

      // Anti-tamper: captured amount must equal what we priced.
      if (payment && Math.round(order.total * 100) !== payment.amount) {
        console.error(`[webhook] ${order.order_code} amount mismatch: paid ${payment.amount} expected ${Math.round(order.total * 100)}`);
        await supabase.from("orders").update({ status: "FAILED", updated_at: new Date().toISOString() })
          .eq("id", order.id);
        return;
      }

      // Mark PAID (idempotent — only advances from CREATED).
      if (order.status === "CREATED") {
        await supabase.from("orders").update({
          status: "PAID",
          razorpay_payment_id: payment?.id || null,
          updated_at: new Date().toISOString(),
        }).eq("id", order.id);
        console.log(`[webhook] ${order.order_code} → PAID`);
      }

      // ── ATOMIC shipment claim ──────────────────────────────────────────────
      // The shipments table has a UNIQUE(order_id) constraint. We INSERT a claim
      // row FIRST; the DB lets exactly one concurrent/duplicate webhook win.
      // A unique_violation (23505) means another delivery already claimed it → stop.
      const { error: claimErr } = await supabase.from("shipments").insert({
        order_id: order.id, provider: "shiprocket", status: "PENDING",
      });
      if (claimErr) {
        if (claimErr.code === "23505") {
          console.log(`[webhook] ${order.order_code} shipment already claimed — duplicate ignored.`);
        } else {
          console.error(`[webhook] ${order.order_code} shipment claim error:`, claimErr.message);
        }
        return; // another delivery owns fulfillment (or transient error → Razorpay retries)
      }
      console.log(`[webhook] ${order.order_code} shipment claim acquired.`);

      // We hold the claim. Gather data and call Shiprocket.
      const { data: cust } = await supabase.from("customers")
        .select("name,phone").eq("id", order.customer_id).single();
      const { data: items } = await supabase.from("order_items")
        .select("product_id,product_name,size,quantity,unit_price").eq("order_id", order.id);

      try {
        const ship = await createShipment(
          { ...order, customer_name: cust?.name || "Customer", customer_phone: cust?.phone || "" },
          items || []
        );
        await supabase.from("shipments").update({
          shiprocket_order_id: ship.shiprocket_order_id,
          shipment_id: ship.shipment_id,
          awb: ship.awb,
          courier: ship.courier,
          tracking_url: ship.tracking_url,
          status: ship.awb ? "ASSIGNED" : "CREATED",
          updated_at: new Date().toISOString(),
        }).eq("order_id", order.id);
        await supabase.from("orders").update({
          status: "READY_TO_SHIP", updated_at: new Date().toISOString(),
        }).eq("id", order.id);
        console.log(`[webhook] ${order.order_code} shipment created (awb=${ship.awb || "pending"}, courier=${ship.courier || "-"}).`);
      } catch (se) {
        // Shiprocket down: order STAYS PAID; claim row marked AWAITING_SHIPMENT for retry.
        console.error(`[webhook] ${order.order_code} Shiprocket failed — awaiting shipment:`, se.message);
        await supabase.from("shipments").update({
          status: "AWAITING_SHIPMENT", updated_at: new Date().toISOString(),
        }).eq("order_id", order.id);
      }
    }
  } catch (e) {
    console.error("[webhook.process]", e.message);
  }
});
