// src/services/companyUsers.service.js
import supabase from "../config/supabase.js";

export async function assignUserToCompany(userId, companyId) {

  // 1. Primero actualizamos
  const { error: updateError } = await supabase
    .from("usuarios")
    .update({ empresa_id: companyId })
    .eq("id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // 2. Luego consultamos el usuario actualizado
  const { data: user, error: selectError } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", userId)
    .single();

  if (selectError) {
    throw new Error(selectError.message);
  }

  return user;
}

// OBTENER USUARIOS DE UNA EMPRESA
export async function getUsersByCompany(companyId) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("empresa_id", companyId);

  if (error) {
    throw new Error("Error fetching users by company: " + error.message);
  }

  return data;
}
