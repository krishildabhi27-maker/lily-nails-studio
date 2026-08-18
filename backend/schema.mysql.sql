-- ============================================================================
-- Lily Nails Studio — Hostinger MySQL schema
-- Run in hPanel → Databases → phpMyAdmin → your database → SQL tab.
-- Normalized: products · customers · orders · order_items · shipments.
-- Money is stored in WHOLE RUPEES (INT). InnoDB engine, utf8mb4.
-- ============================================================================

-- ── products (authoritative price list; synced from app/data.jsx) ──
CREATE TABLE IF NOT EXISTS products (
  id          VARCHAR(64)  NOT NULL,          -- matches frontend product id, e.g. "royal-elegance"
  name        VARCHAR(255) NOT NULL,
  price       INT          NOT NULL,          -- price in whole rupees (₹)
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── customers ──
CREATE TABLE IF NOT EXISTS customers (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  phone       VARCHAR(32)  NOT NULL,
  email       VARCHAR(255) NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customers_phone (phone)        -- natural key for upsert-by-phone
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── orders ──
CREATE TABLE IF NOT EXISTS orders (
  id                  BIGINT       NOT NULL AUTO_INCREMENT,
  order_code          VARCHAR(32)  NOT NULL,        -- human code shown to customer, e.g. "LN123456"
  customer_id         BIGINT       NOT NULL,
  status              VARCHAR(24)  NOT NULL DEFAULT 'CREATED', -- CREATED|PAYMENT_PENDING|PAID|READY_TO_SHIP|PAYMENT_FAILED|FAILED|CANCELLED
  -- shipping address snapshot (India only)
  country             VARCHAR(64)  NOT NULL DEFAULT 'India',
  state               VARCHAR(96)  NOT NULL,
  city                VARCHAR(96)  NOT NULL,
  address             TEXT         NOT NULL,
  pincode             VARCHAR(12)  NOT NULL,
  -- money (whole rupees)
  subtotal            INT          NOT NULL,
  distance_km         INT          NOT NULL DEFAULT 0,
  shipping_fee        INT          NOT NULL,
  total               INT          NOT NULL,
  -- razorpay
  razorpay_order_id   VARCHAR(64)  NULL,
  razorpay_payment_id VARCHAR(64)  NULL,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_code (order_code),
  UNIQUE KEY uq_orders_rzp (razorpay_order_id),  -- one order per Razorpay order id
  KEY idx_orders_status (status),
  KEY idx_orders_customer (customer_id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── order_items ──
CREATE TABLE IF NOT EXISTS order_items (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  order_id      BIGINT       NOT NULL,
  product_id    VARCHAR(64)  NOT NULL,
  product_name  VARCHAR(255) NOT NULL,           -- snapshot at purchase time
  size          VARCHAR(16)  NOT NULL,           -- Small | Medium | Large
  quantity      INT          NOT NULL,
  unit_price    INT          NOT NULL,           -- snapshot (₹)
  line_total    INT          NOT NULL,
  PRIMARY KEY (id),
  KEY idx_items_order (order_id),
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── shipments (1:1 with orders — UNIQUE(order_id) is the idempotency guard) ──
CREATE TABLE IF NOT EXISTS shipments (
  id                  BIGINT       NOT NULL AUTO_INCREMENT,
  order_id            BIGINT       NOT NULL,
  provider            VARCHAR(32)  NOT NULL DEFAULT 'shiprocket',
  shiprocket_order_id VARCHAR(64)  NULL,
  shipment_id         VARCHAR(64)  NULL,
  awb                 VARCHAR(64)  NULL,
  courier             VARCHAR(128) NULL,
  tracking_url        VARCHAR(255) NULL,
  status              VARCHAR(24)  NOT NULL DEFAULT 'PENDING', -- PENDING|PROCESSING|CREATED|ASSIGNED|AWAITING_SHIPMENT|SHIPPED|DELIVERED|CANCELLED
  claimed_at          DATETIME     NULL,          -- set when a retry claims the row (PROCESSING); enables 5-min stale-lock recovery
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_shipments_order (order_id),      -- exactly one shipment per order (webhook idempotency)
  CONSTRAINT fk_shipments_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
