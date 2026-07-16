import QueryPlan from "../models/queryPlan.model.js";

class QueryPlanRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async saveMany(customerId, planEntries) {
        if (!planEntries || planEntries.length === 0) return;

        const client = await this.pool.connect();
        try {
        await client.query("BEGIN");
            const insertText = `
                INSERT INTO ${QueryPlan.tableName}
                (fingerprint, customer_id, seq_scans, sorts, nested_loops, indexes_used, existing_indexes, stale_statistics, estimated_cost)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;
            for (const entry of planEntries) {
                await client.query(insertText, [
                    entry.fingerprint,
                    customerId,
                    JSON.stringify(entry.seqScans || []),
                    JSON.stringify(entry.sorts || []),
                    JSON.stringify(entry.nestedLoops || []),
                    JSON.stringify(entry.indexesUsed || []),
                    JSON.stringify(entry.existingIndexes || []),
                    JSON.stringify(entry.staleStatistics || []),
                    entry.estimatedCost || 0,
                ]);
            }
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

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