// Shiprocket API wrapper: token auth (cached) + create order → get AWB/tracking.
// Uses global fetch (Node 20+). All calls are server-side only.
import { config } from "../config.js";

const BASE = "https://apiv2.shiprocket.in/v1/external";
let cachedToken = null;
let tokenExpiry = 0;

// fetch with a hard timeout so a hung Shiprocket call can't stall the webhook.
async function tfetch(url, opts) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), config.externalTimeoutMs);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const res = await tfetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: config.shiprocket.email, password: config.shiprocket.password }),
  });
  if (!res.ok) throw new Error(`Shiprocket auth failed: ${res.status}`); // never logs credentials
  const data = await res.json();
  cachedToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // tokens last ~10 days; refresh at 9
  return cachedToken;
}

async function sr(path, method, body) {
  const token = await getToken();
  const res = await tfetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Shiprocket ${path} ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

// Create a Shiprocket order from a paid DB order row + its items, then assign a courier/AWB.
// `order` is the orders row; `items` is the order_items rows for it.
// Returns { shiprocket_order_id, shipment_id, awb, courier, tracking_url }.
export async function createShipment(order, items) {
  const payload = {
    order_id: order.order_code,
    order_date: new Date(order.created_at).toISOString().slice(0, 10),
    pickup_location: config.shiprocket.pickupLocation,
    billing_customer_name: order.customer_name,
    billing_last_name: "",
    billing_address: order.address,
    billing_city: order.city,
    billing_pincode: order.pincode,
    billing_state: order.state,
    billing_country: "India",
    billing_email: `${order.order_code.toLowerCase()}@orders.lilynails`,
    billing_phone: order.customer_phone,
    shipping_is_billing: true,
    order_items: (items || []).map(i => ({
      name: `${i.product_name} (${i.size})`,
      sku: `${i.product_id}-${i.size}`,
      units: i.quantity,
      selling_price: i.unit_price,
    })),
    payment_method: "Prepaid",
    sub_total: order.subtotal,
    length: config.parcel.length,
    breadth: config.parcel.breadth,
    height: config.parcel.height,
    weight: config.parcel.weight,
  };

  // 1) Create the order → returns order id + shipment id (no AWB yet).
  const created = await sr("/orders/create/adhoc", "POST", payload);
  const shipmentId = created.shipment_id;

  let awb = null, courier = null;
  // 2) Assign an AWB (auto-picks cheapest courier). Non-fatal if it fails — can retry later.
  if (shipmentId) {
    try {
      const assigned = await sr("/courier/assign/awb", "POST", { shipment_id: shipmentId });
      const d = assigned?.response?.data || {};
      awb = d.awb_code || created.awb_code || null;
      courier = d.courier_name || null;
    } catch (e) {
      console.error("[shiprocket.assignAwb]", e.message);
    }
  }

  return {
    shiprocket_order_id: String(created.order_id || ""),
    shipment_id: shipmentId ? String(shipmentId) : null,
    awb,
    courier,
    tracking_url: awb ? `https://shiprocket.co/tracking/${awb}` : null,
  };
}
