// src/routes/roles.routes.js
import Router from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

import {
  listRolesController,
  createRoleController,
  updateRoleController,
  updateRoleStateController
} from "../controllers/roles.controller.js";

const router = Router();

router.get("/", verifyToken, listRolesController);
router.post("/", verifyToken, createRoleController);
router.put("/:id", verifyToken, updateRoleController);
router.patch("/:id/state", verifyToken, updateRoleStateController);

export default router;
