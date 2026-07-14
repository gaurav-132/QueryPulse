import express from "express";
import { authMiddleware } from "./middlewares/auth.js";

import queryRoutes from "./routes/query.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import userRoutes from "./routes/user.routes.js";

// import { authMiddleware } from './middlewares/auth.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes declaration
app.use("/api/v1/queries", authMiddleware, queryRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/users", userRoutes);

export default app;