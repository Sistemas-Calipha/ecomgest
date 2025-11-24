// src/routes/dashboard.routes.js
import { Router } from "express";
import { getMyDashboardConfig, saveDashboardConfig } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my", verifyToken, getMyDashboardConfig);
router.post("/save", verifyToken, saveDashboardConfig);

export default router;
