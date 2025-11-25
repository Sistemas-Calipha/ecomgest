import supabase from "../config/supabase.js";

/**
 * LISTAR ROLES
 */
export async function listRoles(req) {
  try {
    const { data, error } = await supabase
      .from("roles")
      .select("id, nombre, descripcion, activo")
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Error obteniendo roles:", error);
      return { status: 500, error: "Error obteniendo roles." };
    }

    return { status: 200, data: { roles: data } };

  } catch (err) {
    console.error("❌ Error interno listRoles:", err);
    return { status: 500, error: "Error interno del servidor." };
  }
}

/**
 * CREAR ROL
 */
export async function createRole(req) {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return { status: 400, error: "El nombre del rol es obligatorio." };
  }

  const cleanName = nombre.toLowerCase();

  try {
    // Verificar si existe
    const { data: existing } = await supabase
      .from("roles")
      .select("id")
      .eq("nombre", cleanName)
      .limit(1);

    if (existing && existing.length > 0) {
      return { status: 409, error: "Ya existe un rol con ese nombre." };
    }

    // Insertar
    const { data, error } = await supabase
      .from("roles")
      .insert([{ nombre: cleanName, descripcion }])
      .select()
      .single();

    if (error) {
      console.error("❌ Error al crear rol:", error);
      return { status: 500, error: "Error al crear el rol." };
    }

    return {
      status: 201,
      data: {
        message: "Rol creado correctamente.",
        role: data
      }
    };

  } catch (err) {
    console.error("❌ Error interno createRole:", err);
    return { status: 500, error: "Error interno del servidor." };
  }
}

/**
 * ACTUALIZAR ROL
 */
export async function updateRole(req) {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  const updates = {};
  if (nombre !== undefined) updates.nombre = nombre.toLowerCase();
  if (descripcion !== undefined) updates.descripcion = descripcion;

  if (Object.keys(updates).length === 0) {
    return { status: 400, error: "No hay cambios por actualizar." };
  }

  try {
    const { data, error } = await supabase
      .from("roles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Error al actualizar rol:", error);
      return { status: 500, error: "No se pudo actualizar el rol." };
    }

    return {
      status: 200,
      data: {
        message: "Rol actualizado correctamente.",
        role: data
      }
    };

  } catch (err) {
    console.error("❌ Error interno updateRole:", err);
    return { status: 500, error: "Error interno del servidor." };
  }
}

/**
 * CAMBIAR ESTADO DEL ROL
 */
export async function updateRoleState(req) {
  const { id } = req.params;
  const { activo } = req.body;

  if (activo === undefined) {
    return { status: 400, error: "Debe indicar el valor de 'activo'." };
  }

  try {
    // Si se desactiva, verificar que no tenga usuarios
    if (!activo) {
      const { data: assigned } = await supabase
        .from("usuarios")
        .select("id")
        .eq("rol_id", id);

      if (assigned && assigned.length > 0) {
        return {
          status: 409,
          error: "No se puede desactivar: hay usuarios asignados a este rol."
        };
      }
    }

    // Actualizar
    const { data, error } = await supabase
      .from("roles")
      .update({ activo })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Error en updateRoleState:", error);
      return { status: 500, error: "Error cambiando el estado del rol." };
    }

    return {
      status: 200,
      data: {
        message: activo ? "Rol activado." : "Rol desactivado.",
        role: data
      }
    };

  } catch (err) {
    console.error("❌ Error interno updateRoleState:", err);
    return { status: 500, error: "Error interno del servidor." };
  }
}
