/**
 * transport.js
 * --------------
 * The only file that actually talks HTTP to your backend. Kept
 * separate so it's trivial to swap (e.g. for testing, or to add
 * retries/compression later) without touching buffering logic.
 */
import config from "./config.js";

export async function sendBatch(entries) {
    const res = await fetch(`${config.endpoint}/api/v1/queries/ingest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": config.apiKey,
        },
        body: JSON.stringify({ queries: entries }),
    });

    if (!res.ok) {
        throw new Error(`querypulse backend responded ${res.status}`);
    }
    return res.json();
}