// ======================================================================
//  src/controllers/paymentMethods.controller.js
//  Métodos de pago (multitenant por empresa)
// ======================================================================

import supabase from "../config/supabase.js";

// ======================================================================
//  GET → Obtener métodos de pago filtrados por empresa
// ======================================================================
export async function getPaymentMethods(req, res) {
  try {
    // 1) Validar que el middleware haya puesto la info del usuario
    if (!req.user) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado (req.user vacío).",
      });
    }

    if (!req.user.empresa_id) {
      return res.status(401).json({
        mensaje: "Token válido, pero no contiene empresa_id.",
        user: req.user,
      });
    }

    const empresaId = req.user.empresa_id;

    // 2) Consultar solo los métodos de pago de ESA empresa
    const { data, error } = await supabase
      .from("metodos_pago")
      .select("*")
      .eq("empresa_id", empresaId)      // 🔹 Filtro clave
      .order("nombre", { ascending: true });

    if (error) {
      console.error("❌ Error Supabase (metodos_pago):", error.message);
      return res.status(500).json({
        mensaje: "Error consultando métodos de pago.",
        error: error.message,
      });
    }

    // 3) Respuesta clara y útil
    return res.status(200).json({
      mensaje: "Métodos de pago obtenidos con éxito.",
      empresa_id: empresaId,
      total: data?.length || 0,
      data,
    });
  } catch (err) {
    console.error("❌ Error en getPaymentMethods:", err.message);
    return res.status(500).json({
      mensaje: "Error interno en métodos de pago.",
      error: err.message,
    });
  }
}

// ======================================================================
//  POST → Crear método de pago (multitenant seguro)
// ======================================================================
export async function createPaymentMethod(req, res) {
  try {
    const { nombre, tipo } = req.body;

    if (!nombre) {
      return res.status(400).json({
        mensaje: "El campo 'nombre' es obligatorio."
      });
    }

    // Validar usuario autenticado
    if (!req.user || !req.user.empresa_id) {
      return res.status(401).json({
        mensaje: "Token válido, pero falta empresa_id."
      });
    }

    const empresaId = req.user.empresa_id;

    // Insert seguro
    const { data, error } = await supabase
      .from("metodos_pago")
      .insert([
        {
          nombre,
          tipo,
          empresa_id: empresaId,
        }
      ])
      .select();

    if (error) {
      console.error("❌ Error Supabase (insert):", error.message);
      return res.status(500).json({
        mensaje: "Error creando método de pago.",
        error: error.message,
      });
    }

    return res.status(201).json({
      mensaje: "Método de pago creado con éxito.",
      data,
    });

  } catch (err) {
    console.error("❌ Error en createPaymentMethod:", err.message);
    return res.status(500).json({
      mensaje: "Error interno.",
      error: err.message,
    });
  }
}

// ======================================================================
//  UPDATE → Actualizar un método de pago de la empresa del usuario
// ======================================================================
export async function updatePaymentMethod(req, res) {
  try {
    const { id } = req.params;
    const { nombre, tipo, porcentaje_comision, monto_fijo, activo } = req.body;

    // Empresa del usuario autenticado vía JWT
    const empresaId = req.user.empresa_id;

    // ------------------------------------------------------
    // 1) Verificar que el método existe y pertenece a su empresa
    // ------------------------------------------------------
    const { data: existing, error: findError } = await supabase
      .from("metodos_pago")
      .select("*")
      .eq("id", id)
      .eq("empresa_id", empresaId)
      .maybeSingle();

    if (findError) {
      console.error("❌ Error buscando método:", findError.message);
      return res.status(500).json({ mensaje: "Error interno." });
    }

    if (!existing) {
      return res.status(404).json({
        mensaje: "Método no encontrado o no pertenece a su empresa."
      });
    }

    // ------------------------------------------------------
    // 2) Preparar actualización
    // Solo se actualizan campos permitidos
    // ------------------------------------------------------
    const updateData = {};

    if (nombre !== undefined) updateData.nombre = nombre;
    if (tipo !== undefined) updateData.tipo = tipo;
    if (porcentaje_comision !== undefined) updateData.porcentaje_comision = porcentaje_comision;
    if (monto_fijo !== undefined) updateData.monto_fijo = monto_fijo;
    if (activo !== undefined) updateData.activo = activo;

    // ------------------------------------------------------
    // 3) Ejecutar actualización
    // ------------------------------------------------------
    const { data, error } = await supabase
      .from("metodos_pago")
      .update(updateData)
      .eq("id", id)
      .eq("empresa_id", empresaId)
      .select();

    if (error) {
      console.error("❌ Error actualizando método de pago:", error.message);
      return res.status(500).json({ mensaje: "Error actualizando método de pago." });
    }

    return res.status(200).json({
      mensaje: "Método de pago actualizado con éxito.",
      data
    });

  } catch (err) {
    console.error("❌ ERROR UPDATE:", err.message);
    return res.status(500).json({
      mensaje: "Error interno.",
      error: err.message
    });
  }
}

// ======================================================================
//  DELETE → Eliminar un método de pago de la empresa del usuario
// ======================================================================
export async function deletePaymentMethod(req, res) {
  try {
    const { id } = req.params;
    const empresaId = req.user.empresa_id;

    // 1) Verificar que el método exista y sea de su empresa
    const { data: existing, error: findError } = await supabase
      .from("metodos_pago")
      .select("*")
      .eq("id", id)
      .eq("empresa_id", empresaId)
      .maybeSingle();

    if (findError) {
      console.error("❌ Error buscando método:", findError.message);
      return res.status(500).json({ mensaje: "Error interno." });
    }

    if (!existing) {
      return res.status(404).json({
        mensaje: "Método no encontrado o no pertenece a esta empresa."
      });
    }

    // 2) Eliminar
    const { error } = await supabase
      .from("metodos_pago")
      .delete()
      .eq("id", id)
      .eq("empresa_id", empresaId);

    if (error) {
      console.error("❌ Error al eliminar método:", error.message);
      return res.status(500).json({
        mensaje: "Error eliminando método de pago."
      });
    }

    return res.status(200).json({
      mensaje: "Método de pago eliminado con éxito.",
      id_eliminado: id
    });

  } catch (err) {
    console.error("❌ ERROR DELETE:", err.message);
    return res.status(500).json({
      mensaje: "Error interno.",
      error: err.message
    });
  }
}
