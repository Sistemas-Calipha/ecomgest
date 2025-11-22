// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import KPIBox from "../components/KPIBox";
import Skeleton from "../components/ui/Skeleton";

export default function Dashboard({ user, onLogout }) {
  // Estados de carga para cada sección
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Simulación de carga real (cuando conectemos API, esto se reemplaza)
  useEffect(() => {
    const t1 = setTimeout(() => setLoadingKPIs(false), 1000);
    const t2 = setTimeout(() => setLoadingModules(false), 1200);
    const t3 = setTimeout(() => setLoadingActivity(false), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Datos del usuario
  const empresaNombre = user?.empresa_nombre || "Empresa";
  const rolNombre = user?.rol_nombre || "—";
  const usuarioNombre = user?.nombre_completo || user?.correo || "Usuario";

  // Datos de KPIs con micro-gráfica
  const kpis = [
    {
      id: 1,
      title: "Ventas de hoy",
      value: "$ 0",
      subtitle: "Integrar con módulo de ventas",
      positive: true,
      trend: [
        { value: 2 },
        { value: 4 },
        { value: 3 },
        { value: 6 },
        { value: 7 },
        { value: 9 },
      ],
    },
    {
      id: 2,
      title: "Órdenes pendientes",
      value: "0",
      subtitle: "Pedidos sin despachar",
      positive: false,
      trend: [
        { value: 7 },
        { value: 6 },
        { value: 5 },
        { value: 3 },
        { value: 2 },
      ],
    },
    {
      id: 3,
      title: "Stock bajo",
      value: "0",
      subtitle: "SKUs para reponer",
      positive: false,
      trend: [
        { value: 3 },
        { value: 4 },
        { value: 4 },
        { value: 3 },
        { value: 2 },
      ],
    },
    {
      id: 4,
      title: "Clientes activos",
      value: "0",
      subtitle: "Últimos 30 días",
      positive: true,
      trend: [
        { value: 5 },
        { value: 7 },
        { value: 6 },
        { value: 9 },
        { value: 11 },
      ],
    },
  ];

  // Módulos del sistema
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
      
      {/* ========== HEADER ========== */}
      <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-purple-600 uppercase">Panel principal</p>
          <h1 className="text-2xl font-bold text-gray-900">{empresaNombre}</h1>

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

      
      {/* ========== KPIs PREMIUM ========== */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingKPIs
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <Skeleton className="w-24 h-4 mb-3" />
                <Skeleton className="w-16 h-7 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
            ))
          : kpis.map((kpi) => (
              <KPIBox
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                positive={kpi.positive}
                trend={kpi.trend}
                loading={false}
              />
            ))}
      </section>


      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Actividad Reciente --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Actividad reciente</h2>
            <span className="text-xs text-gray-400">Próximamente conectado a la API</span>
          </div>

          {loadingActivity ? (
            <div className="space-y-3">
              <Skeleton width="90%" height="20px" />
              <Skeleton width="80%" height="20px" />
              <Skeleton width="70%" height="20px" />
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500">
              Aquí vamos a mostrar:
              <br />
              <span className="font-semibold">
                últimos movimientos de stock, ventas recientes, reclamos y tareas.
              </span>
              <br />
              Cuando tengamos los módulos listos, este bloque se llena solo.
            </div>
          )}
        </div>


        {/* --- Módulos del sistema --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Módulos del sistema</h2>

          <p className="text-xs text-gray-500 mb-3">
            Este menú te va a llevar a cada módulo de ECOMGEST a medida que los vayamos activando.
          </p>

          <ul className="space-y-2">
            {loadingModules
              ? [...Array(6)].map((_, i) => (
                  <li key={i} className="border border-gray-100 rounded-xl px-3 py-2">
                    <Skeleton width="40%" height="14px" className="mb-2" />
                    <Skeleton width="70%" height="12px" />
                  </li>
                ))
              : modules.map((m) => (
                  <li
                    key={m.id}
                    className="border border-gray-100 rounded-xl px-3 py-2 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.description}</p>
                  </li>
                ))}
          </ul>
        </div>
      </section>

    </MainLayout>
  );
}
