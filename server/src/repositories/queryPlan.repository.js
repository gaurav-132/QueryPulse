import QueryPlan from "../models/queryPlan.model.js";

class QueryPlanRepository {
    constructor(pool) {
        this.pool = pool;
    }

      async saveMany(customerId, planEntries) {
        if (planEntries.length === 0) return;

        const values = [];
        const placeholders = planEntries.map((entry, i) => {
            const offset = i * 5;
            values.push(
            entry.fingerprint,
            customerId,
            JSON.stringify(entry.seqScans || []),
            JSON.stringify(entry.indexesUsed || []),
            entry.estimatedCost || 0
            );
            return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
        });

        await this.pool.query(
            `INSERT INTO ${QueryPlan.tableName} (fingerprint, customer_id, seq_scan_tables, indexes_used, estimated_cost)
            VALUES ${placeholders.join(", ")}`,
            values
        );
    }

    // async save(customerId, fingerprint, signals) {
    //     await this.pool.query(
    //         `INSERT INTO ${QueryPlan.tableName} (fingerprint, customer_id, seq_scan_tables, indexes_used, estimated_cost)
    //         VALUES ($1, $2, $3, $4, $5)`,
    //         [fingerprint, customerId, JSON.stringify(signals.seqScans || []), JSON.stringify(signals.indexesUsed || []), signals.estimatedCost || 0]
    //     );
    // }

    async getLatestByFingerprint(customerId, fingerprint) {
        const { rows } = await this.pool.query(
            `SELECT * FROM ${QueryPlan.tableName}
            WHERE customer_id = $1 AND fingerprint = $2
            ORDER BY captured_at DESC LIMIT 1`,
            [customerId, fingerprint]
        );
        return rows[0] ? new QueryPlan(rows[0]) : null;
    }
}

export default QueryPlanRepository;