import { Router } from "express";
import { getKPISummary } from "../controllers/reports.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import companyScope from "../middlewares/companyScope.js";

const router = Router();

router.get("/kpi/summary", verifyToken, companyScope, getKPISummary);

export default router;
