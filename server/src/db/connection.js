import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testConnection() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT NOW()");
        console.log("Postgres connected ✅", result.rows[0]);
    } finally {
        client.release();
    }
}

