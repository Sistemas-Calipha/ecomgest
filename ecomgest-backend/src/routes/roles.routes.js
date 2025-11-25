import Router from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizePermission } from "../middlewares/permissions.middleware.js";

import {
  listRolesController,
  createRoleController,
  updateRoleController,
  updateRoleStateController
} from "../controllers/roles.controller.js";

const router = Router();

router.get("/", verifyToken, authorizePermission("ver_roles"), listRolesController);

router.post("/", verifyToken, authorizePermission("crear_rol"), createRoleController);

router.put("/:id", verifyToken, authorizePermission("editar_rol"), updateRoleController);

router.patch("/:id/state", verifyToken, authorizePermission("activar_rol"), updateRoleStateController);

export default router;
