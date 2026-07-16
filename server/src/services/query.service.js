import config from "../config/index.js";


class QueryService {
    constructor(queryRepository) {
        this.repo = queryRepository;
    }

    async recordBatch(customerId, rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error("rows must be a non-empty array");
        }
        await this.repo.insertMany(customerId, rows);
        return rows.length;
    }

    async recordPlanSignals(customerId, planEntries) {
        if (!Array.isArray(planEntries) || planEntries.length === 0) return;
        await this.queryPlanRepo.saveMany(customerId, planEntries);
    }

    async getSlowQueriesWithSuggestions(customerId) {
        const queryLogs = await this.repo.getSlowQueries(customerId);
        return queryLogs.map((log) => 
            ({
                sqlText: log.sqlText,
                runCount: log.runCount,
                avgDurationMs: log.avgDurationMs,
                maxDurationMs: log.maxDurationMs,
                lastSeen: log.lastSeen,
                suggestion:
                    log.isSlow(config.slowQueryThresholdMs) && log.runsOftenEnough(config.suggestionMinRunCount)
                    ? "Frequently run and slow — check for a missing index on the WHERE/JOIN columns."
                    : null,
            })
        );
    }

    async getStats(customerId) {
        return this.repo.getStats(customerId);
    }

    async getTimeline(customerId) {
        return this.repo.getTimeline(customerId);
    }
}

export default QueryService;