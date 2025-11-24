// src/routes/companies.routes.js
import express from "express";

// CONTROLADORES NUEVOS
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companies.controller.js";

// SERVICIOS EXISTENTES (para asignación de usuarios y roles)
import {
  assignUserToCompany,
  getUsersByCompany,
} from "../services/companyUsers.service.js";

import { assignRoleToUser } from "../services/companyRoles.service.js";

const router = express.Router();

// =======================================================
// GET /companies  → list all companies
// =======================================================
router.get("/", getCompanies);

// =======================================================
// POST /companies  → create company
// =======================================================
router.post("/", createCompany);

// =======================================================
// PUT /companies/:id  → update company
// =======================================================
router.put("/:id", updateCompany);

// =======================================================
// DELETE /companies/:id  → delete company
// =======================================================
router.delete("/:id", deleteCompany);

// =======================================================
// PUT /companies/assign-user  → assign user to company
// =======================================================
router.put("/assign-user", async (req, res) => {
  try {
    const { userId, companyId } = req.body;

    if (!userId || !companyId) {
      return res.status(400).json({
        message: "userId and companyId are required",
      });
    }

    const updatedUser = await assignUserToCompany(userId, companyId);

    return res.json({
      message: "User assigned to company successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error assigning user:", err.message);
    return res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// =======================================================
// GET /companies/:id/users  → list users in company
// =======================================================
router.get("/:id/users", async (req, res) => {
  try {
    const companyId = req.params.id;

    const users = await getUsersByCompany(companyId);

    return res.json({
      companyId,
      total: users.length,
      users,
    });
  } catch (err) {
    console.error("❌ Error getting company users:", err.message);
    return res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// =======================================================
// POST /companies/assign-role  → assign role to user in company
// =======================================================
router.post("/assign-role", async (req, res) => {
  try {
    const { companyId, userId, roleId } = req.body;

    if (!companyId || !userId || !roleId) {
      return res.status(400).json({
        message: "companyId, userId and roleId are required",
      });
    }

    const result = await assignRoleToUser(companyId, userId, roleId);

    return res.json({
      message: "Role assigned to user in company successfully",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error assigning role:", err.message);
    return res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// =======================================================
// EXPORT ROUTER
// =======================================================
export default router;
