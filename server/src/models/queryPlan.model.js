class QueryPlan {
    static tableName = "query_plans";

    constructor(row = {}) {
        this.id = row.id;
        this.fingerprint = row.fingerprint;
        this.customerId = row.customer_id;
        this.seqScanTables = row.seq_scan_tables || [];
        this.indexesUsed = row.indexes_used || [];
        this.estimatedCost = row.estimated_cost;
        this.capturedAt = row.captured_at;
    }
}

export default QueryPlan;