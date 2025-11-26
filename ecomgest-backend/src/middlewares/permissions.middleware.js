import supabase from "../config/supabase.js";

export function authorizePermission(permissionName) {
  return async (req, res, next) => {
    try {
      // Validar existencia de rol
      const roleId = req.user?.rol_id;
      
      console.log("DEBUG req.user:", req.user);

      if (!roleId || typeof roleId !== "number") {
        return res.status(403).json({
          message: "No hay un rol seleccionado en el token."
        });
      }

      // Buscar permiso por nombre
      const { data: permission, error: errorPerm } = await supabase
        .from("permisos")
        .select("id")
        .eq("nombre", permissionName)
        .eq("activo", true)
        .single();

      if (errorPerm || !permission) {
        return res.status(403).json({
          message: "El permiso no existe o está inactivo."
        });
      }

      // Validar si el rol tiene ese permiso
      const { data: assigned, error: errorAssigned } = await supabase
        .from("roles_permisos")
        .select("id")
        .eq("rol_id", roleId)
        .eq("permiso_id", permission.id)
        .limit(1);

      if (errorAssigned) throw errorAssigned;

      if (!assigned || assigned.length === 0) {
        return res.status(403).json({
          message: "No tienes este permiso."
        });
      }

      next();

    } catch (err) {
      console.error("❌ Error in authorizePermission:", err);
      res.status(500).json({
        message: "Internal error in permission middleware."
      });
    }
  };
}
