/**
 * Central, mutable config for the agent. Set once via init(), read
 * everywhere else. Kept deliberately simple (no class) since there's
 * only ever one instance of this per customer app process.
 */
const config = {
    apiKey: null,
    endpoint: null,
    flushIntervalMs: 10000,
    slowQueryThresholdMs: 100,
    planCaptureCooldownMs: 10 * 60 * 1000, // 10 minutes per fingerprint
    maxBufferSize: 500,
};

export function configure(userConfig = {}) {
    if (!userConfig.apiKey || !userConfig.endpoint) {
        throw new Error("querypulse: apiKey and endpoint are required in init()");
    }
    Object.assign(config, userConfig);
    return config;
}

export default config;