import express from "express";
import queryController from "../controllers/query.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/ingest", authMiddleware, queryController.ingest);
router.get("/slow", authMiddleware, queryController.getSlowQueries);
router.get("/timeline", authMiddleware, queryController.getTimeline);
router.get("/stats", authMiddleware, queryController.getStats); // consider moving this if it's not query-specific later

export default router;