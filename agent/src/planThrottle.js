/**
 * planThrottle.js
 * -----------------
 * Prevents EXPLAIN from being run on every occurrence of a slow query.
 * Once we've captured a plan for a given fingerprint, we wait out a
 * cooldown before capturing it again — plans rarely change minute to
 * minute, and re-running EXPLAIN constantly would add real load to
 * the customer's database, defeating the point of a lightweight tool.
 */
const lastCapturedAt = new Map(); // fingerprint -> timestamp (ms)

export function shouldCapturePlan(fingerprint, cooldownMs) {
    const last = lastCapturedAt.get(fingerprint);
    const now = Date.now();

    if (!last || now - last > cooldownMs) {
        lastCapturedAt.set(fingerprint, now);
        return true;
    }
    return false;
}

// Exposed for tests / manual resets, not used in normal operation.
export function _resetThrottleState() {
    lastCapturedAt.clear();
}