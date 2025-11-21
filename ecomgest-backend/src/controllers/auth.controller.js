// ======================================================================
//  src/controllers/auth.controller.js
//  Controladores de autenticación y selección de empresa
// ======================================================================

import {
  loginService,
  registerService,
  createDemoAccount
} from "../services/auth.service.js";

import supabase from "../config/supabase.js";
import jwt from "jsonwebtoken";
import { registrarAccion } from "../utils/audit.js";  // ✅ Import correcto

// ======================================================================
//  GENERAR HASH (TEST)
// ======================================================================
export async function generarHashTest(req, res) {
  try {
    const bcrypt = (await import("bcryptjs")).default;
    const hash = await bcrypt.hash("123456", 10);
    return res.json({ hash });
  } catch (err) {
    console.error("❌ Error generando hash:", err.message);
    return res.status(500).json({ error: "Error generando hash" });
  }
}

// ======================================================================
//  LOGIN
// ======================================================================
export async function loginController(req, res) {
  try {
    console.log("🟡 BODY RECIBIDO EN LOGIN:", req.body);

    const result = await loginService(req);

    if (result.error) {
      return res.status(result.status).json({ mensaje: result.error });
    }

    // ======================================================
    // AUDITORÍA — SOLO SI EL LOGIN FUE EXITOSO
    // ======================================================
    await registrarAccion(req, "LOGIN", {
      usuario: result.data.user.correo,
      usuario_id: result.data.user.id
    });

    return res.status(result.status).json(result.data);

  } catch (err) {
    console.error("❌ ERROR LOGIN:", err.message);
    return res.status(500).json({ mensaje: "Error interno en login" });
  }
}

// ======================================================================
//  REGISTRO
// ======================================================================
export async function registerController(req, res) {
  try {
    const result = await registerService(req);

    if (result.error) {
      return res.status(result.status).json({ mensaje: result.error });
    }

    return res.status(result.status).json(result.data);

  } catch (err) {
    console.error("❌ ERROR REGISTRO:", err.message);
    return res.status(500).json({ mensaje: "Error interno en registro" });
  }
}

// ======================================================================
//  CREAR CUENTA DEMO
// ======================================================================
export async function demoController(req, res) {
  try {
    const result = await createDemoAccount(req);

    if (result.error) {
      return res.status(result.status).json({ mensaje: result.error });
    }

    return res.status(result.status).json(result.data);

  } catch (err) {
    console.error("❌ ERROR DEMO:", err.message);
    return res.status(500).json({ mensaje: "Error interno en demo" });
  }
}

// ======================================================================
//  TEST TOKEN – MULTIEMPRESA
// ======================================================================
export async function testTokenController(req, res) {
  try {
    return res.json({
      ok: true,
      mensaje: "Token válido",
      usuario: {
        id: req.user.id,
        empresa_id: req.user.empresa_id ?? null,
        rol_id: req.user.rol_id ?? null,
        rol_nombre: req.user.rol_nombre ?? null
      }
    });

  } catch (err) {
    console.error("❌ ERROR VALIDANDO TOKEN:", err.message);
    return res.status(401).json({
      mensaje: "Token inválido",
      error: err.message
    });
  }
}

// ======================================================================
//  SELECT COMPANY
// ======================================================================
export async function selectCompanyController(req, res) {
  try {
    const userId = req.user?.id;
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: "companyId es requerido." });
    }

    if (!userId) {
      return res.status(401).json({
        error: "No se pudo identificar al usuario desde el token."
      });
    }

    const { data: relacion, error: relacionError } = await supabase
      .from("empresa_usuario_roles")
      .select("empresa_id, rol_id, roles(nombre)")
      .eq("usuario_id", userId)
      .eq("empresa_id", companyId)
      .single();

    if (relacionError) {
      console.error("❌ Error consultando relación:", relacionError);
      return res.status(500).json({
        error: "Error al consultar la relación usuario-empresa."
      });
    }

    if (!relacion) {
      return res.status(403).json({
        error: "El usuario no tiene acceso a esta empresa."
      });
    }

    const nuevoToken = jwt.sign(
      {
        id: userId,
        empresa_id: relacion.empresa_id,
        rol_id: relacion.rol_id,
        rol_nombre: relacion.roles.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // AUDITORÍA
    await registrarAccion(req, "SELECT_COMPANY", {
      empresa_id: relacion.empresa_id,
      rol: relacion.roles.nombre
    });

    return res.json({
      ok: true,
      mensaje: "Empresa seleccionada correctamente.",
      empresa_id: relacion.empresa_id,
      rol_id: relacion.rol_id,
      rol_nombre: relacion.roles.nombre,
      token: nuevoToken
    });

  } catch (error) {
    console.error("❌ ERROR selectCompanyController:", error.message);
    return res.status(500).json({
      error: "Error interno al seleccionar empresa.",
      detalle: error.message
    });
  }
}
