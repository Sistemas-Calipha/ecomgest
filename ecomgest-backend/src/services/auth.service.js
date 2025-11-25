// ======================================================================
//  src/services/auth.service.js
//  Servicio de autenticación multiempresa
// ======================================================================

import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { registerAudit } from "./audit.service.js";
import { getRequestMeta } from "../middlewares/audit.middleware.js";


// ======================================================================
//  LOGIN MULTIEMPRESA
// ======================================================================
export async function loginService(req) {
  const correo = req.body.correo || req.body.email;
  const contrasena = req.body.contrasena || req.body.password;

  const { ip, userAgent } = getRequestMeta(req);

  if (!correo || !contrasena) {
    await registerAudit({
      userId: null,
      action: "LOGIN_MISSING_FIELDS",
      details: { correo_intento: correo },
      ip, userAgent
    });

    return { status: 400, error: "Faltan datos obligatorios." };
  }

  // Buscar usuario
  const { data: users, error: errorUser } = await supabase
    .from("usuarios")
    .select("*")
    .eq("correo", correo)
    .limit(1);

  if (errorUser || !users.length) {
    await registerAudit({
      userId: null,
      action: "LOGIN_USER_NOT_FOUND",
      details: { correo_intento: correo },
      ip, userAgent
    });

    return { status: 401, error: "Credenciales inválidas." };
  }

  const user = users[0];

  // Validar contraseña
  const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);

  if (!isValidPassword) {
    await registerAudit({
      userId: user.id,
      action: "LOGIN_INVALID_PASSWORD",
      details: { correo },
      ip, userAgent
    });

    return { status: 401, error: "Credenciales inválidas." };
  }

  // Empresas + roles asociados al usuario
  const { data: empresaRoles, error: empresaError } = await supabase
    .from("empresa_usuario_roles")
    .select(`
      empresa_id,
      rol_id,
      empresas ( nombre ),
      roles ( nombre )
    `)
    .eq("usuario_id", user.id);

  if (empresaError) {
    return { status: 500, error: "Error al cargar las empresas del usuario." };
  }

  const empresasFormateadas = empresaRoles.map((e) => ({
    empresa_id: e.empresa_id,
    empresa_nombre: e.empresas?.nombre || null,
    rol_id: e.rol_id,
    rol_nombre: e.roles?.nombre || null
  }));

  // Token general (sin empresa)
  const token = jwt.sign(
    {
      id: user.id,
      correo: user.correo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  // Auditoría OK
  await registerAudit({
    userId: user.id,
    action: "LOGIN_SUCCESS",
    details: { correo },
    ip, userAgent
  });

  return {
    status: 200,
    data: {
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        activo: user.activo,
        empresas: empresasFormateadas,
      },
      token,
    },
  };
}


// ======================================================================
//  SELECT COMPANY (TOKEN CON EMPRESA + ROL)
// ======================================================================
export async function selectCompanyService(req) {
  const { ip, userAgent } = getRequestMeta(req);
  const { userId, companyId } = req.body;

  if (!userId || !companyId) {
    return { status: 400, error: "userId y companyId son requeridos." };
  }

  const { data: relacion, error: relError } = await supabase
    .from("empresa_usuario_roles")
    .select(`
      empresa_id,
      rol_id,
      empresas ( nombre ),
      roles ( nombre )
    `)
    .eq("usuario_id", userId)
    .eq("empresa_id", companyId)
    .single();

  if (relError || !relacion) {
    return { status: 403, error: "El usuario no tiene acceso a esta empresa." };
  }

  const token = jwt.sign(
    {
      id: userId,
      empresa_id: relacion.empresa_id,
      rol_id: relacion.rol_id,
      rol_nombre: relacion.roles?.nombre || null
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  await registerAudit({
    userId,
    action: "SELECT_COMPANY_SUCCESS",
    details: {
      empresa_id: relacion.empresa_id,
      empresa_nombre: relacion.empresas?.nombre || null,
      rol_id: relacion.rol_id,
      rol_nombre: relacion.roles?.nombre || null
    },
    ip, userAgent
  });

  return {
    status: 200,
    data: {
      message: "Empresa seleccionada correctamente.",
      token,
      company: {
        id: relacion.empresa_id,
        nombre: relacion.empresas?.nombre || null,
        rol_id: relacion.rol_id,
        rol_nombre: relacion.roles?.nombre || null
      }
    }
  };
}
