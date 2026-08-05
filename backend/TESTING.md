# Lily Nails Studio — End-to-End Testing Plan (Step 6)

Complete test coverage before go-live. All tests run against the **backend** with Razorpay in **test mode** and Shiprocket in a **test/sandbox account**. Frontend is only touched if a test reveals a real bug.

Base URL below: `${API}` = `http://localhost:8080/api` locally, or your Render URL.

---

## 1. Backend API tests
| # | Endpoint | Case | Expected |
|---|----------|------|----------|
|1.1|`GET /health`|server up|`200 {ok:true}`|
|1.2|`POST /api/payments/create-order`|valid cart+address (Ahmedabad)|`200`, `amount` = subtotal (shipping 0), `razorpayOrderId`, `razorpayKeyId`; **no key secret in body**|
|1.3|`POST /api/payments/create-order`|valid cart, Mumbai|`200`, shipping > 0, `total` = subtotal+shipping|
|1.4|`POST /api/payments/verify-payment`|correct signature|`200 {verified:true, status:"PAID"}`|
|1.5|`GET /api/orders/:code`|existing code|`200` status/total/tracking|
|1.6|`GET /api/orders/:code`|unknown code|`404`|

## 2. Razorpay test mode
- Use `rzp_test_*` keys. Test card `4111 1111 1111 1111`, any future expiry, any CVV, OTP `1234`.
- 2.1 Successful capture → order becomes PAID (via verify + webhook).
- 2.2 Failed card (`4000 0000 0000 0002`) → order stays CREATED, cart preserved.
- 2.3 Confirm `razorpay_payment_id` stored on the order row.

## 3. Shiprocket sandbox/testing
- Test API user; a real pickup address configured.
- 3.1 After PAID webhook → one `shipments` row created, status `CREATED`/`ASSIGNED`.
- 3.2 AWB + courier + tracking_url populated when assignment succeeds.
- 3.3 Simulate Shiprocket down (wrong creds/offline) → order stays **PAID**, shipment row `AWAITING_SHIPMENT`, no crash.

## 4. Database verification (Supabase SQL editor)
- 4.1 `select count(*) from orders` increments by 1 per checkout.
- 4.2 `order_items` rows match cart lines; `line_total = unit_price*quantity`.
- 4.3 `customers` deduped by phone (repeat buyer → same row).
- 4.4 `shipments` has **at most one row per order_id** (unique).
- 4.5 `total = subtotal + shipping_fee`; `shipping_fee between 0 and 300`.

## 5. Duplicate webhook tests
- 5.1 POST the same `payment.captured` webhook **twice** → second returns fast, **no second shipment**, logs "duplicate ignored".
- 5.2 Fire 5 identical webhooks concurrently → exactly **one** shipments row (DB unique claim).

## 6. Duplicate payment prevention
- 6.1 Call `verify-payment` twice with same ids → second returns `{verified:true}` idempotently, status unchanged, no duplicate side effects.
- 6.2 Re-submitting checkout creates a **new** order code (never reuses/overwrites a PAID order).

## 7. Payment cancellation
- 7.1 Open Razorpay, close popup → `ondismiss`: cart intact, button re-enabled, toast "Payment cancelled.", no order marked PAID.

## 8. Network failure recovery
- 8.1 Kill backend, click Place Order → caught error toast, cart intact, button re-enabled.
- 8.2 Backend up but Razorpay script blocked → "Could not load payment gateway.", cart intact.
- 8.3 verify-payment network drop after capture → toast shown; webhook still marks PAID server-side (source of truth).

## 9. Invalid input tests
- 9.1 Empty cart → `400 Missing customer or cart.`
- 9.2 Missing address field → `400 Incomplete address.`
- 9.3 `country:"USA"` → `400 We currently deliver only within India.`
- 9.4 Invalid size → `400 Invalid size…`
- 9.5 Unknown/inactive product id → `400 Unavailable item…`
- 9.6 qty = 0 or 9999 → clamped to 1..99 server-side.

## 10. Security tests
- 10.1 Client sends `price: 1` → ignored; DB price charged (price-manipulation blocked).
- 10.2 Client sends `total: 1` → ignored; server total used.
- 10.3 `verify-payment` with forged signature → `400`, order NOT paid.
- 10.4 Webhook with bad `x-razorpay-signature` → `400`, no state change.
- 10.5 Response bodies never contain key secret / webhook secret / Shiprocket creds.
- 10.6 CORS: request from a non-allowed origin is rejected.
- 10.7 Amount mismatch (paid ≠ priced) → order `FAILED`, no shipment.

## 11. Order lifecycle tests
- CREATED → (pay) → PAID → (ship) → READY_TO_SHIP. Also: CREATED → (fail/mismatch) → FAILED. Verify no illegal transitions (a FAILED/CANCELLED order never ships).

## 12. Shipping lifecycle tests
- PENDING (claim) → CREATED/ASSIGNED (success) OR AWAITING_SHIPMENT (Shiprocket down). Confirm tracking surfaces via `GET /api/orders/:code` once assigned.

---

## Production launch checklist
- [ ] Supabase: `schema.sql` + migrations applied; `products` seeded and synced (`npm run sync-products`).
- [ ] All env vars set on Render (Supabase, Razorpay **live**, Shiprocket, CORS_ORIGINS = your Netlify domain).
- [ ] Razorpay switched from test → **live** keys after KYC; webhook URL points to Render `/api/webhook/razorpay`; webhook secret matches.
- [ ] Shiprocket live API user + real pickup address + wallet funded.
- [ ] `window.LILY_API_BASE` set to the Render URL on the deployed frontend.
- [ ] HTTPS everywhere; CORS locked to the Netlify origin only.
- [ ] Rate limiting enabled (Step 7).
- [ ] Smoke test (`npm run smoke`) passes against staging.
- [ ] One real ₹ transaction end-to-end, then refunded.

## Remaining blockers before go-live
1. **Rate limiting not yet added** — planned for Step 7 (security).
2. **Live KYC** — Razorpay + Shiprocket live modes need business verification (your action).
3. **`GET /api/orders/:code`** currently returns limited fields; success page tracking works, but confirm it returns `awb`/`tracking_url` after the shipments refactor (verify in test 1.5 / 3.2).
4. **No automated retry** for `AWAITING_SHIPMENT` orders yet — currently manual; optional cron in a later step.
5. **Deployment files** (Netlify/Render) intentionally deferred to Step 8.
