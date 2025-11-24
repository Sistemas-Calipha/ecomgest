// src/controllers/dashboard.controller.js
import supabase from "../config/supabase.js";

export async function getMyDashboardConfig(req, res) {
  try {
    const userId = req.user.id;
    const empresaId = req.user.empresa_id;

    // 1) Buscar config existente
    let { data, error } = await supabase
      .from("dashboard_config")
      .select("*")
      .eq("empresa_id", empresaId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ Error cargando config:", error);
      return res.status(500).json({ error: "Error cargando configuración" });
    }

    // 2) Si no existe, crearla
    if (!data) {
      const init = {
        empresa_id: empresaId,
        user_id: userId,
        widgets: [
          "kpis",
          "ventas",
          "ingresosGastos",
          "stock",
          "clientes",
          "actividad",
        ],
        disabled_widgets: []
      };

      const { data: inserted, error: err2 } = await supabase
        .from("dashboard_config")
        .insert(init)
        .select()
        .single();

      if (err2) {
        console.error("❌ Error insertando config:", err2);
        return res.status(500).json({ error: "Error generando config inicial" });
      }

      data = inserted;
    }

    // 3) Responder config real
    return res.json({ config: data });

  } catch (err) {
    console.error("❌ Error interno:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}


export async function saveDashboardConfig(req, res) {
  try {
    const userId = req.user.id;
    const empresaId = req.user.empresa_id;
    const { widgets, disabled_widgets } = req.body;

    console.log("🟦 SAVE CONFIG → empresaId:", empresaId, "userId:", userId);
    console.log("🟦 BODY:", req.body);

    // 1) Intentar UPDATE primero
    const { data: updated, error: updateError } = await supabase
      .from("dashboard_config")
      .update({
        widgets: widgets || [],
        disabled_widgets: disabled_widgets || [],
        updated_at: new Date().toISOString(),
      })
      .eq("empresa_id", empresaId)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("❌ Error en UPDATE:", updateError);
    }

    // Si el UPDATE funcionó → devolver OK
    if (updated) {
      return res.json({ mensaje: "Configuración actualizada", config: updated });
    }

    // 2) Si no existía fila, hacer INSERT
    const { data: inserted, error: insertError } = await supabase
      .from("dashboard_config")
      .insert({
        empresa_id: empresaId,
        user_id: userId,
        widgets: widgets || [],
        disabled_widgets: disabled_widgets || [],
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Error en INSERT:", insertError);
      return res
        .status(500)
        .json({ error: "No se pudo guardar la configuración" });
    }

    return res.json({
      mensaje: "Configuración creada",
      config: inserted,
    });
  } catch (err) {
    console.error("❌ Error interno en saveDashboardConfig:", err);
    return res.status(500).json({
      error: "Error interno guardando configuración",
    });
  }
}

