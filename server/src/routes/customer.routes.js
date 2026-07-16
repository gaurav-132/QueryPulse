import express from "express";
import customerController from "../controllers/customer.controller.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/activate-subscription", jwtAuth, customerController.activateSubscription);
router.get("/me", jwtAuth, customerController.getMyCustomerInfo);

export default router;