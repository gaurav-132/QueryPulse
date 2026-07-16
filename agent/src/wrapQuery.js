/**
 * wrapQuery.js
 * --------------
 * Database-agnostic. Delegates the parts that genuinely differ
 * per database (wrapping the query function, running EXPLAIN) to
 * whichever adapter was configured. Everything here — normalize,
 * fingerprint, throttle, buffer — is the same no matter which
 * database the customer uses.
 */
import config from "./config.js";
import { normalizeQuery, fingerprintQuery } from "./normalize.js";
import { recordEntry } from "./buffer.js";
import { shouldCapturePlan } from "./planThrottle.js";

export function wrapPool(pool, adapter) {
  return adapter.wrap(pool, (queryInfo) => handleCompletedQuery(queryInfo, adapter));
}


function handleCompletedQuery({ sql, params, durationMs, rowCount, error, rawClient }, adapter) {
    if (typeof sql !== "string") return;
    if (/^\s*EXPLAIN\b/i.test(sql)) return; // never log our own diagnostic calls

    const normalizedSql = normalizeQuery(sql);
    const fingerprint = fingerprintQuery(normalizedSql);

    recordEntry({
        fingerprint,
        sql: normalizedSql,
        durationMs,
        rowCount,
        error,
        timestamp: new Date().toISOString(),
    });

    const isSlow = durationMs > config.slowQueryThresholdMs;
    
    if (isSlow && !error && shouldCapturePlan(fingerprint, config.planCaptureCooldownMs)) {
    
        adapter.explainQuery(rawClient, sql, params).then((signals) => {
        // TEMPORARY: backend has no query_plans table/endpoint yet,
        // so don't send this into the same buffer as timing entries.
            console.log("[querypulse] plan signal captured (not yet sent to backend):", { fingerprint, ...signals });
        })
        .catch((err) => {
            console.error("[querypulse] plan capture failed silently:", err.message);
        });
    }
}