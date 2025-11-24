import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/debug", verifyToken, (req, res) => {
  return res.json({
    mensaje: "OK — Ruta de debug funcionando",
    user: req.user
  });
});

export default router;
