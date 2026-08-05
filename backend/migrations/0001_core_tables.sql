-- Migration 0001 — core tables (products, customers, orders, order_items, shipments)
-- Apply in order. Run in Supabase SQL Editor or via any migration runner.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id          text primary key,
  name        text not null,
  price       integer not null check (price >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null unique,
  email       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists customers_phone_idx on public.customers (phone);

create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  order_code          text unique not null,
  customer_id         uuid not null references public.customers(id) on delete restrict,
  status              text not null default 'CREATED'
                        check (status in ('CREATED','PAID','READY_TO_SHIP','FAILED','CANCELLED')),
  country             text not null default 'India' check (country = 'India'),
  state               text not null,
  city                text not null,
  address             text not null,
  pincode             text not null,
  subtotal            integer not null check (subtotal >= 0),
  distance_km         integer not null default 0 check (distance_km >= 0),
  shipping_fee        integer not null check (shipping_fee between 0 and 300),
  total               integer not null check (total >= 0),
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists orders_customer_idx on public.orders (customer_id);
create index if not exists orders_status_idx   on public.orders (status);
create index if not exists orders_rzp_idx      on public.orders (razorpay_order_id);
create index if not exists orders_created_idx  on public.orders (created_at desc);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   text not null references public.products(id) on delete restrict,
  product_name text not null,
  size         text not null check (size in ('Small','Medium','Large')),
  quantity     integer not null check (quantity > 0),
  unit_price   integer not null check (unit_price >= 0),
  line_total   integer not null check (line_total >= 0),
  created_at   timestamptz not null default now()
);
create index if not exists order_items_order_idx   on public.order_items (order_id);
create index if not exists order_items_product_idx on public.order_items (product_id);

create table if not exists public.shipments (
  id                   uuid primary key default gen_random_uuid(),
  order_id             uuid not null unique references public.orders(id) on delete cascade,
  provider             text not null default 'shiprocket',
  shiprocket_order_id  text,
  shipment_id          text,
  awb                  text,
  courier              text,
  tracking_url         text,
  status               text not null default 'PENDING'
                         check (status in ('PENDING','CREATED','ASSIGNED','SHIPPED','DELIVERED','CANCELLED')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists shipments_order_idx on public.shipments (order_id);
create index if not exists shipments_awb_idx   on public.shipments (awb);
