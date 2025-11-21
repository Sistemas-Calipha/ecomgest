// src/middlewares/companyScope.js

export default function companyScope(req, res, next) {
  try {
    if (!req.user || !req.user.empresa_id) {
      return res.status(401).json({
        mensaje: "Empresa no identificada en el token"
      });
    }

    // Se puede agregar lógica adicional aquí si hace falta
    next();

  } catch (err) {
    console.error("Error en companyScope:", err);
    res.status(500).json({ mensaje: "Error interno en companyScope" });
  }
}
