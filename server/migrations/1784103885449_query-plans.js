export const up = (pgm) => {
  pgm.createTable("query_plans", {
    id: "id",
    fingerprint: { type: "text", notNull: true },
    customer_id: { type: "integer", notNull: true, references: "customers(id)" },
    seq_scans: { type: "jsonb" },
    sorts: { type: "jsonb" },
    nested_loops: { type: "jsonb" },
    indexes_used: { type: "jsonb" },
    existing_indexes: { type: "jsonb" },
    stale_statistics: { type: "jsonb" },
    estimated_cost: { type: "real" },
    captured_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.createIndex("query_plans", ["fingerprint", "customer_id"]);
};

export const down = (pgm) => {
  pgm.dropTable("query_plans");
};