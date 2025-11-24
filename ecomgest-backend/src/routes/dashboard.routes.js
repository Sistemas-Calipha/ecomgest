// src/routes/dashboard.routes.js
import { Router } from "express";
import { getMyDashboardConfig, saveDashboardConfig } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my", verifyToken, getMyDashboardConfig);
router.post("/save", verifyToken, saveDashboardConfig);

// ---------------------------------------------------------
// ENDPOINT TEMPORAL PARA DEBUG
// ---------------------------------------------------------
router.get("/debug", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const empresaId = req.user.empresa_id;

    console.log("🟦 DEBUG /dashboard/debug");
    console.log("🟦 userId:", userId);
    console.log("🟦 empresaId:", empresaId);

    return res.json({
      ok: true,
      userId,
      empresaId,
      mensaje: "El backend recibió el token correctamente"
    });

  } catch (err) {
    console.error("❌ ERROR EN /dashboard/debug:", err);
    return res.status(500).json({ error: "Error en debug" });
  }
});


export default router;
