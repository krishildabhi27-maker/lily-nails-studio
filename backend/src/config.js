// Loads and validates environment variables once, exports a typed config object.
import dotenv from "dotenv";
dotenv.config();

const missing = [];
function need(key) {
  const v = process.env[key];
  if (!v) missing.push(key);
  return v || "";
}

export const config = {
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: (process.env.CORS_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean),
  supabase: {
    url: need("SUPABASE_URL"),
    serviceKey: need("SUPABASE_SERVICE_ROLE_KEY"),
  },
  razorpay: {
    keyId: need("RAZORPAY_KEY_ID"),
    keySecret: need("RAZORPAY_KEY_SECRET"),
    webhookSecret: need("RAZORPAY_WEBHOOK_SECRET"),
  },
  shiprocket: {
    email: need("SHIPROCKET_EMAIL"),
    password: need("SHIPROCKET_PASSWORD"),
    pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
  },
  parcel: {
    length: Number(process.env.PARCEL_LENGTH_CM || 15),
    breadth: Number(process.env.PARCEL_BREADTH_CM || 12),
    height: Number(process.env.PARCEL_HEIGHT_CM || 3),
    weight: Number(process.env.PARCEL_WEIGHT_KG || 0.3),
  },
  externalTimeoutMs: Number(process.env.EXTERNAL_TIMEOUT_MS || 12000),
};

// Fail fast in production if any critical secret is missing; warn in dev.
export function assertConfig() {
  if (missing.length === 0) return;
  const msg = `Missing required env vars: ${missing.join(", ")}`;
  if (config.nodeEnv === "production") {
    console.error(`[config] ${msg} — refusing to start.`);
    process.exit(1);
  }
  console.warn(`[config] ${msg} — related features will fail until set.`);
}
