# Lily Nails Studio — Backend

Production backend for the Lily Nails Studio store. **Node.js + Express + Hostinger MySQL + Razorpay + Shiprocket.** The existing frontend is untouched — this runs as a separate service the site calls at checkout.

## What it does
1. Prices every order **on the server** (products + shipping brackets) — the browser can't set the price.
2. Creates a **Razorpay** order and returns only what the browser needs to open Checkout.
3. Marks an order **PAID only via the Razorpay webhook** (HMAC-verified, amount-checked) — never on the client's word.
4. On payment, creates a **Shiprocket** shipment and stores AWB + tracking.
5. Persists everything in **Hostinger MySQL**.

## Folder structure
```
backend/
├─ package.json          Dependencies + start scripts (ES modules, Node 20+)
├─ .env.example          Every env var you must set (copy → .env)
├─ .gitignore            Keeps node_modules/.env out of git
├─ schema.mysql.sql      MySQL tables — run once in phpMyAdmin
└─ src/
   ├─ index.js           Express app: middleware + route wiring + health check
   ├─ config.js          Loads/validates env vars into one config object
   ├─ db/
   │   └─ mysql.js       MySQL connection pool (server-only)
   ├─ services/
   │   ├─ shipping.js    Server copy of the distance brackets (source of truth for shipping)
   │   ├─ razorpay.js    Razorpay client + create-order + webhook signature verify
   │   └─ shiprocket.js  Shiprocket token auth (cached) + create shipment
   └─ routes/
       ├─ orders.js      POST /api/orders (price+create), GET /api/orders/:code (status)
       └─ webhook.js     POST /api/webhook/razorpay (verify → PAID → ship)
```

## File-by-file
- **package.json** — ESM project; `npm start` runs the server, `npm run dev` watches. Deps: express, mysql2, razorpay, cors, helmet, morgan, dotenv, express-rate-limit.
- **.env.example** — server port + CORS origins; MySQL host/port/user/password/database; Razorpay key id/secret + webhook secret; Shiprocket email/password + pickup location; default parcel size/weight. Copy to `.env` and fill in.
- **schema.mysql.sql** — `products` · `customers` · `orders` · `order_items` · `shipments` tables with indexes and a `UNIQUE(order_id)` on shipments (webhook idempotency guard).
- **src/config.js** — reads env once, warns on anything missing.
- **src/db/mysql.js** — one mysql2 connection pool (server-only) with `query`/`queryOne` helpers.
- **src/services/shipping.js** — the SAME bracket logic as the frontend `app/india.jsx` (Ahmedabad free, distance brackets capped ₹300). This server value is the one that's charged.
- **src/services/razorpay.js** — creates Razorpay orders (amount in paise) and verifies webhook signatures with a timing-safe HMAC compare.
- **src/services/shiprocket.js** — logs in for a token (cached ~9 days), then creates an ad-hoc order and returns Shiprocket order id / AWB / tracking URL.
- **src/routes/orders.js** — `POST /api/orders`: validates India-only address, looks up real prices from `products`, recomputes subtotal + shipping, stores a `CREATED` order, creates the Razorpay order, returns `{orderCode, amount, razorpayOrderId, razorpayKeyId, breakdown}`. `GET /api/orders/:code`: status + tracking for the confirmation screen.
- **src/routes/webhook.js** — `POST /api/webhook/razorpay`: verifies the signature over the RAW body, checks the captured amount equals the priced total, flips the order to `PAID`, then creates the Shiprocket shipment and sets `READY_TO_SHIP`. Idempotent (won't double-process).
- **src/index.js** — mounts the webhook with a **raw** body parser (needed for signature verification) BEFORE `express.json()`, adds helmet/cors/logging, exposes `/health`.

## Setup
1. **MySQL** — hPanel → Databases → phpMyAdmin → open your database → SQL tab → run `schema.mysql.sql`. Seed `products` with your ids + prices (whole rupees):
   ```sql
   INSERT INTO products (id,name,price) VALUES
     ('royal-elegance','Royal Elegance',899),
     ('blooming-blush','Blooming in Blush',799);
   -- …one row per product id used in the frontend (or run `npm run sync-products`)
   ```
2. `cp .env.example .env` and fill in MySQL, Razorpay (test keys first), and Shiprocket values.
3. `npm install` then `npm start` (or `npm run dev`).
4. **Razorpay Dashboard → Webhooks** → add `https://YOUR_BACKEND/api/webhook/razorpay`, subscribe to `payment.captured` (and `order.paid`), set the secret to match `RAZORPAY_WEBHOOK_SECRET`.

## Deploy
- **Backend + DB + Frontend:** all on **Hostinger** — see `DEPLOYMENT.md` for exact steps.
- **DB:** Hostinger MySQL (create via hPanel → Databases).
- **Frontend:** static `index.html` in `public_html`; point checkout at `https://YOUR_BACKEND/api` via `window.LILY_API_BASE`.
- Requires HTTPS. Start in Razorpay/Shiprocket **test/sandbox** mode; go live after KYC.

## Frontend wiring (later, with your approval)
Only `placeOrder()` in `app/CartDrawer.jsx` changes: instead of a local-only order, it `POST`s the cart + address to `/api/orders`, opens Razorpay Checkout with the returned ids, then polls `GET /api/orders/:code` until `PAID`/`READY_TO_SHIP`. No visual/redesign changes. **Not done yet — say the word.**
