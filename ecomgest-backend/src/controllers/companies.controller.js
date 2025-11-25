// src/controllers/companies.controller.js

import {
  getCompaniesService,
  createCompanyService,
  updateCompanyService,
  deleteCompanyService,
} from "../services/companies.service.js";

// =====================================
// GET /companies  (solo empresas del usuario actual)
// =====================================
export async function getCompanies(req, res) {
  try {
    const empresa_id = req.user.empresa_id; // viene del JWT

    const empresas = await getCompaniesService(empresa_id);

    return res.json({ companies: empresas });
  } catch (err) {
    console.error("❌ Error obteniendo empresas:", err.message);
    return res.status(500).json({ error: "Error obteniendo empresas" });
  }
}

// =====================================
// POST /companies
// =====================================
export async function createCompany(req, res) {
  try {
    const { nombre, cuit, plan, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const nueva = await createCompanyService({
      nombre,
      cuit,
      plan,
      estado,
    });

    return res.json({
      mensaje: "Empresa creada",
      empresa: nueva,
    });
  } catch (err) {
    console.error("❌ Error creando empresa:", err.message);
    return res.status(500).json({ error: "Error creando empresa" });
  }
}

// =====================================
// PUT /companies/:id
// =====================================
export async function updateCompany(req, res) {
  try {
    const { id } = req.params;
    const { nombre, cuit, plan, estado } = req.body;

    const actualizada = await updateCompanyService(id, {
      nombre,
      cuit,
      plan,
      estado,
    });

    return res.json({
      mensaje: "Empresa actualizada",
      empresa: actualizada,
    });
  } catch (err) {
    console.error("❌ Error actualizando empresa:", err.message);
    return res.status(500).json({ error: "Error actualizando empresa" });
  }
}

// =====================================
// DELETE /companies/:id
// =====================================
export async function deleteCompany(req, res) {
  try {
    const { id } = req.params;

    await deleteCompanyService(id);

    return res.json({ mensaje: "Empresa eliminada" });
  } catch (err) {
    console.error("❌ Error eliminando empresa:", err.message);
    return res.status(500).json({ error: "Error eliminando empresa" });
  }
}
