export async function listRolesController(req, res) {
  const result = await listRoles(req);

  if (result.error) {
    return res.status(result.status).json({ mensaje: result.error });
  }

  // 🔥 NORMALIZAMOS LA RESPUESTA PARA EL FRONTEND
  return res.status(200).json({
    roles: result.data.roles
  });
}
