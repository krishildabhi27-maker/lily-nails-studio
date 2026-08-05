// Local smoke test — exercises the full order flow against a running backend.
// Usage:
//   API_BASE=http://localhost:8080/api node scripts/smoke-test.js
// Requires: backend running, Supabase reachable, products seeded, Razorpay TEST keys.
// It does NOT complete a real card payment (that needs the browser); instead it verifies
// order creation, server-side pricing, input validation, and security guards.
import crypto from "node:crypto";

const API = process.env.API_BASE || "http://localhost:8080/api";
let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name} ${extra}`); }
};
const post = async (path, body) => {
  const r = await fetch(`${API}${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data = {}; try { data = await r.json(); } catch {}
  return { status: r.status, data };
};

const addr = { name: "Test Buyer", phone: "9999900000", address: "1 Test Lane", pincode: "380001", country: "India" };
const CART = [{ id: "royal-elegance", size: "Medium", qty: 1 }];

async function run() {
  console.log(`Smoke test → ${API}\n`);

  // Health
  try {
    const h = await fetch(`${API.replace(/\/api$/, "")}/health`);
    ok("health endpoint", h.ok);
  } catch (e) { ok("health endpoint", false, e.message); }

  // 1) create-order — Ahmedabad (free shipping)
  const ahd = await post("/payments/create-order", { customer: { ...addr, state: "Gujarat", city: "Ahmedabad" }, cart: CART });
  ok("create-order (Ahmedabad) 200", ahd.status === 200, JSON.stringify(ahd.data));
  ok("free shipping for Ahmedabad", ahd.data?.breakdown?.shipping === 0);
  ok("returns razorpayOrderId", !!ahd.data?.razorpayOrderId);
  ok("returns key id, NOT secret", !!ahd.data?.razorpayKeyId && !JSON.stringify(ahd.data).toLowerCase().includes("secret"));

  // 2) create-order — Mumbai (distance shipping)
  const mum = await post("/payments/create-order", { customer: { ...addr, state: "Maharashtra", city: "Mumbai" }, cart: CART });
  ok("create-order (Mumbai) 200", mum.status === 200);
  ok("shipping > 0 for Mumbai", (mum.data?.breakdown?.shipping || 0) > 0);
  ok("total = subtotal + shipping", mum.data?.amount === (mum.data?.breakdown?.subtotal + mum.data?.breakdown?.shipping));

  // 3) price manipulation ignored
  const tamper = await post("/payments/create-order", { customer: { ...addr, state: "Gujarat", city: "Ahmedabad" }, cart: [{ id: "royal-elegance", size: "Medium", qty: 1, price: 1, unit: 1 }] });
  ok("client price ignored (server prices)", tamper.data?.breakdown?.subtotal > 1);

  // 4) validation
  ok("empty cart → 400", (await post("/payments/create-order", { customer: { ...addr, state: "Gujarat", city: "Ahmedabad" }, cart: [] })).status === 400);
  ok("incomplete address → 400", (await post("/payments/create-order", { customer: { name: "x" }, cart: CART })).status === 400);
  ok("non-India → 400", (await post("/payments/create-order", { customer: { ...addr, country: "USA", state: "Gujarat", city: "Ahmedabad" }, cart: CART })).status === 400);
  ok("invalid size → 400", (await post("/payments/create-order", { customer: { ...addr, state: "Gujarat", city: "Ahmedabad" }, cart: [{ id: "royal-elegance", size: "XL", qty: 1 }] })).status === 400);
  ok("unknown product → 400", (await post("/payments/create-order", { customer: { ...addr, state: "Gujarat", city: "Ahmedabad" }, cart: [{ id: "nope", size: "Medium", qty: 1 }] })).status === 400);

  // 5) verify-payment security — forged signature must fail
  const forged = await post("/payments/verify-payment", { razorpay_order_id: ahd.data?.razorpayOrderId || "order_x", razorpay_payment_id: "pay_fake", razorpay_signature: "deadbeef" });
  ok("forged signature rejected", forged.status === 400 && forged.data?.verified !== true);

  // 6) unique order codes across two creates
  ok("order codes are unique", ahd.data?.orderCode && mum.data?.orderCode && ahd.data.orderCode !== mum.data.orderCode);

  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
run().catch(e => { console.error(e); process.exit(1); });
