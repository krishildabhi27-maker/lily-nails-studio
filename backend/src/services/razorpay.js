// Razorpay client + webhook signature verification.
import Razorpay from "razorpay";
import crypto from "node:crypto";
import { config } from "../config.js";

export const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

// Create a Razorpay order for an amount in whole rupees.
// orderCode is the unique receipt; caller guarantees uniqueness.
export async function createRazorpayOrder(amountRupees, orderCode) {
  return razorpay.orders.create({
    amount: Math.round(amountRupees * 100), // paise
    currency: "INR",
    receipt: orderCode,
    notes: { order_code: orderCode },
  });
}

// Collision-proof order code: LN + base36 timestamp + 4 random base36 chars.
// ~1 in 1.6M chance of collision within the same millisecond; the DB unique
// constraint on order_code is the final guard (caller retries on conflict).
export function generateOrderCode() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString("hex").slice(0, 4).toUpperCase();
  return `LN${ts}${rand}`;
}

// Verify the webhook payload against the signature header (HMAC-SHA256 of the RAW body).
export function verifyWebhookSignature(rawBody, signature) {
  const expected = crypto
    .createHmac("sha256", config.razorpay.webhookSecret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ""));
  } catch {
    return false;
  }
}

// Verify the client-side Checkout callback: HMAC-SHA256(order_id|payment_id) with the KEY SECRET.
export function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, signature) {
  const expected = crypto
    .createHmac("sha256", config.razorpay.keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ""));
  } catch {
    return false;
  }
}
