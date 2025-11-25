// src/services/roles.service.js
import supabase from "../config/supabase.js";
import { registerAudit } from "./audit.service.js";
import { getRequestMeta } from "../middlewares/audit.middleware.js";

/**
 * LISTAR ROLES
 */
export async function listRoles(req) {
  const { ip, userAgent } = getRequestMeta(req);

  try {
    const { data, error } = await supabase
      .from("roles")
      .select("id, nombre, descripcion, activo")
      .order("id", { ascending: true });

    if (error) {
      await registerAudit({
        userId: req.user.id,
        action: "ROLES_LIST_ERROR",
        details: { error: error.message },
        ip, userAgent
      });
      return { status: 500, error: "Error obteniendo roles." };
    }

    await registerAudit({
      userId: req.user.id,
      action: "ROLES_LIST_OK",
      details: { count: data.length },
      ip, userAgent
    });

    return { status: 200, data: { roles: data } };

  } catch (err) {
    return { status: 500, error: "Error interno del servidor." };
  }
}

/**
 * CREAR ROL
 */
export async function createRole(req) {
  const { nombre, descripcion } = req.body;
  const { ip, userAgent } = getRequestMeta(req);

  if (!nombre) {
    return { status: 400, error: "El nombre del rol es obligatorio." };
  }

  try {
    const lower = nombre.toLowerCase();

    // evitar duplicados
    const { data: exists } = await supabase
      .from("roles")
      .select("id")
      .eq("nombre", lower)
      .limit(1);

    if (exists?.length > 0) {
      return { status: 409, error: "Ya existe un rol con ese nombre." };
    }

    const { data, error } = await supabase
      .from("roles")
      .insert([{ nombre: lower, descripcion, activo: true }])
      .select();

    if (error) return { status: 500, error: "Error interno del servidor." };

    await registerAudit({
      userId: req.user.id,
      action: "ROLE_CREATED",
      details: { role_id: data[0].id, nombre: data[0].nombre },
      ip, userAgent
    });

    return {
      status: 201,
      data: {
        message: "Rol creado correctamente.",
        role: data[0],
      },
    };

  } catch (err) {
    return { status: 500, error: "Error interno del servidor." };
  }
}

/**
 * ACTUALIZAR ROL
 */
export async function updateRole(req) {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const { ip, userAgent } = getRequestMeta(req);

  const updates = {};
  if (nombre !== undefined) updates.nombre = nombre.toLowerCase();
  if (descripcion !== undefined) updates.descripcion = descripcion;

  if (Object.keys(updates).length === 0) {
    return { status: 400, error: "No hay cambios para actualizar." };
  }

  try {
    const { data, error } = await supabase
      .from("roles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return { status: 500, error: "Error interno del servidor." };

    await registerAudit({
      userId: req.user.id,
      action: "ROLE_UPDATED",
      details: { id, updates },
      ip, userAgent
    });

    return {
      status: 200,
      data: {
        message: "Rol actualizado correctamente.",
        role: data,
      },
    };

  } catch (err) {
    return { status: 500, error: "Error interno del servidor." };
  }
}

/**
 * ACTIVAR / DESACTIVAR ROL
 */
export async function updateRoleState(req) {
  const { id } = req.params;
  const { activo } = req.body;
  const { ip, userAgent } = getRequestMeta(req);

  if (activo === undefined) {
    return { status: 400, error: "Debe indicar el valor de 'activo'." };
  }

  try {
    // Evitar desactivar roles con usuarios asignados
    if (!activo) {
      const { data: assigned } = await supabase
        .from("usuarios")
        .select("id")
        .eq("rol_id", id);

      if (assigned && assigned.length > 0) {
        return {
          status: 409,
          error: "No se puede desactivar este rol porque tiene usuarios asignados.",
        };
      }
    }

    const { data, error } = await supabase
      .from("roles")
      .update({ activo })
      .eq("id", id)
      .select()
      .single();

    if (error) return { status: 500, error: "Error interno del servidor." };

    await registerAudit({
      userId: req.user.id,
      action: "ROLE_STATE_CHANGED",
      details: { id, activo },
      ip, userAgent
    });

    return {
      status: 200,
      data: {
        message: `Rol ${activo ? "activado" : "desactivado"} correctamente.`,
        role: data,
      },
    };

  } catch (err) {
    return { status: 500, error: "Error interno del servidor." };
  }
}
