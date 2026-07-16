/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("query_plans", {
        id: "id",
        fingerprint: { type: "text", notNull: true },
        customer_id: { type: "integer", notNull: true, references: "customers(id)" },
        seq_scan_tables: { type: "jsonb" },
        indexes_used: { type: "jsonb" },
        estimated_cost: { type: "real" },
        captured_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    });
    pgm.createIndex("query_plans", ["fingerprint", "customer_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("query_plans");
};
