// src/services/dashboard.service.js

import supabase from "../config/supabase.js";

export async function getConfigForUserCompany(userId, empresaId) {
  const { data, error } = await supabase
    .from("dashboard_config")
    .select("*")
    .eq("user_id", userId)
    .eq("empresa_id", empresaId)
    .maybeSingle();

  if (error) throw error;

  // Si no existe config, crearla
  if (!data) {
    const init = {
      user_id: userId,
      empresa_id: empresaId,
      widgets: [
        "kpis",
        "ventas",
        "ingresosGastos",
        "stock",
        "clientes",
        "actividad"
      ],
      disabled_widgets: []
    };

    const { data: inserted, error: err2 } = await supabase
      .from("dashboard_config")
      .insert(init)
      .select()
      .single();

    if (err2) throw err2;
    return inserted;
  }

  return data;
}

export async function saveConfigForUserCompany(
  userId,
  empresaId,
  widgets,
  disabledWidgets
) {
  const { data, error } = await supabase
    .from("dashboard_config")
    .update({
      widgets,
      disabled_widgets: disabledWidgets,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId)
    .eq("empresa_id", empresaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
