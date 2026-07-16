class QueryPlan {
    static tableName = "query_plans";

    constructor(row = {}) {
        this.id = row.id;
        this.fingerprint = row.fingerprint;
        this.customerId = row.customer_id;
        this.seqScans = row.seq_scans || [];
        this.sorts = row.sorts || [];
        this.nestedLoops = row.nested_loops || [];
        this.indexesUsed = row.indexes_used || [];
        this.existingIndexes = row.existing_indexes || [];
        this.staleStatistics = row.stale_statistics || [];
        this.estimatedCost = row.estimated_cost;
        this.capturedAt = row.captured_at;
    }
}

export default QueryPlan;