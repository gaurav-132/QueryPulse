import pg from "pg";
import querypulse from "querypulse";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

querypulse.init({
  apiKey: process.env.QUERYPULSE_API_KEY,
  endpoint: "http://localhost:3000",
  flushIntervalMs: 3000,
  slowQueryThresholdMs: 50,
  planCaptureCooldownMs: 5000, // shorter cooldown just for this test
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
querypulse.wrap(pool);

console.log("Running the same un-indexed lookup 15 times...");
for (let i = 0; i < 15; i++) {
  const randomSku = `SKU-${Math.floor(Math.random() * 200000)}`;
  await pool.query("SELECT * FROM test_products WHERE sku = $1", [randomSku]);
  console.log(`  run ${i + 1} done`);
}

console.log("Waiting for flush...");
await new Promise((r) => setTimeout(r, 4000));
await querypulse.flush();
await pool.end();
console.log("Done.");