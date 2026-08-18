// Razorpay webhook — the ONLY place an order becomes PAID.
// Mounted with a raw body parser so the HMAC signature can be verified.
import { Router } from "express";
import { query, queryOne } from "../db/mysql.js";
import { verifyWebhookSignature } from "../services/razorpay.js";
import { fulfillOrder } from "../services/fulfill.js";

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
      const order = await queryOne("SELECT * FROM orders WHERE razorpay_order_id = ?", [rzpOrderId]);
      if (!order) { console.warn("[webhook] no order for rzp", rzpOrderId); return; }

      // Never ship failed/cancelled orders.
      if (order.status === "FAILED" || order.status === "CANCELLED") {
        console.warn(`[webhook] ${order.order_code} is ${order.status} — skipping.`);
        return;
      }

      // Anti-tamper: captured amount must equal what we priced.
      if (payment && Math.round(order.total * 100) !== payment.amount) {
        console.error(`[webhook] ${order.order_code} amount mismatch: paid ${payment.amount} expected ${Math.round(order.total * 100)}`);
        await query("UPDATE orders SET status = 'FAILED', updated_at = NOW() WHERE id = ?", [order.id]);
        return;
      }

      // Mark PAID (idempotent — only advances from CREATED).
      if (order.status === "CREATED") {
        await query(
          "UPDATE orders SET status = 'PAID', razorpay_payment_id = ?, updated_at = NOW() WHERE id = ?",
          [payment?.id || null, order.id]
        );
        console.log(`[webhook] ${order.order_code} → PAID`);
      }

      // ── Fulfillment (claim / retry, idempotent) — see services/fulfill.js ──
      // Reused by the manual retry endpoint so both paths behave identically.
      await fulfillOrder({ ...order, status: order.status === "CREATED" ? "PAID" : order.status });
    }
  } catch (e) {
    console.error("[webhook.process]", e.message);
  }
});
