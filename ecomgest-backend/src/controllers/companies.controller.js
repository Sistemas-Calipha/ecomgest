// ======================================================================
//  src/controllers/companies.controller.js
//  Controladores para la gestión de Empresas (multiempresa)
// ======================================================================

import {
  getCompaniesService,
  createCompanyService,
  updateCompanyService,
  deleteCompanyService,
} from "../services/companies.service.js";

// ======================================================================
//  GET /companies
//  Lista TODAS las empresas (solo para administradores globales)
// ======================================================================
export async function getCompanies(req, res) {
  try {
    const empresas = await getCompaniesService(); // Sin empresa_id
    return res.status(200).json({ companies: empresas });

  } catch (err) {
    console.error("❌ Error obteniendo empresas:", err.message);
    return res.status(500).json({
      error: "Error obteniendo empresas"
    });
  }
}

// ======================================================================
//  POST /companies
//  Crear nueva empresa
// ======================================================================
export async function createCompany(req, res) {
  try {
    const { nombre, cuit, plan, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio." });
    }

    const empresaNueva = await createCompanyService({
      nombre,
      cuit,
      plan,
      estado
    });

    return res.status(201).json({
      mensaje: "Empresa creada correctamente.",
      empresa: empresaNueva
    });

  } catch (err) {
    console.error("❌ Error creando empresa:", err.message);
    return res.status(500).json({
      error: "Error creando empresa."
    });
  }
}

// ======================================================================
//  PUT /companies/:id
//  Actualizar datos de empresa
// ======================================================================
export async function updateCompany(req, res) {
  try {
    const { id } = req.params;
    const { nombre, cuit, plan, estado } = req.body;

    const empresaActualizada = await updateCompanyService(id, {
      nombre,
      cuit,
      plan,
      estado
    });

    return res.status(200).json({
      mensaje: "Empresa actualizada correctamente.",
      empresa: empresaActualizada
    });

  } catch (err) {
    console.error("❌ Error actualizando empresa:", err.message);
    return res.status(500).json({
      error: "Error actualizando empresa."
    });
  }
}

// ======================================================================
//  DELETE /companies/:id
//  Eliminar empresa
// ======================================================================
export async function deleteCompany(req, res) {
  try {
    const { id } = req.params;

    await deleteCompanyService(id);

    return res.status(200).json({
      mensaje: "Empresa eliminada correctamente."
    });

  } catch (err) {
    console.error("❌ Error eliminando empresa:", err.message);
    return res.status(500).json({
      error: "Error eliminando empresa."
    });
  }
}
