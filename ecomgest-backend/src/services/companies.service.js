// src/services/companies.service.js
import supabase from "../config/supabase.js";

// ======================================================
// GET: listar todas las companies
// ======================================================
export const getCompanies = async () => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

// ======================================================
// GET: una company por ID
// ======================================================
export const getCompanyById = async (id) => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ======================================================
// POST: crear company
// ======================================================
export const createCompany = async ({ nombre, plan, estado }) => {
  const payload = {
    nombre,
    plan,
    estado: estado || "activa",
  };

  const { data, error } = await supabase
    .from("empresas")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ======================================================
// PUT: actualizar company
// ======================================================
export const updateCompany = async (id, { nombre, plan, estado }) => {
  const payload = {
    nombre,
    plan,
    estado,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("empresas")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ======================================================
// DELETE: eliminar company
// ======================================================
export const deleteCompany = async (id) => {
  const { error } = await supabase
    .from("empresas")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};
