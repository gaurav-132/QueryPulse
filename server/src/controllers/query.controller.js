import QueryService from "../services/query.service.js";
import QueryRepository from "../repositories/query.repository.js";
import { pool } from "../db/connection.js";

class QueryController {
    constructor(queryService) {
        this.queryService = queryService;
    }

    ingest = async (req, res) => {
        const { queries } = req.body;
        if (!Array.isArray(queries)) {
            return res.status(400).json({ error: "Expected { queries: [...] }" });
        }
        try {
            const timingEntries = queries.filter((q) => q.type !== "plan_signal");
            const planEntries = queries.filter((q) => q.type === "plan_signal");

            const count = await this.queryService.recordBatch(req.customerId, timingEntries);
            await this.queryService.recordPlanSignals(req.customerId, planEntries);

            res.json({ received: count, plansReceived: planEntries.length });
        } catch (err) {
            console.error("[ingest error]", err);
            res.status(400).json({ error: err.message });
        }
    };

    getSlowQueries = async (req, res) => {
        const data = await this.queryService.getSlowQueriesWithSuggestions(
            req.customerId
        );
        res.json(data);
    };

    getStats = async (req, res) => {
        const data = await this.queryService.getStats(req.customerId);
        res.json(data);
    };

    getTimeline = async (req, res) => {
        const data = await this.queryService.getTimeline(req.customerId);
        res.json(data);
    };
}

const queryRepository = new QueryRepository(pool);
const queryService = new QueryService(queryRepository);

export default new QueryController(queryService);