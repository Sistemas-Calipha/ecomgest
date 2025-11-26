// ======================================================================
//  src/middlewares/permissions.middleware.js
//  Middleware para validar permisos reales del usuario según su empresa
// ======================================================================

import supabase from "../config/supabase.js";

// ======================================================================
//  authorizePermission(nombre_permiso)
//  Valida que el usuario tenga ese permiso dentro de su empresa actual
// ======================================================================
export function authorizePermission(requiredPermission) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const empresaId = req.user?.empresa_id;

      if (!userId || !empresaId) {
        return res.status(401).json({
          mensaje: "Token inválido o falta empresa seleccionada."
        });
      }

      // Obtener rol del usuario en esta empresa
      const { data: rel, error: relError } = await supabase
        .from("empresa_usuario_roles")
        .select("rol_id")
        .eq("usuario_id", userId)
        .eq("empresa_id", empresaId)
        .single();

      if (relError || !rel) {
        return res.status(403).json({
          mensaje: "El usuario no tiene un rol en esta empresa."
        });
      }

      const rolId = rel.rol_id;

      // Buscar permisos del rol
      const { data: perms, error: permsError } = await supabase
        .from("roles_permisos")
        .select(`
          permisos ( nombre )
        `)
        .eq("rol_id", rolId);

      if (permsError) {
        return res.status(500).json({
          mensaje: "Error validando permisos."
        });
      }

      // Lista de permisos que tiene el usuario
      const permisos = perms.map(p => p.permisos?.nombre);

      // Validar permiso requerido
      if (!permisos.includes(requiredPermission)) {
        return res.status(403).json({
          mensaje: `No tienes el permiso requerido: ${requiredPermission}`
        });
      }

      // Todo OK
      next();

    } catch (err) {
      console.error("❌ Error en authorizePermission:", err);
      return res.status(500).json({
        mensaje: "Internal error in permission middleware."
      });
    }
  };
}
