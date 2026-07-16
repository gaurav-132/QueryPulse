/**
 * DatabaseAdapter (the contract)
 * ---------------------------------
 * Every supported database (Postgres, MySQL, SQLite...) implements
 * this exact shape. Everything else in the agent — normalize.js,
 * buffer.js, throttle.js, transport.js — never needs to know or
 * care which database is underneath. Only these two methods differ
 * per database; everything else is shared.
 */
export class DatabaseAdapter {
    /**
     * Wraps the given pool/connection so every query is timed.
     * Must call onQueryComplete(...) after each real query finishes.
     */
    wrap(pool, onQueryComplete) {
        throw new Error("Not implemented");
    }

    /**
     * Runs this database's EXPLAIN equivalent and returns a
     * standardized signal shape: { seqScans, indexesUsed, estimatedCost }
     * regardless of how different the underlying EXPLAIN output looks.
     */
    async explainQuery(rawClient, sql, params) {
        throw new Error("Not implemented");
    }
}