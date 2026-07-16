// agent/src/transport.js

/**
 * transport.js
 * --------------
 * The only file that actually talks HTTP to your backend.
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
        const body = await res.text();
        throw new Error(`querypulse backend responded ${res.status}: ${body}`);
    }
    return res.json();
}