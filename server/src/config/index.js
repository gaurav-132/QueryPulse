export default {
  port: process.env.PORT || 3000,
  dbPath: process.env.DB_PATH || new URL("../../monitor.db", import.meta.url).pathname,
  slowQueryThresholdMs: 100,
  suggestionMinRunCount: 10,
};