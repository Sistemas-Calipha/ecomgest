// src/routes/companies.routes.js
import express from "express";

import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/companies.service.js";

import {
  assignUserToCompany,
  getUsersByCompany,
} from "../services/companyUsers.service.js";

import { assignRoleToUser } from "../services/companyRoles.service.js";

const router = express.Router();

// =======================================================
// GET /companies  → list all companies
// =======================================================
router.get("/", async (req, res) => {
  try {
    const companies = await getCompanies();
    return res.json({ companies });
  } catch (err) {
    console.error("❌ Error getting companies:", err.message);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
  }
});

// =======================================================
// GET /companies/:id  → get single company
// =======================================================
router.get("/:id", async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await getCompanyById(companyId);

    return res.json({ company });
  } catch (err) {
    console.error("❌ Error getting company:", err.message);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
  }
});

// =======================================================
// POST /companies  → create company
// =======================================================
router.post("/", async (req, res) => {
  try {
    const { nombre, cuit, estado } = req.body;

    if (!nombre || !cuit) {
      return res.status(400).json({
        message: "nombre and cuit are required",
      });
    }

    const company = await createCompany({ nombre, cuit, estado });

    return res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (err) {
    console.error("❌ Error creating company:", err.message);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
  }
});

// =======================================================
// PUT /companies/:id  → update company
// =======================================================
router.put("/:id", async (req, res) => {
  try {
    const companyId = req.params.id;
    const { nombre, cuit, estado } = req.body;

    if (!nombre || !cuit) {
      return res.status(400).json({
        message: "nombre and cuit are required",
      });
    }

    const company = await updateCompany(companyId, { nombre, cuit, estado });

    return res.json({
      message: "Company updated successfully",
      company,
    });
  } catch (err) {
    console.error("❌ Error updating company:", err.message);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
  }
});

// =======================================================
// DELETE /companies/:id  → delete company
// =======================================================
router.delete("/:id", async (req, res) => {
  try {
    const companyId = req.params.id;

    await deleteCompany(companyId);

    return res.json({
      message: "Company deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting company:", err.message);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
  }
});

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
    console.error("❌ Error assigning user to company:", err.message);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
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
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
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
    console.error("❌ Error assigning role in company:", err.message);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
  }
});

// =======================================================
// EXPORT ROUTER
// =======================================================
export default router;
