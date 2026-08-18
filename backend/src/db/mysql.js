// MySQL connection pool (Hostinger MySQL). Server-only. Reads config from env.
// This backend uses only Hostinger MySQL for all persistence
// (products, customers, orders, order_items, shipments).
import mysql from "mysql2/promise";
import { config } from "../config.js";

export const pool = mysql.createPool({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "Z",
});

// Small helpers so route code stays terse.
export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}
