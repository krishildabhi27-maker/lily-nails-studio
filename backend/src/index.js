// Express app entry. Wires middleware + routes with production hardening.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config, assertConfig } from "./config.js";
import { orders } from "./routes/orders.js";
import { payments } from "./routes/payments.js";
import { webhook } from "./routes/webhook.js";
import { admin } from "./routes/admin.js";

assertConfig(); // fail fast in production if secrets are missing

const app = express();
app.set("trust proxy", 1); // correct client IPs behind Hostinger's proxy (for rate limiting)

// Security headers.
app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-site" },
  referrerPolicy: { policy: "no-referrer" },
}));

// Request logging (method, path, status, time) — no bodies logged.
app.use(morgan("tiny"));

// Strict CORS allowlist. In production an unknown origin is rejected;
// no-origin (curl/health/webhook) is allowed. If no origins configured in
// production, refuse all browser origins rather than allow-all.
const SELF_HOSTS = new Set();
const corsMw = cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (config.corsOrigins.includes(origin)) return cb(null, true);
    // Always allow the site's OWN origin (same-origin admin.html / homepage),
    // even if CORS_ORIGINS wasn't set — covers the Hostinger temp domain too.
    try {
      const host = (origin || "").replace(/^https?:\/\//, "");
      if (SELF_HOSTS.has(host)) return cb(null, true);
    } catch {}
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-admin-key", "X-Admin-Key"],
});
app.use((req, _res, next) => {
  // Record the host we're actually served on so same-origin requests always pass.
  if (req.headers.host) SELF_HOSTS.add(req.headers.host);
  next();
});
app.use(corsMw);
app.options("*", corsMw); // handle CORS preflight for all routes (incl. /api/admin/*)

// IMPORTANT: webhook needs the RAW body for signature verification —
// mount BEFORE express.json(), with a small size cap.
app.use("/api/webhook", express.raw({ type: "*/*", limit: "256kb" }), webhook);

// JSON for everything else, capped to prevent abuse.
app.use(express.json({ limit: "64kb" }));

// Rate limiting — protect order/payment endpoints from abuse & brute force.
const apiLimiter = rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false });
const writeLimiter = rateLimit({ windowMs: 60_000, max: 15, standardHeaders: true, legacyHeaders: false });

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/orders", apiLimiter, orders);
app.use("/api/payments", writeLimiter, payments);
// Admin API: reflect the caller's origin and always answer the OPTIONS preflight
// with x-admin-key allowed. The ADMIN_KEY check inside the routes is the real
// auth gate, so origin-reflection here does not weaken security.
const adminCors = cors({
  origin: true,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-admin-key", "X-Admin-Key"],
  credentials: false,
});
app.use("/api/admin", adminCors);
app.options("/api/admin/*", adminCors);
app.use("/api/admin", apiLimiter, admin);

// Serve the static frontend (homepage) at / from public/.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../public")));

// Generic error handler — detailed server log, generic client message.
app.use((err, _req, res, _next) => {
  console.error("[error]", err.message);
  if (err.message === "Not allowed by CORS") return res.status(403).json({ error: "Origin not allowed." });
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(config.port, () => {
  console.log(`Lily Nails backend listening on :${config.port} [${config.nodeEnv}]`);
});
