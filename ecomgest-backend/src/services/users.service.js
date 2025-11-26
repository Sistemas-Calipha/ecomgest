import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import { registerAudit } from "./audit.service.js";
import { getRequestMeta } from "../middlewares/audit.middleware.js";

// ======================================================================
//  LIST USERS (multiempresa)
// ======================================================================
export async function listUsers(req) {
  const { ip, userAgent } = getRequestMeta(req);
  const empresaId = req.user.empresa_id;

  // 1. Obtenemos usuarios vinculados a la empresa
  const { data: rel, error: relError } = await supabase
    .from("empresa_usuario_roles")
    .select(`
      usuario_id,
      rol_id,
      roles ( nombre ),
      usuarios (
        id,
        nombre_completo,
        correo,
        activo,
        created_at
      )
    `)
    .eq("empresa_id", empresaId);

  if (relError) {
    await registerAudit({
      userId: req.user.id,
      action: "USERS_LIST_ERROR",
      details: { error: relError.message },
      ip, userAgent
    });

    return { status: 500, error: "Error al obtener usuarios." };
  }

  // 2. Formateamos
  const users = rel.map((row) => ({
    id: row.usuarios.id,
    nombre_completo: row.usuarios.nombre_completo,
    correo: row.usuarios.correo,
    activo: row.usuarios.activo,
    rol_id: row.rol_id,
    rol_nombre: row.roles?.nombre || null,
    creado_en: row.usuarios.created_at
  }));

  await registerAudit({
    userId: req.user.id,
    action: "USERS_LIST_OK",
    details: { count: users.length },
    ip, userAgent
  });

  return { status: 200, data: { users } };
}

// ======================================================================
//  CREATE USER
// ======================================================================
export async function createUser(req) {
  const empresaId = req.user.empresa_id;
  const { nombre_completo, correo, contrasena, rol_id, activo = true } = req.body;
  const { ip, userAgent } = getRequestMeta(req);

  if (!nombre_completo || !correo || !rol_id) {
    return { status: 400, error: "Nombre, correo y rol son obligatorios." };
  }

  // Duplicado
  const { data: exists } = await supabase
    .from("usuarios")
    .select("id")
    .eq("correo", correo)
    .limit(1);

  if (exists && exists.length > 0) {
    return { status: 409, error: "El correo ya está registrado." };
  }

  // Crear contraseña
  const finalPassword = contrasena || Math.random().toString(36).slice(-10);
  const hashed = await bcrypt.hash(finalPassword, 10);

  // Crear usuario
  const { data: user, error: userError } = await supabase
    .from("usuarios")
    .insert([
      {
        nombre_completo,
        correo,
        contrasena: hashed,
        activo
      }
    ])
    .select()
    .single();

  if (userError) {
    return { status: 500, error: "Error creando usuario." };
  }

  // Asignar rol + empresa (multiempresa)
  const { error: relError } = await supabase
    .from("empresa_usuario_roles")
    .insert([
      {
        usuario_id: user.id,
        empresa_id: empresaId,
        rol_id
      }
    ]);

  if (relError) {
    return { status: 500, error: "Error asignando rol al usuario." };
  }

  await registerAudit({
    userId: req.user.id,
    action: "USER_CREATED",
    details: { new_user_id: user.id, correo, rol_id },
    ip, userAgent
  });

  return {
    status: 201,
    data: {
      message: "Usuario creado exitosamente.",
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        activo: user.activo,
        rol_id,
      },
      generated_password: contrasena ? null : finalPassword
    }
  };
}

// ======================================================================
//  GET USER
// ======================================================================
export async function getUser(req) {
  const { id } = req.params;
  const empresaId = req.user.empresa_id;
  const { ip, userAgent } = getRequestMeta(req);

  const { data, error } = await supabase
    .from("empresa_usuario_roles")
    .select(`
      rol_id,
      roles ( nombre ),
      usuarios (
        id,
        nombre_completo,
        correo,
        activo,
        created_at
      )
    `)
    .eq("empresa_id", empresaId)
    .eq("usuario_id", id)
    .single();

  if (error || !data) {
    return { status: 404, error: "Usuario no encontrado." };
  }

  return {
    status: 200,
    data: {
      user: {
        id: data.usuarios.id,
        nombre_completo: data.usuarios.nombre_completo,
        correo: data.usuarios.correo,
        activo: data.usuarios.activo,
        rol_id: data.rol_id,
        rol_nombre: data.roles?.nombre || null,
        creado_en: data.usuarios.created_at
      }
    }
  };
}

// ======================================================================
//  UPDATE USER
// ======================================================================
export async function updateUser(req) {
  const { id } = req.params;
  const empresaId = req.user.empresa_id;
  const { nombre_completo, correo, rol_id, activo } = req.body;

  const fields = {};
  if (nombre_completo !== undefined) fields.nombre_completo = nombre_completo;
  if (correo !== undefined) fields.correo = correo;
  if (activo !== undefined) fields.activo = activo;

  // Actualizar usuario
  const { data: user, error: userError } = await supabase
    .from("usuarios")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (userError) return { status: 500, error: "Error actualizando usuario." };

  // Actualizar rol
  if (rol_id !== undefined) {
    await supabase
      .from("empresa_usuario_roles")
      .update({ rol_id })
      .eq("usuario_id", id)
      .eq("empresa_id", empresaId);
  }

  return {
    status: 200,
    data: {
      message: "Usuario actualizado correctamente.",
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        activo: user.activo,
        rol_id,
      }
    }
  };
}

// ======================================================================
//  UPDATE USER STATE
// ======================================================================
export async function updateUserState(req) {
  const { id } = req.params;
  const { activo } = req.body;

  const { data, error } = await supabase
    .from("usuarios")
    .update({ activo })
    .eq("id", id)
    .select()
    .single();

  if (error) return { status: 500, error: "Error cambiando estado." };

  return {
    status: 200,
    data: {
      message: `Usuario ${activo ? "activado" : "desactivado"}.`,
      user: {
        id: data.id,
        nombre_completo: data.nombre_completo,
        correo: data.correo,
        activo: data.activo
      }
    }
  };
}

// ======================================================================
//  RESET PASSWORD
// ======================================================================
export async function resetPassword(req) {
  const { id } = req.params;

  const newPassword = Math.random().toString(36).slice(-10);
  const hashed = await bcrypt.hash(newPassword, 10);

  const { data, error } = await supabase
    .from("usuarios")
    .update({ contrasena: hashed })
    .eq("id", id)
    .select()
    .single();

  if (error) return { status: 500, error: "Error reseteando contraseña." };

  return {
    status: 200,
    data: {
      message: "Contraseña reseteada correctamente.",
      new_password: newPassword,
      user: {
        id: data.id,
        nombre_completo: data.nombre_completo,
        correo: data.correo
      }
    }
  };
}
