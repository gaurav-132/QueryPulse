/**
 * Migration: create `users` table
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("users", {
    id: { type: "serial", primaryKey: true },
    first_name: { type: "text", notNull: true },
    last_name: { type: "text", notNull: true },
    name: { type: "text", notNull: true },
    email: { type: "text", notNull: true, unique: true },
    mobile_no: { type: "text" },
    password_hash: { type: "text", notNull: true },
    created_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.createIndex("users", "email");
};

export const down = (pgm) => {
  pgm.dropTable("users");
};
