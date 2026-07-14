import QueryService from "../services/QueryService.js";
import QueryRepository from "../repositories/query.repository.js";
import { pool } from "../db/connection.js";

class QueryController {
    constructor(queryService) {
        this.queryService = queryService;
    }

    ingest = async (req, res) => {
        const { queries } = req.body;

        if (!Array.isArray(queries)) {
            return res.status(400).json({
                error: "Expected { queries: [...] }",
            });
        }

        try {
            const count = await this.queryService.recordBatch(
                req.customerId,
                queries
            );

            res.json({ received: count });
        } catch (err) {
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