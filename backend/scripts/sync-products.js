// Sync Supabase `products` from the frontend app/data.jsx (single source of truth for
// display). Parses the LILY_PRODUCTS array WITHOUT importing the huge base64 images,
// then upserts id/name/price into Supabase. Run whenever prices change:
//
//   node scripts/sync-products.js            # from backend/, with .env populated
//   node scripts/sync-products.js --dry-run  # print what would change, write nothing
//
// Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in backend/.env.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { config } from "../src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../../app/data.jsx");
const dryRun = process.argv.includes("--dry-run");

// Pull id / name / price out of each product object literal, ignoring the image blob.
function parseProducts(src) {
  const out = [];
  // Split on object boundaries that contain an id: "..." — robust to the big image strings.
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

  const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
    auth: { persistSession: false },
  });
  const { error } = await supabase.from("products")
    .upsert(products, { onConflict: "id" });
  if (error) { console.error("Upsert failed:", error.message); process.exit(1); }

  // Optionally deactivate DB products no longer present in data.jsx (kept for order history).
  const ids = products.map(p => p.id);
  const { error: deErr } = await supabase.from("products")
    .update({ active: false }).not("id", "in", `(${ids.map(i => `"${i}"`).join(",")})`);
  if (deErr) console.warn("Deactivate-stale warning:", deErr.message);

  console.log(`\n✓ Synced ${products.length} products to Supabase.`);
}

main().catch(e => { console.error(e); process.exit(1); });
