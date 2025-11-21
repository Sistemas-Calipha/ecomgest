import supabase from "../config/supabase.js";

export async function getKPISummary(req, res) {
  try {
    const company_id = req.company_id;

    // === SALES OF THE DAY ===
    const today = new Date().toISOString().slice(0, 10);

    const salesToday = await supabase
      .from("ventas")
      .select("total")
      .eq("empresa_id", company_id)
      .eq("fecha", today);

    const totalToday =
      salesToday.data?.reduce((acc, sale) => acc + sale.total, 0) || 0;

    // === SALES OF THE MONTH ===
    const monthStart = new Date();
    monthStart.setDate(1);

    const startISO = monthStart.toISOString().slice(0, 10);

    const salesMonth = await supabase
      .from("ventas")
      .select("total")
      .eq("empresa_id", company_id)
      .gte("fecha", startISO);

    const totalMonth =
      salesMonth.data?.reduce((acc, sale) => acc + sale.total, 0) || 0;

    // === NEW CUSTOMERS ===
    const newCustomers = await supabase
      .from("clientes")
      .select("id")
      .eq("empresa_id", company_id)
      .gte("fecha_registro", startISO);

    const totalNewCustomers = newCustomers.data?.length || 0;

    // === PRODUCTS WITHOUT STOCK ===
    const noStock = await supabase
      .from("productos")
      .select("id, stock")
      .eq("empresa_id", company_id)
      .lte("stock", 0);

    const totalNoStock = noStock.data?.length || 0;

    // === RESPONSE ===
    return res.json({
      salesToday: totalToday,
      salesMonth: totalMonth,
      newCustomers: totalNewCustomers,
      noStock: totalNoStock,
    });
  } catch (err) {
    console.error("KPI SUMMARY ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
