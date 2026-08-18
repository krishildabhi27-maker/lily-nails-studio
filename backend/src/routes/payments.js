// Razorpay payment flow — server prices everything; client totals are never trusted.
//   POST /api/payments/create-order   → price on server, create Razorpay order
//   POST /api/payments/verify-payment  → verify signature, mark PAID, store payment id
import { Router } from "express";
import { pool, query, queryOne } from "../db/mysql.js";
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
    const placeholders = ids.map(() => "?").join(",");
    const products = ids.length
      ? await query(`SELECT id,name,price,active FROM products WHERE id IN (${placeholders})`, ids)
      : [];
    const byId = Object.fromEntries(products.map(p => [p.id, p]));

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

    // Upsert customer by phone (natural key), then read its id.
    await query(
      "INSERT INTO customers (name, phone) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
      [name, phone]
    );
    const cust = await queryOne("SELECT id FROM customers WHERE phone = ?", [phone]);

    // Insert the order with a collision-proof code; retry on the rare unique clash.
    let orderId, orderCode, rzp;
    for (let attempt = 0; attempt < 5; attempt++) {
      orderCode = generateOrderCode();
      rzp = await createRazorpayOrder(total, orderCode);
      try {
        const result = await query(
          `INSERT INTO orders
             (order_code, customer_id, status, country, state, city, address, pincode,
              subtotal, distance_km, shipping_fee, total, razorpay_order_id)
           VALUES (?, ?, 'CREATED', 'India', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderCode, cust.id, state, city, address, pincode, subtotal, km, shipping, total, rzp.id]
        );
        orderId = result.insertId;
        break;
      } catch (oErr) {
        if (oErr.code === "ER_DUP_ENTRY") continue; // duplicate order_code → new code, retry
        throw oErr;
      }
    }
    if (!orderId) return res.status(500).json({ error: "Could not allocate order code." });

    // Bulk-insert order items.
    const itemValues = lineItems.map(li => [orderId, li.product_id, li.product_name, li.size, li.quantity, li.unit_price, li.line_total]);
    await pool.query(
      "INSERT INTO order_items (order_id, product_id, product_name, size, quantity, unit_price, line_total) VALUES ?",
      [itemValues]
    );

    res.json({
      orderCode,
      amount: total,               // whole rupees
      amountPaise: total * 100,    // for Razorpay Checkout
      currency: "INR",
      razorpayOrderId: rzp.id,
      razorpayKeyId: config.razorpay.keyId,
      breakdown: { subtotal, shipping, distanceKm: km },
    });
  } catch (e) {
    console.error("[payments.create-order]", e);
    // TEMPORARY DEBUG: expose the real error so we can diagnose the 500.
    // Revert to a generic message before going fully live.
    res.status(500).json({ error: e.message, code: e.code, stack: e.stack });
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

    const order = await queryOne("SELECT * FROM orders WHERE razorpay_order_id = ?", [razorpay_order_id]);
    if (!order) return res.status(404).json({ error: "Order not found." });

    // Idempotent: if already advanced, just report success.
    if (order.status === "PAID" || order.status === "READY_TO_SHIP") {
      return res.json({ verified: true, orderCode: order.order_code, status: order.status });
    }

    await query(
      "UPDATE orders SET status = 'PAID', razorpay_payment_id = ?, updated_at = NOW() WHERE id = ?",
      [razorpay_payment_id, order.id]
    );

    // Note: shipment creation is triggered by the Razorpay webhook (routes/webhook.js),
    // which is the authoritative PAID gate even if this callback is never reached.
    res.json({ verified: true, orderCode: order.order_code, status: "PAID" });
  } catch (e) {
    console.error("[payments.verify]", e);
    res.status(500).json({ error: "Verification error." });
  }
});
