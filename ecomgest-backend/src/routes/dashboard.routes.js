// src/routes/dashboard.routes.js
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// GET /dashboard/my  → devuelve una config de ejemplo
router.get("/my", authMiddleware, (req, res) => {
  // Más adelante lo leeremos desde Supabase
  return res.json({
    widgets: ["kpis", "ventas", "ingresosGastos", "stock", "clientes", "actividad"],
    disabled_widgets: []
  });
});

// POST /dashboard/save  → por ahora solo loguea y responde ok
router.post("/save", authMiddleware, (req, res) => {
  console.log("🟣 [DEMO] Dashboard SAVE recibido:", req.body);
  // Más adelante lo vamos a guardar en la tabla dashboard_config
  return res.json({ ok: true });
});

export default router;
