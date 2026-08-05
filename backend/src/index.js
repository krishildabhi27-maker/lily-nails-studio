// Express app entry. Wires middleware + routes with production hardening.
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config, assertConfig } from "./config.js";
import { orders } from "./routes/orders.js";
import { payments } from "./routes/payments.js";
import { webhook } from "./routes/webhook.js";

assertConfig(); // fail fast in production if secrets are missing

const app = express();
app.set("trust proxy", 1); // correct client IPs behind Render's proxy (for rate limiting)

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
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (config.corsOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
}));

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

// Generic error handler — detailed server log, generic client message.
app.use((err, _req, res, _next) => {
  console.error("[error]", err.message);
  if (err.message === "Not allowed by CORS") return res.status(403).json({ error: "Origin not allowed." });
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(config.port, () => {
  console.log(`Lily Nails backend listening on :${config.port} [${config.nodeEnv}]`);
});
