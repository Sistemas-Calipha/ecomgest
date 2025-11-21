// src/routes/auth.routes.js
import { Router } from "express";

import {
  loginController,
  registerController,
  demoController,
  generarHashTest,
  testTokenController,
  selectCompanyController
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// ===========================
// AUTH
// ===========================
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/demo", demoController);

// ===========================
// TESTS
// ===========================
router.get("/test-token", verifyToken, testTokenController);
router.get("/test/hash", generarHashTest);

// ===========================
// SELECT COMPANY (USANDO TOKEN)
// ===========================
// Esta es la ÚNICA ruta válida
router.post("/select-company", verifyToken, selectCompanyController);

export default router;
