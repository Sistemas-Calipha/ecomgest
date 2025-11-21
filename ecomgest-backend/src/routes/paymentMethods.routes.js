// ======================================================================
//  src/routes/paymentMethods.routes.js
// ======================================================================

import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} from "../controllers/paymentMethods.controller.js";

const router = express.Router();

// GET → Listar métodos de pago (filtrados por empresa)
router.get("/", verifyToken, getPaymentMethods);

// POST → Crear método de pago
router.post("/", verifyToken, createPaymentMethod);

// PUT → Actualizar un método de pago
router.put("/:id", verifyToken, updatePaymentMethod);

// DELETE → Eliminar un método de pago
router.delete("/:id", verifyToken, deletePaymentMethod);

export default router;
