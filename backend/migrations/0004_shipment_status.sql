-- Migration 0004 — add AWAITING_SHIPMENT status so a PAID order whose Shiprocket
-- call failed can be recorded as awaiting shipment (not failed).
alter table public.shipments drop constraint if exists shipments_status_check;
alter table public.shipments add constraint shipments_status_check
  check (status in ('PENDING','AWAITING_SHIPMENT','CREATED','ASSIGNED','SHIPPED','DELIVERED','CANCELLED'));
