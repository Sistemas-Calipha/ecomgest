import express from "express";
import { getCompanies } from "../services/companies.service.js";
import { assignUserToCompany, getUsersByCompany } from "../services/companyUsers.service.js";

const router = express.Router();

// =======================================
// GET /companies → lista todAs las empresas
// =======================================
router.get("/", async (req, res) => {
  try {
    const companies = await getCompanies();
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// =======================================
// PUT /companies/assign-user
// =======================================
router.put("/assign-user", async (req, res) => {
  try {
    const { userId, companyId } = req.body;

    if (!userId || !companyId) {
      return res.status(400).json({
        message: "userId and companyId are required",
      });
    }

    const updatedUser = await assignUserToCompany(userId, companyId);

    res.json({
      message: "User assigned to company successfully",
      user: updatedUser,
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal error",
      error: err.message,
    });
  }
});

// =======================================
// GET /companies/:id/users
// =======================================
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
    res.status(500).json({
      message: "Internal error",
      error: err.message,
    });
  }
});

import { assignRoleToUser } from "../services/companyRoles.service.js";

// =======================================
// POST /companies/assign-role
// =======================================
router.post("/assign-role", async (req, res) => {
  try {
    const { companyId, userId, roleId } = req.body;

    if (!companyId || !userId || !roleId) {
      return res.status(400).json({
        message: "companyId, userId y roleId son requeridos",
      });
    }

    const result = await assignRoleToUser(companyId, userId, roleId);

    res.json({
      message: "Role assigned to user in company successfully",
      data: result,
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal error",
      error: err.message,
    });
  }
});


// =======================================
// EXPORTAR EL ROUTER
// =======================================
export default router;
