// Admin routes — order operations for the studio owner. Protected by ADMIN_KEY
// (sent as `x-admin-key` header). Read-only list/detail + status update.
// No customer PII beyond what the owner needs to fulfill; still admin-gated.
import { Router } from "express";
import { query, queryOne } from "../db/mysql.js";
import { config } from "../config.js";

export const admin = Router();

// Gate every admin route behind the key.
admin.use((req, res, next) => {
  if (!config.adminKey || req.headers["x-admin-key"] !== config.adminKey) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  next();
});

const ORDER_STATUSES = ["CREATED", "PAYMENT_PENDING", "PAID", "READY_TO_SHIP", "PAYMENT_FAILED", "FAILED", "CANCELLED"];

// GET /api/admin/orders?search=&status=&filter=needs_attention&limit=&offset=
// List orders with customer + shipment summary, newest first.
// filter=needs_attention → PAID orders with no tracking yet (no shipment row OR awb IS NULL).
admin.get("/orders", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim().slice(0, 64);
    const status = String(req.query.status || "").trim();
    const filter = String(req.query.filter || "").trim();
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const where = [];
    const params = [];
    if (filter === "needs_attention") {
      where.push("o.status = 'PAID' AND (s.id IS NULL OR s.awb IS NULL)");
    }
    if (status && ORDER_STATUSES.includes(status)) { where.push("o.status = ?"); params.push(status); }
    if (search) {
      where.push("(o.order_code LIKE ? OR c.name LIKE ? OR c.phone LIKE ? OR o.city LIKE ?)");
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const rows = await query(
      `SELECT o.id, o.order_code, o.status, o.total, o.shipping_fee, o.city, o.state, o.created_at,
              o.razorpay_payment_id,
              c.name AS customer_name, c.phone AS customer_phone,
              s.status AS shipment_status, s.awb, s.courier, s.tracking_url
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       LEFT JOIN shipments s ON s.order_id = o.id
       ${whereSql}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const totalRow = await queryOne(
      `SELECT COUNT(*) AS n FROM orders o LEFT JOIN customers c ON c.id = o.customer_id LEFT JOIN shipments s ON s.order_id = o.id ${whereSql}`,
      params
    );
    // Always include the global needs-attention count so the dashboard card can show N cheaply.
    const naRow = await queryOne(
      `SELECT COUNT(*) AS n FROM orders o LEFT JOIN shipments s ON s.order_id = o.id
       WHERE o.status = 'PAID' AND (s.id IS NULL OR s.awb IS NULL)`
    );
    res.json({ orders: rows, total: totalRow ? totalRow.n : rows.length, needsAttention: naRow ? naRow.n : 0, limit, offset });
  } catch (e) {
    console.error("[admin.orders]", e.message);
    res.status(500).json({ error: "Could not list orders." });
  }
});

// GET /api/admin/orders/:code — full detail incl. items + address.
admin.get("/orders/:code", async (req, res) => {
  try {
    const code = String(req.params.code || "").slice(0, 32);
    if (!/^[A-Za-z0-9]+$/.test(code)) return res.status(400).json({ error: "Invalid order code." });
    const o = await queryOne(
      `SELECT o.*, c.name AS customer_name, c.phone AS customer_phone,
              s.status AS shipment_status, s.awb, s.courier, s.tracking_url,
              s.shiprocket_order_id, s.shipment_id
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       LEFT JOIN shipments s ON s.order_id = o.id
       WHERE o.order_code = ?`,
      [code]
    );
    if (!o) return res.status(404).json({ error: "Order not found." });
    const items = await query(
      "SELECT product_name, size, quantity, unit_price, line_total FROM order_items WHERE order_id = ?",
      [o.id]
    );
    res.json({ order: o, items });
  } catch (e) {
    console.error("[admin.order-detail]", e.message);
    res.status(500).json({ error: "Could not fetch order." });
  }
});

// PATCH /api/admin/orders/:id/status  body: { status }
// Manual status override (e.g. mark CANCELLED). Validated against the allowlist.
admin.patch("/orders/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid order id." });
    const status = String(req.body && req.body.status || "");
    if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status." });

    const order = await queryOne("SELECT id FROM orders WHERE id = ?", [id]);
    if (!order) return res.status(404).json({ error: "Order not found." });

    await query("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?", [status, id]);
    res.json({ id, status });
  } catch (e) {
    console.error("[admin.status]", e.message);
    res.status(500).json({ error: "Could not update status." });
  }
});
