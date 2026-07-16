import { DatabaseAdapter } from "./DatabaseAdapter.js";

export class PostgresAdapter extends DatabaseAdapter {
    wrap(pool, onQueryComplete) {
        const originalQuery = pool.query.bind(pool);

        pool.query = async function (sql, params, ...rest) {
            const start = process.hrtime.bigint();
            let result;
            let error = null;

            try {
                result = await originalQuery(sql, params, ...rest);
                return result;
            } catch (err) {
                error = err.message;
                throw err;
            } finally {
                const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
                const rowCount = result?.rowCount ?? result?.rows?.length ?? 0;
                onQueryComplete({
                    sql,
                    params,
                    durationMs,
                    rowCount,
                    error,
                    rawClient: { query: originalQuery }, // for EXPLAIN, avoids self-recursion
                });
            }
        };

        return pool;
    }

    async explainQuery(rawClient, sql, params = []) {
        const { rows } = await rawClient.query(`EXPLAIN (FORMAT JSON) ${sql}`, params);
        const rootPlan = rows[0]["QUERY PLAN"][0].Plan;
        return this._extractSignals(rootPlan);
    }

    _extractSignals(planNode, signals = { seqScans: [], indexesUsed: [], estimatedCost: 0 }) {
        if (planNode["Node Type"] === "Seq Scan") {
            signals.seqScans.push({
                table: planNode["Relation Name"],
                filterColumns: this._extractColumnNames(planNode["Filter"]),
            });
        }
        if (planNode["Node Type"]?.includes("Index") && planNode["Index Name"]) {
            signals.indexesUsed.push(planNode["Index Name"]);
        }
        if (typeof planNode["Total Cost"] === "number") {
            signals.estimatedCost = Math.max(signals.estimatedCost, planNode["Total Cost"]);
        }
        for (const child of planNode.Plans || []) {
            this._extractSignals(child, signals);
        }
        return signals;
    }

    _extractColumnNames(filterText = "") {
        const match = filterText.match(/\(?([a-zA-Z_][a-zA-Z0-9_]*)\s*(=|>|<|>=|<=|LIKE)/i);
        return match ? [match[1]] : [];
    }
}