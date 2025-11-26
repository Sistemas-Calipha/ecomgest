// src/routes/users.routes.js
import Router from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

import {
  listUsersController,
  createUserController,
  getUserController,
  updateUserController,
  updateUserStateController,
  resetPasswordController,
} from "../controllers/users.controller.js";

const router = Router();

// Lista usuarios
router.get("/", verifyToken, listUsersController);

// Crear usuario
router.post("/", verifyToken, createUserController);

// Obtener usuario por ID
router.get("/:id", verifyToken, getUserController);

// Actualizar usuario
router.put("/:id", verifyToken, updateUserController);

// Cambiar estado
router.patch("/:id/state", verifyToken, updateUserStateController);

// Reset password
router.post("/:id/reset-password", verifyToken, resetPasswordController);

export default router;
