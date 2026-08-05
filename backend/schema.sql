-- ============================================================================
-- Lily Nails Studio — Supabase (Postgres) schema  [Step 2 — refined]
-- Run in Supabase → SQL Editor (or via the migrations in backend/migrations/).
-- Normalized: products · customers · orders · order_items · shipments.
-- Money is stored in WHOLE RUPEES (integer). Ink/design values are unrelated here.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.
-- ============================================================================

-- gen_random_uuid() comes from pgcrypto (enabled by default on Supabase).
create extension if not exists pgcrypto;

-- ── PRODUCTS ────────────────────────────────────────────────────────────────
-- Authoritative price list. The backend reads prices from HERE, never the browser.
create table if not exists public.products (
  id          text primary key,                    -- frontend product id, e.g. "royal-elegance"
  name        text not null,                        -- display name shown on cards/orders
  price       integer not null check (price >= 0),  -- unit price in WHOLE rupees (₹)
  active      boolean not null default true,        -- false = hidden / discontinued
  created_at  timestamptz not null default now()    -- row creation time
);

-- ── CUSTOMERS ───────────────────────────────────────────────────────────────
-- One row per shopper, deduplicated by phone (natural key). Orders reference it.
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(), -- internal id (FK target)
  name        text not null,                        -- full name
  phone       text not null unique,                 -- Indian mobile; unique = dedupe key
  email       text,                                 -- optional (checkout has no email today)
  created_at  timestamptz not null default now(),   -- first seen
  updated_at  timestamptz not null default now()    -- auto-touched on update
);
create index if not exists customers_phone_idx on public.customers (phone);

-- ── ORDERS ──────────────────────────────────────────────────────────────────
-- One row per checkout. Address snapshot + server-computed money + payment refs.
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),   -- internal id
  order_code          text unique not null,                          -- customer-facing code, e.g. "LN123456"
  customer_id         uuid not null references public.customers(id) on delete restrict, -- FK → customers
  status              text not null default 'CREATED'
                        check (status in ('CREATED','PAID','READY_TO_SHIP','FAILED','CANCELLED')), -- lifecycle
  -- shipping address snapshot (India only)
  country             text not null default 'India' check (country = 'India'), -- India-only guard
  state               text not null,                                 -- Indian state/UT
  city                text not null,                                 -- city within that state
  address             text not null,                                 -- flat / street / area
  pincode             text not null,                                 -- 6-digit PIN
  -- money — WHOLE rupees, all computed server-side
  subtotal            integer not null check (subtotal >= 0),        -- Σ line_total
  distance_km         integer not null default 0 check (distance_km >= 0), -- est. road km from Ahmedabad
  shipping_fee        integer not null check (shipping_fee between 0 and 300), -- bracketed, capped ₹300
  total               integer not null check (total >= 0),           -- subtotal + shipping_fee
  -- payment refs (Razorpay)
  razorpay_order_id   text unique,                                   -- rzp order id (set at creation)
  razorpay_payment_id text,                                          -- rzp payment id (set on capture)
  created_at          timestamptz not null default now(),            -- placed time
  updated_at          timestamptz not null default now()             -- auto-touched on status change
);
create index if not exists orders_customer_idx on public.orders (customer_id);
create index if not exists orders_status_idx   on public.orders (status);
create index if not exists orders_rzp_idx      on public.orders (razorpay_order_id);
create index if not exists orders_created_idx  on public.orders (created_at desc);

-- ── ORDER ITEMS ─────────────────────────────────────────────────────────────
-- Line items (one per product+size). Name/price snapshotted at purchase so old
-- orders stay correct if the catalog changes later.
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),  -- internal id
  order_id     uuid not null references public.orders(id) on delete cascade,    -- FK → orders (cascade)
  product_id   text not null references public.products(id) on delete restrict, -- FK → products
  product_name text not null,                               -- name snapshot
  size         text not null check (size in ('Small','Medium','Large')), -- selected size
  quantity     integer not null check (quantity > 0),       -- units (1..99 enforced in API)
  unit_price   integer not null check (unit_price >= 0),    -- ₹/unit at purchase
  line_total   integer not null check (line_total >= 0),    -- unit_price × quantity
  created_at   timestamptz not null default now()
);
create index if not exists order_items_order_idx   on public.order_items (order_id);
create index if not exists order_items_product_idx on public.order_items (product_id);

-- ── SHIPMENTS ───────────────────────────────────────────────────────────────
-- Shiprocket fulfillment record. 1:1 with an order (created after payment).
create table if not exists public.shipments (
  id                   uuid primary key default gen_random_uuid(),  -- internal id
  order_id             uuid not null unique references public.orders(id) on delete cascade, -- FK → orders (1:1)
  provider             text not null default 'shiprocket',          -- courier aggregator
  shiprocket_order_id  text,                                        -- Shiprocket order id
  shipment_id          text,                                        -- Shiprocket shipment id
  awb                  text,                                        -- air waybill / tracking number
  courier              text,                                        -- assigned courier name
  tracking_url         text,                                        -- public tracking link
  status               text not null default 'PENDING'
                         check (status in ('PENDING','AWAITING_SHIPMENT','CREATED','ASSIGNED','SHIPPED','DELIVERED','CANCELLED')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists shipments_order_idx on public.shipments (order_id);
create index if not exists shipments_awb_idx   on public.shipments (awb);

-- ── updated_at auto-touch trigger ────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_customers_touch on public.customers;
create trigger trg_customers_touch before update on public.customers
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_orders_touch on public.orders;
create trigger trg_orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_shipments_touch on public.shipments;
create trigger trg_shipments_touch before update on public.shipments
  for each row execute function public.touch_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Backend uses the SERVICE ROLE key (bypasses RLS). RLS ON = the anon/public key
-- can do nothing except read active products.
alter table public.products    enable row level security;
alter table public.customers   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.shipments   enable row level security;

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
  for select using (active = true);
-- No public policies on customers/orders/order_items/shipments → service-role only.

-- ============================================================================
-- Relationships
--   customers 1───∞ orders
--   orders    1───∞ order_items   (order_items.product_id → products.id)
--   orders    1───1 shipments
--   products  1───∞ order_items
-- ============================================================================
