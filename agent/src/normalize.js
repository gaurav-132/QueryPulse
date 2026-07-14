/**
 * normalize.js
 * -------------
 * Strips literal values out of SQL so no customer PII (emails, names,
 * IDs, etc.) is ever sent off the customer's own infrastructure.
 * Only the SHAPE of the query travels to our backend, never real data.
 */

/**
 * "SELECT * FROM users WHERE email = 'a@b.com' AND age > 25"
 *   -> "SELECT * FROM users WHERE email = ? AND age > ?"
 */
export function normalizeQuery(sql) {
    return sql
        .replace(/'[^']*'/g, "?") // single-quoted string literals
        .replace(/"[^"]*"/g, "?") // double-quoted string literals (some dialects)
        .replace(/\b\d+(\.\d+)?\b/g, "?") // numeric literals
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Fast, non-cryptographic hash for grouping identical query shapes.
 * Not for security — purely for cheap equality/grouping in SQL.
 */
export function fingerprintQuery(normalizedSql) {
    let hash = 0;
    for (let i = 0; i < normalizedSql.length; i++) {
        hash = (hash << 5) - hash + normalizedSql.charCodeAt(i);
        hash |= 0;
    }
    // Convert to unsigned, base36 for a short, readable string
    return (hash >>> 0).toString(36);
}