// src/routes/dashboard.routes.js
import { Router } from "express";
import { getMyDashboardConfig, saveDashboardConfig } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my", authMiddleware, getMyDashboardConfig);
router.post("/save", authMiddleware, saveDashboardConfig);

export default router;
