// ===============================================================
//  src/middlewares/auth.middleware.js
//  Middleware para validar JWT y extraer datos de usuario
// ===============================================================

import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    console.log("🟡 Authorization recibido:", authHeader || "NULO");

    // -----------------------------------------------------------
    // VALIDAR QUE EXISTA EL HEADER
    // -----------------------------------------------------------
    if (!authHeader) {
      return res
        .status(401)
        .json({ mensaje: "Falta encabezado Authorization." });
    }

    // Formato esperado: "Bearer TOKEN"
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ mensaje: "Formato del token inválido. Debe ser: Bearer <token>" });
    }

    // -----------------------------------------------------------
    // VERIFICAR TOKEN
    // -----------------------------------------------------------
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ Token inválido o expirado:", err.message);

        return res
          .status(403)
          .json({ mensaje: "Token inválido o expirado." });
      }

      // Guardamos información del usuario para toda la request
      req.user = decoded; // { id, correo, iat, exp }

      console.log("🟢 Token válido. Usuario ID:", decoded.id);
      console.log("🟢 Token válido → decoded:", decoded);


      next();
    });

  } catch (err) {
    console.error("❌ ERROR EN verifyToken:", err.message);
    return res.status(500).json({
      mensaje: "Error interno al procesar token.",
      error: err.message
    });
  }
}
