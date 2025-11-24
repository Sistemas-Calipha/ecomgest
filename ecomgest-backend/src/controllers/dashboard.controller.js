// src/controllers/dashboard.controller.js

import {
  getConfigForUserCompany,
  saveConfigForUserCompany
} from "../services/dashboard.service.js";

export async function getMyDashboard(req, res) {
  try {
    const userId = req.user.id;
    const empresaId = req.user.empresa_id;

    const data = await getConfigForUserCompany(userId, empresaId);

    return res.json({
      ok: true,
      widgets: data.widgets,
      disabled: data.disabled_widgets
    });
  } catch (err) {
    console.error("❌ Error en getMyDashboard:", err);
    return res.status(500).json({ error: "Error cargando dashboard" });
  }
}

export async function saveMyDashboard(req, res) {
  try {
    const userId = req.user.id;
    const empresaId = req.user.empresa_id;

    const { widgets, disabled_widgets } = req.body;

    if (!Array.isArray(widgets)) {
      return res.status(400).json({ error: "widgets debe ser un array" });
    }

    const data = await saveConfigForUserCompany(
      userId,
      empresaId,
      widgets,
      disabled_widgets || []
    );

    return res.json({
      ok: true,
      widgets: data.widgets,
      disabled: data.disabled_widgets
    });
  } catch (err) {
    console.error("❌ Error en saveMyDashboard:", err);
    return res.status(500).json({ error: "Error guardando dashboard" });
  }
}
