// Sync the MySQL `products` table from the frontend app/data.jsx (single source of truth for
// display). Parses the LILY_PRODUCTS array WITHOUT importing the huge base64 images,
// then upserts id/name/price into MySQL. Run whenever prices change:
//
//   node scripts/sync-products.js            # from backend/, with .env populated
//   node scripts/sync-products.js --dry-run  # print what would change, write nothing
//
// Requires MYSQL_HOST/PORT/USER/PASSWORD/DATABASE in backend/.env.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../src/db/mysql.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../../app/data.jsx");
const dryRun = process.argv.includes("--dry-run");

// Pull id / name / price out of each product object literal, ignoring the image blob.
function parseProducts(src) {
  const out = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?name:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?price:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    const id = m[1];
    const name = m[2].replace(/\\"/g, '"');
    const price = Number(String(m[3]).replace(/[^0-9.]/g, "")) || 0;
    if (id && price > 0) out.push({ id, name, price, active: true });
  }
  return out;
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Cannot find ${DATA_PATH}`); process.exit(1);
  }
  const src = fs.readFileSync(DATA_PATH, "utf8");
  const products = parseProducts(src);
  if (products.length === 0) { console.error("No products parsed — aborting."); process.exit(1); }

  console.log(`Parsed ${products.length} products from app/data.jsx:`);
  for (const p of products) console.log(`  ${p.id.padEnd(20)} ₹${p.price}  ${p.name}`);

  if (dryRun) { console.log("\n--dry-run: nothing written."); return; }

  // Upsert each product (insert or update name/price/active).
  for (const p of products) {
    await pool.query(
      `INSERT INTO products (id, name, price, active) VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), active = 1`,
      [p.id, p.name, p.price]
    );
  }

  // Deactivate DB products no longer present in data.jsx (kept for order history).
  const ids = products.map(p => p.id);
  const placeholders = ids.map(() => "?").join(",");
  await pool.query(`UPDATE products SET active = 0 WHERE id NOT IN (${placeholders})`, ids);

  console.log(`\n✓ Synced ${products.length} products to MySQL.`);
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
