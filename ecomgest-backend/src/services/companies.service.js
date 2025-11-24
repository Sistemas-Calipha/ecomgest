// src/services/companies.service.js
import supabase from "../config/supabase.js";

// =====================================
// GET ALL
// =====================================
export async function getCompaniesService() {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("creado_en", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

// =====================================
// CREATE
// =====================================
export async function createCompanyService({ nombre, plan, estado }) {
  const payload = {
    nombre,
    plan: plan || "",
    estado: estado || "activa",
  };

  const { data, error } = await supabase
    .from("empresas")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// =====================================
// UPDATE
// =====================================
export async function updateCompanyService(id, payload) {
  const { data, error } = await supabase
    .from("empresas")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// =====================================
// DELETE
// =====================================
export async function deleteCompanyService(id) {
  const { error } = await supabase
    .from("empresas")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
