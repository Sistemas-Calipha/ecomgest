// src/services/companies.service.js
import supabase from "../config/supabase.js";

// ======================================================
// GET ALL COMPANIES
// ======================================================
export const getCompaniesService = async () => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("creado_en", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

// ======================================================
// GET COMPANY BY ID
// ======================================================
export const getCompanyByIdService = async (id) => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ======================================================
// CREATE COMPANY
// ======================================================
export const createCompanyService = async ({ nombre, cuit, plan, estado }) => {
  const { data, error } = await supabase
    .from("empresas")
    .insert([
      {
        nombre,
        cuit,
        plan,
        estado,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ======================================================
// UPDATE COMPANY
// ======================================================
export const updateCompanyService = async (
  id,
  { nombre, cuit, plan, estado }
) => {
  const { data, error } = await supabase
    .from("empresas")
    .update({
      nombre,
      cuit,
      plan,
      estado,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ======================================================
// DELETE COMPANY
// ======================================================
export const deleteCompanyService = async (id) => {
  const { error } = await supabase.from("empresas").delete().eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};
