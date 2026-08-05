-- Migration 0002 — triggers + Row Level Security
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

alter table public.products    enable row level security;
alter table public.customers   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.shipments   enable row level security;

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
  for select using (active = true);
