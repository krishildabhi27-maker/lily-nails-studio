// Order status lookup for the confirmation screen. (Order CREATION now lives in
// routes/payments.js against the normalized schema; the old create handler here
// was removed in the Step 7 audit to avoid a stale, schema-mismatched path.)
import { Router } from "express";
import { queryOne, query } from "../db/mysql.js";
import { fulfillOrder } from "../services/fulfill.js";
import { config } from "../config.js";

export const orders = Router();

// Estimated delivery window (days) from distance — rough, display-only.
function estDelivery(km) {
  const days = km <= 25 ? [1, 2] : km <= 300 ? [2, 4] : km <= 800 ? [3, 6] : [5, 8];
  const fmt = d => { const t = new Date(); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); };
  return { minDays: days[0], maxDays: days[1], from: fmt(days[0]), to: fmt(days[1]) };
}

// GET /api/orders/:code — status + shipment/tracking for the success page.
// Reads from orders + its 1:1 shipments row. Returns only non-sensitive fields.
orders.get("/:code", async (req, res) => {
  try {
    const code = String(req.params.code || "").slice(0, 32);
    if (!/^[A-Za-z0-9]+$/.test(code)) return res.status(400).json({ error: "Invalid order code." });

    const data = await queryOne(
      `SELECT o.id, o.order_code, o.status, o.subtotal, o.shipping_fee, o.total, o.distance_km,
              o.razorpay_payment_id, o.state, o.city, o.address, o.pincode,
              c.name AS customer_name,
              s.status AS shipment_status, s.awb, s.courier, s.tracking_url
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       LEFT JOIN shipments s ON s.order_id = o.id
       WHERE o.order_code = ?`,
      [code]
    );
    if (!data) return res.status(404).json({ error: "Order not found." });

    const items = await query(
      "SELECT product_name, size, quantity, unit_price, line_total FROM order_items WHERE order_id = ?",
      [data.id]
    );

    res.json({
      order_code: data.order_code,
      status: data.status,
      subtotal: data.subtotal,
      shipping_fee: data.shipping_fee,
      total: data.total,
      distance_km: data.distance_km,
      payment_id: data.razorpay_payment_id || null,
      customer_name: data.customer_name || null,
      shipping_address: { address: data.address, city: data.city, state: data.state, pincode: data.pincode },
      items: items || [],
      est_delivery: estDelivery(data.distance_km),
      shipment_status: data.shipment_status || null,
      awb: data.awb || null,
      courier: data.courier || null,
      tracking_url: data.tracking_url || null,
    });
  } catch (e) {
    console.error("[orders.get]", e.message);
    res.status(500).json({ error: "Could not fetch order." });
  }
});

// POST /api/orders/:code/retry-shipment — manual recovery for a stuck order
// (PAID but shipment has no AWB, e.g. Shiprocket was down). Admin-only.
// Idempotent: fulfillOrder() never touches an order that already has an AWB.
// Header:  x-admin-key: <ADMIN_KEY>
orders.post("/:code/retry-shipment", async (req, res) => {
  try {
    if (!config.adminKey || req.headers["x-admin-key"] !== config.adminKey) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const code = String(req.params.code || "").slice(0, 32);
    if (!/^[A-Za-z0-9]+$/.test(code)) return res.status(400).json({ error: "Invalid order code." });

    const order = await queryOne("SELECT * FROM orders WHERE order_code = ?", [code]);
    if (!order) return res.status(404).json({ error: "Order not found." });

    const result = await fulfillOrder(order);
    res.json({ order_code: code, ...result });
  } catch (e) {
    console.error("[orders.retry-shipment]", e.message);
    res.status(500).json({ error: "Retry failed." });
  }
});
