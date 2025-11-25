import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { registerAudit } from "./audit.service.js";
import { getRequestMeta } from "../middlewares/audit.middleware.js";

//
// =======================================================
// LOGIN MULTI-EMPRESA (VERSIÓN CORREGIDA Y OPTIMIZADA)
// =======================================================
//

import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { registerAudit } from "./audit.service.js";
import { getRequestMeta } from "../middlewares/audit.middleware.js";

export async function loginService(req) {
  const correo = req.body.correo || req.body.email;
  const contrasena = req.body.contrasena || req.body.password;

  const { ip, userAgent } = getRequestMeta(req);

  // -------------------------
  // Validación inicial
  // -------------------------
  if (!correo || !contrasena) {
    await registerAudit({
      userId: null,
      action: "LOGIN_MISSING_FIELDS",
      details: { correo_intento: correo },
      ip,
      userAgent,
    });

    return { status: 400, error: "Faltan datos obligatorios." };
  }

  // -------------------------
  // Buscar usuario
  // -------------------------
  const { data: users, error: errorUser } = await supabase
    .from("usuarios")
    .select("*")
    .eq("correo", correo)
    .limit(1);

  if (errorUser || !users || users.length === 0) {
    await registerAudit({
      userId: null,
      action: "LOGIN_USER_NOT_FOUND",
      details: { correo_intento: correo },
      ip,
      userAgent,
    });

    return { status: 401, error: "Credenciales inválidas." };
  }

  const user = users[0];

  // -------------------------
  // Validar contraseña
  // -------------------------
  const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);

  if (!isValidPassword) {
    await registerAudit({
      userId: user.id,
      action: "LOGIN_INVALID_PASSWORD",
      details: { correo },
      ip,
      userAgent,
    });

    return { status: 401, error: "Credenciales inválidas." };
  }

  // -------------------------
  // OBTENER EMPRESAS + ROLES DEL USUARIO
  // -------------------------
  console.log("🟣 DEBUG → User ID:", user.id);

  const { data: empresaRoles, error: empresaError } = await supabase
    .from("empresa_usuario_roles")
    .select(`
      empresa_id,
      rol_id,
      empresas ( nombre ),
      roles ( nombre )
    `)
    .eq("usuario_id", user.id);

  console.log("🧪 DEBUG empresaError:", empresaError);
  console.log("🧪 DEBUG empresaRoles RAW:", empresaRoles);

  if (empresaError) {
    return {
      status: 500,
      error: "Error al cargar las empresas del usuario."
    };
  }

  // Normaliza la data
  const empresasFormateadas = empresaRoles.map((item) => ({
    empresa_id: item.empresa_id,
    empresa_nombre: item.empresas?.nombre || null,
    rol_id: item.rol_id,
    rol_nombre: item.roles?.nombre || null,
  }));

  // -------------------------
  // EMPRESA Y ROL INICIAL
  // -------------------------
  const empresaInicial = empresasFormateadas[0] || {};

  console.log("🟪 Empresa inicial asignada al token:", empresaInicial);

  // -------------------------
  // GENERAR TOKEN COMPLETO (MULTIEMPRESA)
  // -------------------------
  const token = jwt.sign(
    {
      id: user.id,
      correo: user.correo,

      // 🔥 INYECCIÓN QUE SOLUCIONA TODO
      empresa_id: empresaInicial.empresa_id || null,
      rol_id: empresaInicial.rol_id || null,
      rol_nombre: empresaInicial.rol_nombre || null
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  // -------------------------
  // AUDITORÍA LOGIN
  // -------------------------
  await registerAudit({
    userId: user.id,
    action: "LOGIN_SUCCESS",
    details: {
      correo,
      empresa_inicial: empresaInicial.empresa_id,
      rol_inicial: empresaInicial.rol_id,
    },
    ip,
    userAgent,
  });

  // -------------------------
  // RESPUESTA COMPLETA
  // -------------------------
  return {
    status: 200,
    data: {
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        activo: user.activo,
        empresas: empresasFormateadas, // Todas las empresas
      },
      token,
    },
  };
}


//
// =======================================================
// REGISTER
// =======================================================
//
export async function registerService(req) {
  const { nombre_completo, correo, contrasena, rol_id = 4 } = req.body;

  if (!nombre_completo || !correo || !contrasena) {
    return { status: 400, error: "Faltan datos obligatorios." };
  }

  const { ip, userAgent } = getRequestMeta(req);

  const { data: exists } = await supabase
    .from("usuarios")
    .select("id")
    .eq("correo", correo)
    .limit(1);

  if (exists && exists.length > 0) {
    return { status: 409, error: "El correo ya está registrado." };
  }

  const hashedPassword = await bcrypt.hash(contrasena, 10);

  const { data, error } = await supabase
    .from("usuarios")
    .insert([
      {
        nombre_completo,
        correo,
        contrasena: hashedPassword,
        rol_id,
        activo: true,
      },
    ])
    .select();

  if (error) return { status: 500, error: "Error interno del servidor." };

  await registerAudit({
    userId: data[0].id,
    action: "REGISTER_SUCCESS",
    details: { correo, rol_id },
    ip,
    userAgent,
  });

  return {
    status: 201,
    data: {
      message: "Usuario registrado exitosamente.",
      user: {
        id: data[0].id,
        nombre_completo: data[0].nombre_completo,
        correo: data[0].correo,
        rol_id: data[0].rol_id,
        activo: data[0].activo,
      },
    },
  };
}

//
// =======================================================
// GENERACIÓN DE CUENTA DE DEMO
// =======================================================
//
export async function createDemoAccount(req) {
  const timestamp = Date.now();
  const correo = `invitado_${timestamp}@demo.com`;
  const nombre = `Invitado ${new Date().toLocaleDateString()}`;
  const contrasena = Math.random().toString(36).slice(-8);

  const hashed = await bcrypt.hash(contrasena, 10);

  const { data, error } = await supabase
    .from("usuarios")
    .insert([
      {
        nombre_completo: nombre,
        correo,
        contrasena: hashed,
        rol_id: 5,
        activo: true,
      },
    ])
    .select();

  if (error) return { status: 500, error: "Error interno del servidor." };

  const token = jwt.sign(
    { id: data[0].id, correo: data[0].correo, rol_id: 5 },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    status: 201,
    data: {
      message: "Cuenta de demostración creada.",
      user: data[0],
      contrasena,
      token,
    },
  };
}

//
// =======================================================
// SELECT-COMPANY → TOKEN CON CONTEXTO DE EMPRESA
// =======================================================
//
export async function selectCompanyService(req) {
  const { ip, userAgent } = getRequestMeta(req);

  const { userId, companyId } = req.body;

  if (!userId || !companyId) {
    await registerAudit({
      userId: null,
      action: "SELECT_COMPANY_MISSING_FIELDS",
      details: { userId, companyId },
      ip,
      userAgent,
    });

    return {
      status: 400,
      error: "userId y companyId son requeridos.",
    };
  }

  // 1) Validar que el usuario pertenece a esa empresa
  const { data: relacion, error: relError } = await supabase
    .from("empresa_usuario_roles")
    .select(
      `
        empresa_id,
        rol_id,
        empresas ( nombre ),
        roles ( nombre )
      `
    )
    .eq("empresa_id", companyId)
    .eq("usuario_id", userId)
    .single();

  if (relError || !relacion) {
    await registerAudit({
      userId,
      action: "SELECT_COMPANY_FORBIDDEN",
      details: { companyId },
      ip,
      userAgent,
    });

    return {
      status: 403,
      error: "El usuario no tiene acceso a esta empresa.",
    };
  }

  // 2) Traer datos del usuario (para el token y respuesta)
  const { data: user, error: userError } = await supabase
    .from("usuarios")
    .select("id, correo, nombre_completo, activo")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    return {
      status: 404,
      error: "Usuario no encontrado.",
    };
  }

  // 3) Construir payload del token con contexto de empresa
  const payload = {
    id: user.id,
    correo: user.correo,
    company: {
      id: relacion.empresa_id,
      nombre: relacion.empresas?.nombre || null,
    },
    role: {
      id: relacion.rol_id,
      nombre: relacion.roles?.nombre || null,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  // 4) Registrar auditoría
  await registerAudit({
    userId: user.id,
    action: "SELECT_COMPANY_SUCCESS",
    details: {
      companyId: relacion.empresa_id,
      companyName: relacion.empresas?.nombre || null,
      roleId: relacion.rol_id,
      roleName: relacion.roles?.nombre || null,
    },
    ip,
    userAgent,
  });

  // 5) Respuesta estándar
  return {
    status: 200,
    data: {
      message: "Empresa seleccionada correctamente.",
      token,
      company: {
        id: relacion.empresa_id,
        nombre: relacion.empresas?.nombre || null,
        rol_id: relacion.rol_id,
        rol_nombre: relacion.roles?.nombre || null,
      },
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        activo: user.activo,
      },
    },
  };
}
