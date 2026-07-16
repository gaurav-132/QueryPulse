import QueryLog from "../models/query.model.js";

class QueryRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async insertMany(customerId, rows) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const insertText = `
                INSERT INTO queries
                (customer_id, sql_text, duration_ms, row_count, error, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            for (const q of rows) {
                await client.query(insertText, [
                    customerId,
                    q.sql || q.sqlText || q.sql_text,
                    q.durationMs || q.duration_ms,
                    q.rowCount || q.row_count || 0,
                    q.error || null,
                    q.timestamp || q.created_at || new Date().toISOString(),
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

    async getSlowQueries(customerId, limit = 20) {
        const { rows } = await this.pool.query(
            `
            SELECT sql_text, COUNT(*) AS run_count, AVG(duration_ms) AS avg_duration_ms,
                    MAX(duration_ms) AS max_duration_ms, MAX(created_at) AS last_seen
            FROM queries
            WHERE customer_id = $1
            GROUP BY sql_text
            ORDER BY avg_duration_ms DESC
            LIMIT $2
            `,
            [customerId, limit]
        );
        return rows.map((row) => new QueryLog(row));
    }

    async getStats(customerId) {
        const { rows } = await this.pool.query(
            `
            SELECT COUNT(*) AS total_queries, AVG(duration_ms) AS avg_duration_ms,
                    SUM(CASE WHEN duration_ms > 100 THEN 1 ELSE 0 END) AS slow_query_count,
                    SUM(CASE WHEN error IS NOT NULL THEN 1 ELSE 0 END) AS error_count
            FROM queries
            WHERE customer_id = $1
            `,
            [customerId]
        );
        return new QueryLog(rows[0]);
    }

    async getTimeline(customerId) {
        const { rows } = await this.pool.query(
            `
            SELECT date_trunc('minute', created_at) AS minute,
                    AVG(duration_ms) AS avg_duration_ms, COUNT(*) AS count
            FROM queries
            WHERE customer_id = $1
            GROUP BY minute
            ORDER BY minute ASC
            `,
            [customerId]
        );
        return rows;
    }


  
}

export default QueryRepository;