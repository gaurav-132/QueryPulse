import { DatabaseAdapter } from "./DatabaseAdapter.js";

/**
 * MySqlAdapter
 * --------------
 * Built for the `mysql2/promise` API shape, where pool.query()
 * returns [rows, fields] (an array), NOT {rows} like pg does.
 * This is exactly the kind of per-database difference the adapter
 * pattern exists to isolate — normalize.js/buffer.js/etc. never
 * need to know about this shape difference.
 */
export class MySqlAdapter extends DatabaseAdapter {
    wrap(pool, onQueryComplete) {
        const originalQuery = pool.query.bind(pool);

        pool.query = async function (sql, params, ...rest) {
        const start = process.hrtime.bigint();
        let rows;
        let error = null;

        try {
            [rows] = await originalQuery(sql, params, ...rest); // mysql2 returns [rows, fields]
            return rows;
        } catch (err) {
            error = err.message;
            throw err;
        } finally {
            const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
            const rowCount = Array.isArray(rows) ? rows.length : 0;
            onQueryComplete({
                sql,
                params,
                durationMs,
                rowCount,
                error,
                rawClient: { query: originalQuery },
            });
        }
        };

        return pool;
    }

    async explainQuery(rawClient, sql, params = []) {
        const [rows] = await rawClient.query(`EXPLAIN FORMAT=JSON ${sql}`, params);
        // mysql2 returns EXPLAIN FORMAT=JSON as a single row with an "EXPLAIN" field containing a JSON string
        const plan = JSON.parse(rows[0].EXPLAIN);
        return this._extractSignals(plan.query_block);
    }

    _extractSignals(queryBlock, signals = { seqScans: [], indexesUsed: [], estimatedCost: 0 }) {
        if (!queryBlock) return signals;

        const table = queryBlock.table;
        if (table) {
        // MySQL's access_type "ALL" means a full table scan — the
        // equivalent of Postgres's "Seq Scan".
        if (table.access_type === "ALL") {
            signals.seqScans.push({
                table: table.table_name,
                filterColumns: this._extractColumnNames(table.attached_condition),
            });
        }
        if (table.key) {
            signals.indexesUsed.push(table.key);
        }
        if (typeof queryBlock.cost_info?.query_cost === "string") {
            signals.estimatedCost = Math.max(signals.estimatedCost, parseFloat(queryBlock.cost_info.query_cost));
        }
        }

        // Recurse into nested query blocks (subqueries, unions, etc.)
        for (const key of Object.keys(queryBlock)) {
            if (typeof queryBlock[key] === "object" && queryBlock[key]?.query_block) {
                this._extractSignals(queryBlock[key].query_block, signals);
            }
        }
        return signals;
    }

    _extractColumnNames(conditionText = "") {
        const match = conditionText?.match(/`?([a-zA-Z_][a-zA-Z0-9_]*)`?\s*(=|>|<|>=|<=|like)/i);
        return match ? [match[1]] : [];
    }
}