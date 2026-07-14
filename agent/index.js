/**
 * querypulse
 * ------------
 * Usage in a customer's app (Postgres, the default):
 *
 *   import { Pool } from "pg";
 *   import querypulse from "querypulse";
 *
 *   querypulse.init({ apiKey: "their-key", endpoint: "https://api.querypulse.dev" });
 *   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
 *   querypulse.wrap(pool); // Postgres by default
 *
 * Usage with MySQL instead:
 *
 *   import { MySqlAdapter } from "querypulse/adapters/MySqlAdapter.js";
 *   querypulse.wrap(pool, new MySqlAdapter());
 */
import { configure } from "./src/config.js";
import { startFlushLoop, flush } from "./src/buffer.js";
import { wrapPool } from "./src/wrapQuery.js";
import { PostgresAdapter } from "./src/adapters/PostgresAdapter.js";

function init(userConfig) {
    configure(userConfig);
    startFlushLoop();
}

function wrap(pool, adapter = new PostgresAdapter()) {
    return wrapPool(pool, adapter);
}

export default { init, wrap, flush };
export { init, wrap, flush };
export { PostgresAdapter } from "./src/adapters/PostgresAdapter.js";
export { MySqlAdapter } from "./src/adapters/MySqlAdapter.js";