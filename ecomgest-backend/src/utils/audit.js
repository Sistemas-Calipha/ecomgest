// =========================================================
//  UTILIDAD DE AUDITORÍA
// =========================================================

import supabase from "../config/supabase.js";

// ---------------------------------------------------------
// Capturar IP real
// ---------------------------------------------------------
function getIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.ip ||
    null
  );
}

// ---------------------------------------------------------
// Registrar acción de auditoría
// ---------------------------------------------------------
export async function registrarAccion(req, accion, detalle = {}) {
  try {
    const usuario_id = req.user?.id ?? detalle.usuario_id ?? null;

    await supabase.from("auditoria").insert({
      usuario_id,
      accion,
      detalle,
      ip: getIP(req),
      user_agent: req.headers["user-agent"] ?? null
    });

    return true;

  } catch (error) {
    console.error("❌ ERROR registrando auditoría:", error.message);
    return false;
  }
}
