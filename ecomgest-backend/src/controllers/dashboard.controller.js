// src/controllers/dashboard.controller.js
import supabase from "../config/supabase.js";

export async function getMyDashboardConfig(req, res) {
  try {
    const userId = req.user.id;
    const empresaId = req.user.empresa_id;

    const { data, error } = await supabase
      .from("dashboard_config")
      .select("*")
      .eq("empresa_id", empresaId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error cargando config:", error);
      return res.status(500).json({ error: "Error cargando config" });
    }

    return res.json({
      config: data || {
        widgets: [],
        disabled_widgets: [],
      },
    });
  } catch (err) {
    console.error("❌ Error interno:", err);
    return res.status(500).json({ error: "Error cargando configuración" });
  }
}

export async function saveDashboardConfig(req, res) {
  try {
    const userId = req.user.id;
    const empresaId = req.user.empresa_id;
    const { widgets, disabled_widgets } = req.body;

    console.log("🟦 SAVE CONFIG → empresaId:", empresaId, "userId:", userId);
    console.log("🟦 BODY:", req.body);


    // UPSERT = update si existe o insert si no
    const { error } = await supabase.from("dashboard_config").upsert(
      {
        empresa_id: empresaId,
        user_id: userId,
        widgets: widgets || [],
        disabled_widgets: disabled_widgets || [],
      },
      { onConflict: "empresa_id,user_id" }
    );

    if (error) {
      console.error("❌ Error guardando config:", error);
      return res.status(500).json({ error: "Error guardando configuración" });
    }

    return res.json({ mensaje: "Configuración guardada" });
  } catch (err) {
    console.error("❌ Error interno:", err);
    return res.status(500).json({ error: "Error guardando configuración" });
  }
}
