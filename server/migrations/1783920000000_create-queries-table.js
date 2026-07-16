/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("queries", {
    id: { type: "serial", primaryKey: true },
    customer_id: {
      type: "integer",
      notNull: true,
      references: "customers(id)",
    },
    sql_text: { type: "text", notNull: true },
    duration_ms: { type: "real", notNull: true, check: "duration_ms >= 0" },
    row_count: { type: "integer", notNull: true, default: 0, check: "row_count >= 0" },
    error: { type: "text" },
    created_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  pgm.createIndex("queries", "customer_id");
  pgm.createIndex("queries", "duration_ms");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("queries");
};