// Shared order fulfillment — the ONLY place a Shiprocket shipment is created.
// Used by the Razorpay webhook and the manual retry endpoint so both paths are
// identical and idempotent.
//
// Idempotency / duplicate-prevention rules (never weaken these):
//   (a) a shipments row exists WITH an awb  → LOCKED; return, never touch it.
//   (b) a row exists WITHOUT an awb          → ATOMIC retry claim (status→PROCESSING);
//                                              only the winner calls Shiprocket.
//   (c) no row                               → INSERT a fresh PROCESSING claim (UNIQUE(order_id)
//                                              lets exactly one concurrent caller win).
// A PROCESSING row older than 5 min is reclaimable (crash-safety). Every UPDATE is
// guarded with `awb IS NULL` so an already-shipped order can never be overwritten.
import { query, queryOne } from "../db/mysql.js";
import { createShipment } from "./shiprocket.js";

export async function fulfillOrder(order) {
  // Only PAID (or already READY_TO_SHIP) orders may be fulfilled.
  if (order.status !== "PAID" && order.status !== "READY_TO_SHIP") {
    return { ok: false, reason: `order not payable (status=${order.status})` };
  }

  const existing = await queryOne("SELECT awb FROM shipments WHERE order_id = ?", [order.id]);
  if (existing && existing.awb) {
    return { ok: true, already: true, awb: existing.awb };
  }
  if (!existing) {
    try {
      await query(
        "INSERT INTO shipments (order_id, provider, status, claimed_at) VALUES (?, 'shiprocket', 'PROCESSING', NOW())",
        [order.id]
      );
      console.log(`[fulfill] ${order.order_code} shipment claim acquired (new).`);
    } catch (claimErr) {
      if (claimErr.code === "ER_DUP_ENTRY") {
        console.log(`[fulfill] ${order.order_code} claimed by a concurrent caller — ignoring.`);
        return { ok: true, concurrent: true };
      }
      throw claimErr;
    }
  } else {
    // Row exists WITHOUT an awb → ATOMIC retry claim. Only one attempt can flip a
    // free/stale row to PROCESSING; a stale PROCESSING (crash mid-call) older than
    // 5 min is reclaimable. If 0 rows change, another attempt owns it → do NOT ship.
    const claim = await query(
      `UPDATE shipments SET status = 'PROCESSING', claimed_at = NOW()
       WHERE order_id = ? AND awb IS NULL
         AND (status <> 'PROCESSING' OR claimed_at < (NOW() - INTERVAL 5 MINUTE))`,
      [order.id]
    );
    if (!claim.affectedRows) {
      console.log(`[fulfill] ${order.order_code} retry already in-flight — not calling Shiprocket.`);
      return { ok: true, inflight: true };
    }
    console.log(`[fulfill] ${order.order_code} retry claim acquired.`);
  }

  const cust = await queryOne("SELECT name, phone FROM customers WHERE id = ?", [order.customer_id]);
  const items = await query(
    "SELECT product_id, product_name, size, quantity, unit_price FROM order_items WHERE order_id = ?",
    [order.id]
  );

  try {
    const ship = await createShipment(
      { ...order, customer_name: cust?.name || "Customer", customer_phone: cust?.phone || "" },
      items || []
    );
    // `awb IS NULL` guard: never overwrite an order that already shipped.
    await query(
      `UPDATE shipments SET
         shiprocket_order_id = ?, shipment_id = ?, awb = ?, courier = ?, tracking_url = ?,
         status = ?, updated_at = NOW()
       WHERE order_id = ? AND awb IS NULL`,
      [
        ship.shiprocket_order_id, ship.shipment_id, ship.awb, ship.courier, ship.tracking_url,
        ship.awb ? "ASSIGNED" : "CREATED", order.id,
      ]
    );
    if (ship.awb) {
      await query("UPDATE orders SET status = 'READY_TO_SHIP', updated_at = NOW() WHERE id = ?", [order.id]);
    }
    console.log(`[fulfill] ${order.order_code} shipment created (awb=${ship.awb || "pending"}, courier=${ship.courier || "-"}).`);
    return { ok: true, awb: ship.awb, courier: ship.courier };
  } catch (se) {
    // Shiprocket down: order STAYS PAID; row marked AWAITING_SHIPMENT so the next
    // webhook re-delivery OR a manual retry will try again.
    console.error(`[fulfill] ${order.order_code} Shiprocket failed — awaiting shipment:`, se.message);
    await query("UPDATE shipments SET status = 'AWAITING_SHIPMENT', updated_at = NOW() WHERE order_id = ? AND awb IS NULL", [order.id]);
    return { ok: false, reason: "shiprocket_failed" };
  }
}
