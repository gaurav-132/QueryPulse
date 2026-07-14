/**
 * buffer.js
 * ----------
 * Holds query timing records in memory and flushes them to the
 * backend on a timer or when the buffer gets large. Keeps HTTP
 * traffic to the backend low regardless of how many queries the
 * customer's app runs per second.
 */
import config from "./config.js";
import { sendBatch } from "./transport.js";

let buffer = [];
let flushTimer = null;

export function startFlushLoop() {
    if (flushTimer) return; // already running
    flushTimer = setInterval(flush, config.flushIntervalMs);
    flushTimer.unref?.(); // don't keep the process alive just for this timer
}

export function recordEntry(entry) {
    buffer.push(entry);
    if (buffer.length >= config.maxBufferSize) {
        flush();
    }
}

export async function flush() {
    if (buffer.length === 0) return;
    const batch = buffer;
    buffer = [];

    try {
        await sendBatch(batch);
    } catch (err) {
        console.error("[querypulse] failed to send batch, re-queueing:", err.message);
        buffer = batch.concat(buffer);
    }
}