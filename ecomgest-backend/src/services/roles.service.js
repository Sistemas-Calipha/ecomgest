export async function listRoles(req) {
  try {
    const { data, error } = await supabase
      .from("roles")
      .select("id, nombre, descripcion, activo")
      .order("id", { ascending: true });

    if (error) {
      return { status: 500, error: "Error obteniendo roles." };
    }

    return { status: 200, data: { roles: data } };
    
  } catch (err) {
    return { status: 500, error: "Error interno del servidor." };
  }
}
