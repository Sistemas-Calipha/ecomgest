// src/routes/permissions.routes.js
import Router from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

import {
  listPermissionsController,
  createPermissionController,
  updatePermissionController,
  updatePermissionStateController
} from "../controllers/permissions.controller.js";

const router = Router();

router.get("/", verifyToken, listPermissionsController);
router.post("/", verifyToken, createPermissionController);
router.put("/:id", verifyToken, updatePermissionController);
router.patch("/:id/state", verifyToken, updatePermissionStateController);

export default router;
