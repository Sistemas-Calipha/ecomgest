// ======================================================================
//  src/services/companies.service.js
//  Servicios para la gestión de Empresas
// ======================================================================

import supabase from "../config/supabase.js";

// ----------------------------------------------------------------------
//  Obtener todas las empresas (para panel central)
// ----------------------------------------------------------------------
export async function getCompaniesService() {
  const { data, error } = await supabase
    .from("empresas")
    .select("id, nombre, cuit, plan, estado, created_at")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("❌ getCompaniesService error:", error.message);
    throw error;
  }

  return data || [];
}

// ----------------------------------------------------------------------
//  Crear una empresa
// ----------------------------------------------------------------------
export async function createCompanyService({ nombre, cuit, plan, estado }) {
  const payload = {
    nombre,
    cuit: cuit || null,
    plan: plan || null,
    estado: estado || "activa",
  };

  const { data, error } = await supabase
    .from("empresas")
    .insert([payload])
    .select("id, nombre, cuit, plan, estado, created_at")
    .single();

  if (error) {
    console.error("❌ createCompanyService error:", error.message);
    throw error;
  }

  return data;
}

// ----------------------------------------------------------------------
//  Actualizar empresa
// ----------------------------------------------------------------------
export async function updateCompanyService(id, { nombre, cuit, plan, estado }) {
  const payload = {
    ...(nombre !== undefined && { nombre }),
    ...(cuit !== undefined && { cuit }),
    ...(plan !== undefined && { plan }),
    ...(estado !== undefined && { estado }),
  };

  const { data, error } = await supabase
    .from("empresas")
    .update(payload)
    .eq("id", id)
    .select("id, nombre, cuit, plan, estado, created_at")
    .single();

  if (error) {
    console.error("❌ updateCompanyService error:", error.message);
    throw error;
  }

  return data;
}

// ----------------------------------------------------------------------
//  Eliminar empresa
// ----------------------------------------------------------------------
export async function deleteCompanyService(id) {
  const { error } = await supabase.from("empresas").delete().eq("id", id);

  if (error) {
    console.error("❌ deleteCompanyService error:", error.message);
    throw error;
  }

  return true;
}
