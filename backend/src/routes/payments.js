// Razorpay payment flow — server prices everything; client totals are never trusted.
//   POST /api/payments/create-order   → price on server, create Razorpay order
//   POST /api/payments/verify-payment  → verify signature, mark PAID, store payment id
import { Router } from "express";
import { supabase } from "../db/supabase.js";
import { shipFor } from "../services/shipping.js";
import { createRazorpayOrder, verifyPaymentSignature, generateOrderCode } from "../services/razorpay.js";
import { config } from "../config.js";

export const payments = Router();

const SIZES = ["Small", "Medium", "Large"];

// ── POST /api/payments/create-order ──────────────────────────────────────────
payments.post("/create-order", async (req, res) => {
  try {
    const { customer, cart } = req.body || {};
    if (!customer || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Missing customer or cart." });
    }
    const { name, phone, address, state, city, pincode, country } = customer;
    if (!name || !phone || !address || !state || !city || !pincode) {
      return res.status(400).json({ error: "Incomplete address." });
    }
    if (country && country !== "India") {
      return res.status(400).json({ error: "We currently deliver only within India." });
    }

    // Authoritative prices from DB — the client's prices/totals are ignored entirely.
    const ids = [...new Set(cart.map(i => i.id))];
    const { data: products, error: pErr } = await supabase
      .from("products").select("id,name,price,active").in("id", ids);
    if (pErr) throw pErr;
    const byId = Object.fromEntries((products || []).map(p => [p.id, p]));

    const lineItems = [];
    let subtotal = 0;
    for (const line of cart) {
      const p = byId[line.id];
      if (!p || !p.active) return res.status(400).json({ error: `Unavailable item: ${line.id}` });
      if (!SIZES.includes(line.size)) return res.status(400).json({ error: `Invalid size for ${line.id}` });
      const qty = Math.max(1, Math.min(99, Number(line.qty) || 1));
      const lineTotal = p.price * qty;
      subtotal += lineTotal;
      lineItems.push({ product_id: p.id, product_name: p.name, size: line.size, quantity: qty, unit_price: p.price, line_total: lineTotal });
    }

    // Server-computed shipping (distance brackets, capped ₹300).
    const { fee: shipping, km } = shipFor(state, city);
    const total = subtotal + shipping;

    // Upsert customer by phone (natural key).
    const { data: cust, error: cErr } = await supabase
      .from("customers")
      .upsert({ name, phone }, { onConflict: "phone" })
      .select().single();
    if (cErr) throw cErr;

    // Insert the order with a collision-proof code; retry on the rare unique clash.
    let order, rzp;
    for (let attempt = 0; attempt < 5; attempt++) {
      const orderCode = generateOrderCode();
      rzp = await createRazorpayOrder(total, orderCode);
      const { data, error: oErr } = await supabase.from("orders").insert({
        order_code: orderCode, customer_id: cust.id, status: "CREATED",
        country: "India", state, city, address, pincode,
        subtotal, distance_km: km, shipping_fee: shipping, total,
        razorpay_order_id: rzp.id,
      }).select().single();
      if (!oErr) { order = data; break; }
      if (oErr.code === "23505") continue; // unique_violation → new code, retry
      throw oErr;
    }
    if (!order) return res.status(500).json({ error: "Could not allocate order code." });

    const { error: iErr } = await supabase.from("order_items")
      .insert(lineItems.map(li => ({ ...li, order_id: order.id })));
    if (iErr) throw iErr;

    res.json({
      orderCode: order.order_code,
      amount: total,               // whole rupees
      amountPaise: total * 100,    // for Razorpay Checkout
      currency: "INR",
      razorpayOrderId: rzp.id,
      razorpayKeyId: config.razorpay.keyId,
      breakdown: { subtotal, shipping, distanceKm: km },
    });
  } catch (e) {
    console.error("[payments.create-order]", e);
    res.status(500).json({ error: "Could not create order." });
  }
});

// ── POST /api/payments/verify-payment ────────────────────────────────────────
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
payments.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment fields." });
    }
    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return res.status(400).json({ error: "Signature verification failed.", verified: false });
    }

    const { data: order, error } = await supabase.from("orders")
      .select("*").eq("razorpay_order_id", razorpay_order_id).single();
    if (error || !order) return res.status(404).json({ error: "Order not found." });

    // Idempotent: if already advanced, just report success.
    if (order.status === "PAID" || order.status === "READY_TO_SHIP") {
      return res.json({ verified: true, orderCode: order.order_code, status: order.status });
    }

    await supabase.from("orders").update({
      status: "PAID",
      razorpay_payment_id,
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);

    // Note: shipment creation is triggered by the Razorpay webhook (routes/webhook.js),
    // which is the authoritative PAID gate even if this callback is never reached.
    res.json({ verified: true, orderCode: order.order_code, status: "PAID" });
  } catch (e) {
    console.error("[payments.verify]", e);
    res.status(500).json({ error: "Verification error." });
  }
});
