/**
 * Migration: add standard columns for customers and normalize names
 */
export const shorthands = undefined;

export const up = (pgm) => {
  // add new columns if missing
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS api_key text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_name text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS first_name text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_name text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS name text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS email text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS mobile_no text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id integer`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS api_key text`);
  pgm.sql(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT current_timestamp`);

  // attempt to copy data from legacy camelCase columns
  pgm.sql(`UPDATE customers SET api_key = "apiKey" WHERE api_key IS NULL AND "apiKey" IS NOT NULL`);
  pgm.sql(`UPDATE customers SET customer_name = "customerName" WHERE customer_name IS NULL AND "customerName" IS NOT NULL`);

  // populate name from customer_name if present
  pgm.sql(`UPDATE customers SET name = customer_name WHERE name IS NULL AND customer_name IS NOT NULL`);
  // make sure user_id exists (nullable) and api_key unique
  pgm.addConstraint("customers", "customers_api_key_unique", { unique: ["api_key"] });
};

export const down = (pgm) => {
  // do not drop columns in down to avoid data loss — keep migration reversible noop
};
