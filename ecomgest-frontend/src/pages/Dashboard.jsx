// src/pages/Dashboard.jsx
import MainLayout from "../layout/MainLayout";
import KPIBox from "../components/KPIBox";

export default function Dashboard({ user, onLogout }) {
  // Datos básicos del usuario / empresa (vienen de App.jsx)
  const empresaNombre = user?.empresa_nombre || "Empresa";
  const rolNombre = user?.rol_nombre || "—";
  const usuarioNombre = user?.nombre_completo || user?.correo || "Usuario";

  // Por ahora son datos mock. Luego los conectamos a la API.
  const kpis = [
    {
      id: 1,
      title: "Ventas de hoy",
      value: "$ 0",
      subtitle: "Integrar con módulo de ventas",
    },
    {
      id: 2,
      title: "Órdenes pendientes",
      value: "0",
      subtitle: "Pedidos sin despachar",
    },
    {
      id: 3,
      title: "Stock bajo",
      value: "0",
      subtitle: "SKUs para reponer",
    },
    {
      id: 4,
      title: "Clientes activos",
      value: "0",
      subtitle: "Últimos 30 días",
    },
  ];

  const modules = [
    { id: 1, name: "Ventas", description: "Órdenes, facturación, medios de pago" },
    { id: 2, name: "Inventario", description: "Stock, movimientos, alertas de reposición" },
    { id: 3, name: "Clientes", description: "CRM, contactos, historial de compras" },
    { id: 4, name: "Proveedores", description: "Compras, cuentas corrientes, reposición" },
    { id: 5, name: "Finanzas", description: "Cobros, pagos, caja, reportes" },
    { id: 6, name: "Configuración", description: "Usuarios, roles, empresas, permisos" },
  ];

  return (
    <MainLayout onLogout={onLogout}>
      {/* HEADER DEL DASHBOARD */}
      <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-purple-600 uppercase">
            Panel principal
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {empresaNombre}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Rol: <span className="font-semibold">{rolNombre}</span> · Usuario:{" "}
            <span className="font-semibold">{usuarioNombre}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 text-xs rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">
            Ver actividad
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </section>

      {/* GRID DE KPIs */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPIBox
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
          />
        ))}
      </section>

      {/* CONTENIDO PRINCIPAL: 2 COLUMNAS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Últimos movimientos / actividad */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">
              Actividad reciente
            </h2>
            <span className="text-xs text-gray-400">
              Próximamente conectado a la API
            </span>
          </div>

          <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500">
            Aquí vamos a mostrar:
            <br />
            <span className="font-semibold">
              últimos movimientos de stock, ventas recientes, reclamos y tareas.
            </span>
            <br />
            Cuando tengamos los módulos listos, este bloque se llena solo.
          </div>
        </div>

        {/* Módulos del sistema */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Módulos del sistema
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Este menú te va a llevar a cada módulo de ECOMGEST a medida que los
            vayamos activando.
          </p>

          <ul className="space-y-2">
            {modules.map((m) => (
              <li
                key={m.id}
                className="border border-gray-100 rounded-xl px-3 py-2 hover:bg-gray-50 cursor-pointer transition"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {m.name}
                </p>
                <p className="text-xs text-gray-500">
                  {m.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MainLayout>
  );
}
