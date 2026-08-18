# Lily Nails Studio — Security Audit (Step 7)

Backend-only production security audit. Scope: `backend/`. Frontend untouched.

## Issues found & status

| # | Issue | Severity | Status |
|---|-------|----------|--------|
|1|No rate limiting — endpoints open to abuse/brute force|High|**Fixed** — `express-rate-limit`: 60/min on `/api/orders`, 15/min on `/api/payments`.|
|2|CORS allowed all origins when `CORS_ORIGINS` empty|High|**Fixed** — strict allowlist; unknown browser origins → 403. No-origin (curl/webhook) still allowed.|
|3|Missing secrets only warned, server still booted|High|**Fixed** — `assertConfig()` exits in production if any required secret is absent.|
|4|Stale `POST /api/orders` referenced the pre-normalized schema (`customer_name`/`items` on orders) — would crash & bypass the hardened path|High|**Fixed** — removed; canonical create is `POST /api/payments/create-order`.|
|5|`GET /api/orders/:code` read `shiprocket_awb`/`tracking_url` off `orders` (moved to `shipments`) — returned nothing|High|**Fixed** — now joins `shipments`; returns `shipment_status, awb, courier, tracking_url`.|
|6|No request-size limits|Medium|**Fixed** — JSON cap 64kb, webhook raw cap 256kb.|
|7|No timeout on Shiprocket calls — a hang could stall the webhook|Medium|**Fixed** — `AbortController` timeout (`EXTERNAL_TIMEOUT_MS`, default 12s).|
|8|Generic error handler missing — risk of leaking internals|Medium|**Fixed** — central handler: full detail to server log, generic message to client.|
|9|Helmet used defaults only|Low|**Fixed** — added CORP `same-site` + `no-referrer`.|
|10|`:code` param not validated (injection surface)|Medium|**Fixed** — alphanumeric + length check before query.|
|11|Order code collisions under load|Medium|**Fixed (Step 3)** — random-suffix code + DB unique + retry.|
|12|Duplicate shipments under concurrent webhooks|High|**Fixed (Step 4)** — atomic DB claim on `shipments.UNIQUE(order_id)`.|
|13|Webhook replay/forgery|High|**Already safe** — HMAC signature verify + amount match + idempotent state guards.|
|14|Client price/total manipulation|High|**Already safe** — server prices from `products`; client values ignored.|
|15|Secret leakage in responses|High|**Verified safe** — only `razorpayKeyId` (public) returned; no secret/cred in any response body.|

## Requirement coverage (1–13 from the request)
1. Rate limiting ✅  2. Strict CORS allowlist ✅  3. Env validation at startup ✅  4. Generic client errors ✅  5. Detailed server-side logging only ✅  6. Input validation on every endpoint ✅  7. `GET /api/orders/:code` returns shipment status/AWB/courier/tracking ✅  8. No sensitive info in responses ✅  9. Helmet reviewed/hardened ✅  10. Webhook replay protection ✅ (HMAC + idempotency)  11. Request size limits ✅  12. External API timeouts ✅  13. Secrets backend-only ✅

## Remaining (non-blocking) items
- **Auto-retry for `AWAITING_SHIPMENT`** — currently manual; recommend a scheduled job post-launch.
- **Live KYC** — Razorpay + Shiprocket live modes require business verification (your action, not code).
- **Persistent rate-limit store** — in-memory limiter resets per instance; fine for a single Hostinger instance, use Redis if you scale horizontally.
- **Structured logging/alerting** — console logs are adequate for launch; add a log drain later.

## Production readiness score: 92 / 100
**Justification:** All high-severity issues are fixed or already-safe: server-side pricing, signature-verified payments, atomic single-shipment guarantee, strict CORS, rate limits, startup secret validation, request caps, timeouts, and no secret leakage. The −8 reflects operational items outside code — live KYC activation, no automated AWAITING_SHIPMENT retry, single-instance in-memory rate limiting, and basic (console) observability. None block a controlled launch; all are standard post-launch hardening.
