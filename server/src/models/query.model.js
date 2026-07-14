/**
 * QueryLog Model
 * ----------------
 * Binds to the `queries` table. Defines the row shape and converts
 * Postgres aggregate strings (COUNT, AVG, SUM) into real numbers.
 * Contains NO SQL — that belongs to QueryRepository.
 */
class QueryLog {
    static tableName = "queries";

    constructor(row = {}) {
        this.sqlText = row.sql_text;
        this.runCount = row.run_count !== undefined ? Number(row.run_count) : undefined;
        this.avgDurationMs = row.avg_duration_ms !== undefined ? Number(row.avg_duration_ms) : undefined;
        this.maxDurationMs = row.max_duration_ms !== undefined ? Number(row.max_duration_ms) : undefined;
        this.lastSeen = row.last_seen;
        this.totalQueries = row.total_queries !== undefined ? Number(row.total_queries) : undefined;
        this.errorCount = row.error_count !== undefined ? Number(row.error_count) : undefined;
        this.slowQueryCount = row.slow_query_count !== undefined ? Number(row.slow_query_count) : undefined;
    }

    isSlow(thresholdMs) {
        return this.avgDurationMs > thresholdMs;
    }

    runsOftenEnough(minRunCount) {
        return this.runCount > minRunCount;
    }
}

export default QueryLog;