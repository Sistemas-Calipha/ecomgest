// src/services/companies.service.js
import supabase from "../config/supabase.js";

// ===========================================
// BASE SERVICES (nombres simples)
// ===========================================
export const getCompanies = async () => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("creado_en", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const getCompanyById = async (id) => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const createCompany = async ({ nombre, cuit, plan, estado }) => {
  const { data, error } = await supabase
    .from("empresas")
    .insert([
      {
        nombre,
        cuit, // 👈 YA SE ENVÍA EL CUIT
        plan,
        estado,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateCompany = async (id, { nombre, cuit, plan, estado }) => {
  const { data, error } = await supabase
    .from("empresas")
    .update({
      nombre,
      cuit, // 👈 YA SE ACTUALIZA EL CUIT
      plan,
      estado,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteCompany = async (id) => {
  const { error } = await supabase
    .from("empresas")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

// ===========================================
// ALIASES COMPATIBLES CON EL CONTROLLER
// (para que companies.controller.js no reviente)
// ===========================================
export const getCompaniesService = getCompanies;
export const getCompanyByIdService = getCompanyById;
export const createCompanyService = createCompany;
export const updateCompanyService = updateCompany;
export const deleteCompanyService = deleteCompany;
