// src/services/companyRoles.service.js
import supabase from "../config/supabase.js";

// ===============================================
// ASIGNAR ROL A UN USUARIO EN UNA EMPRESA
// ===============================================
export async function assignRoleToUser(companyId, userId, roleId) {
  const { data, error } = await supabase
    .from("empresa_usuario_roles")
    .insert([
      {
        empresa_id: companyId,
        usuario_id: userId,
        rol_id: roleId,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data[0];
}
