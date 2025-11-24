import supabase from "../config/supabase.js";

// ===========================================
// GET ALL COMPANIES
// ===========================================
export const getCompanies = async () => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("creado_en", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

// ===========================================
// GET SINGLE COMPANY
// ===========================================
export const getCompanyById = async (id) => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ===========================================
// CREATE COMPANY — (CUIT INCLUIDO)
// ===========================================
export const createCompany = async ({ nombre, cuit, plan, estado }) => {
  const { data, error } = await supabase
    .from("empresas")
    .insert([
      {
        nombre,
        cuit,          // <-- AHORA SÍ SE ENVÍA
        plan,
        estado,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ===========================================
// UPDATE COMPANY — (CUIT INCLUIDO)
// ===========================================
export const updateCompany = async (id, { nombre, cuit, plan, estado }) => {
  const { data, error } = await supabase
    .from("empresas")
    .update({
      nombre,
      cuit,          // <-- AHORA SÍ SE ENVÍA
      plan,
      estado,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ===========================================
// DELETE COMPANY
// ===========================================
export const deleteCompany = async (id) => {
  const { error } = await supabase
    .from("empresas")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};
