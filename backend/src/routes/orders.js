// Order status lookup for the confirmation screen. (Order CREATION now lives in
// routes/payments.js against the normalized schema; the old create handler here
// was removed in the Step 7 audit to avoid a stale, schema-mismatched path.)
import { Router } from "express";
import { supabase } from "../db/supabase.js";

export const orders = Router();

// GET /api/orders/:code — status + shipment/tracking for the success page.
// Reads from orders + its 1:1 shipments row. Returns only non-sensitive fields.
orders.get("/:code", async (req, res) => {
  try {
    const code = String(req.params.code || "").slice(0, 32);
    if (!/^[A-Za-z0-9]+$/.test(code)) return res.status(400).json({ error: "Invalid order code." });

    const { data, error } = await supabase.from("orders")
      .select("order_code,status,total,shipping_fee,distance_km,shipments(status,awb,courier,tracking_url)")
      .eq("order_code", code).single();
    if (error || !data) return res.status(404).json({ error: "Order not found." });

    const s = Array.isArray(data.shipments) ? data.shipments[0] : data.shipments;
    res.json({
      order_code: data.order_code,
      status: data.status,
      total: data.total,
      shipping_fee: data.shipping_fee,
      distance_km: data.distance_km,
      shipment_status: s?.status || null,
      awb: s?.awb || null,
      courier: s?.courier || null,
      tracking_url: s?.tracking_url || null,
    });
  } catch (e) {
    console.error("[orders.get]", e.message);
    res.status(500).json({ error: "Could not fetch order." });
  }
});
