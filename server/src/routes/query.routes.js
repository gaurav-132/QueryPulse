import express from "express";
import queryController from "../controllers/query.controller.js";
import { apiKeyAuth } from "../middlewares/apiKeyAuth.js";

const router = express.Router();

router.post("/ingest", queryController.ingest);
router.get("/slow", queryController.getSlowQueries);
router.get("/timeline", queryController.getTimeline);
router.get("/stats", queryController.getStats); // consider moving this if it's not query-specific later

export default router;