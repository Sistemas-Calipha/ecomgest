// ======================================================================
//  src/controllers/auth.controller.js
//  Controladores de autenticación multiempresa
// ======================================================================

import {
  loginService,
  selectCompanyService,
} from "../services/auth.service.js";

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
    // loginService devuelve: { status, error } o { status, data }
    if (result.error) {
      return res.status(result.status || 400).json({ mensaje: result.error });
    }

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error("❌ Error en loginController:", error);
    return res.status(500).json({ error: "Error interno en login" });
  }
}

// ======================================================================
//  REGISTRO (stub temporal)
// ======================================================================
export async function registerController(req, res) {
  try {
    return res
      .status(501)
      .json({ mensaje: "Registro de usuarios aún no implementado." });
  } catch (error) {
    console.error("❌ Error en registerController:", error);
    return res.status(500).json({ error: "Error interno en registro" });
  }
}

// ======================================================================
//  CREAR CUENTA DEMO (stub temporal)
// ======================================================================
export async function demoController(req, res) {
  try {
    return res
      .status(501)
      .json({ mensaje: "Creación de cuenta demo aún no implementada." });
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
        rol_nombre: req.user.rol_nombre ?? null,
      },
    });
  } catch (err) {
    console.error("❌ ERROR VALIDANDO TOKEN:", err.message);
    return res.status(401).json({
      mensaje: "Token inválido",
      error: err.message,
    });
  }
}

// ======================================================================
//  SELECT COMPANY  (usa el service que ya tienes)
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
        error: "No se pudo identificar al usuario desde el token.",
      });
    }

    // Inyectamos userId en el body para que el service lo use
    req.body.userId = userId;

    const result = await selectCompanyService(req);

    if (result.error) {
      return res.status(result.status || 400).json({ mensaje: result.error });
    }

    // selectCompanyService devuelve { status, data: {...} }
    return res.status(result.status || 200).json(result.data);
  } catch (error) {
    console.error("❌ ERROR selectCompanyController:", error.message);
    return res.status(500).json({
      error: "Error interno al seleccionar empresa.",
      detalle: error.message,
    });
  }
}
