// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import KPIBox from "../components/KPIBox";
import Skeleton from "../components/ui/Skeleton";

export default function Dashboard({ user, onLogout }) {
  // Estados de carga
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Loading del botón SALIR
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Simulación de carga suave para una mejor UX
  useEffect(() => {
    const t1 = setTimeout(() => setLoadingKPIs(false), 900);
    const t2 = setTimeout(() => setLoadingModules(false), 1100);
    const t3 = setTimeout(() => setLoadingActivity(false), 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Datos del usuario
  const empresaNombre = user?.company?.nombre || "Empresa";
  const rolNombre = user?.role?.nombre || "—";
  const usuarioNombre = user?.correo || "Usuario";

  // Manejo del logout premium 🌟
  function handleLogoutClick() {
    if (logoutLoading) return;
    setLogoutLoading(true);

    // Mini delay para una animación elegante
    setTimeout(() => {
      onLogout();
    }, 250);
  }

  // KPIs de demo
  const kpis = [
    {
      id: 1,
      title: "Ventas de hoy",
      value: "$ 0",
      subtitle: "Integrar con módulo de ventas",
      positive: true,
      trend: [{ value: 2 }, { value: 4 }, { value: 6 }, { value: 7 }],
    },
    {
      id: 2,
      title: "Órdenes pendientes",
      value: "0",
      subtitle: "Pedidos sin despachar",
      positive: false,
      trend: [{ value: 6 }, { value: 5 }, { value: 3 }, { value: 2 }],
    },
    {
      id: 3,
      title: "Stock bajo",
      value: "0",
      subtitle: "SKUs para reponer",
      positive: false,
      trend: [{ value: 4 }, { value: 4 }, { value: 3 }],
    },
    {
      id: 4,
      title: "Clientes activos",
      value: "0",
      subtitle: "Últimos 30 días",
      positive: true,
      trend: [{ value: 5 }, { value: 7 }, { value: 11 }],
    },
  ];

  // Módulos demo
  const modules = [
    { id: 1, name: "Ventas", description: "Órdenes, facturación, medios de pago" },
    { id: 2, name: "Inventario", description: "Stock, movimientos, alertas de reposición" },
    { id: 3, name: "Clientes", description: "CRM, contactos, historial" },
    { id: 4, name: "Proveedores", description: "Compras, cuentas corrientes" },
    { id: 5, name: "Finanzas", description: "Cobros, pagos, caja" },
    { id: 6, name: "Configuración", description: "Usuarios, roles y permisos" },
  ];

  return (
    <MainLayout onLogout={onLogout}>
      <div className="animate-fade">

        {/* =====================================================
            HEADER PREMIUM
        ===================================================== */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Panel principal
              </p>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {empresaNombre}
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Rol: <span className="font-semibold">{rolNombre}</span> · Usuario:{" "}
                <span className="font-semibold">{usuarioNombre}</span>
              </p>
            </div>

            {/* BOTONES */}
            <div className="flex gap-3">
              <button className="px-4 py-2 text-xs rounded-xl bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm hover:shadow-md transition">
                Ver actividad
              </button>
            </div>

          </div>
        </section>

        {/* =====================================================
            KPIs
        ===================================================== */}
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loadingKPIs
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur shadow-sm p-4"
                >
                  <Skeleton className="w-24 h-4 mb-3" />
                  <Skeleton className="w-20 h-7 mb-2" />
                  <Skeleton className="w-full h-6" />
                </div>
              ))
            : kpis.map((k) => <KPIBox key={k.id} {...k} />)}
        </section>

        {/* =====================================================
            GRID PRINCIPAL
        ===================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Actividad reciente */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur shadow-sm p-5">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
                Actividad reciente
              </h2>
              <span className="text-xs text-slate-400">
                Próximamente conectado a la API
              </span>
            </div>

            {loadingActivity ? (
              <div className="space-y-3">
                <Skeleton width="90%" height="20px" />
                <Skeleton width="80%" height="20px" />
                <Skeleton width="70%" height="20px" />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                Aquí aparecerán ventas recientes, movimientos de stock,
                reclamos abiertos, y tareas internas.
              </div>
            )}
          </div>

          {/* Módulos */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
              Módulos del sistema
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Accesos directos a cada módulo central de ECOMGEST.
            </p>

            <ul className="space-y-2">
              {loadingModules
                ? [...Array(6)].map((_, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"
                    >
                      <Skeleton width="40%" height="14px" className="mb-2" />
                      <Skeleton width="70%" height="12px" />
                    </li>
                  ))
                : modules.map((m) => (
                    <li
                      key={m.id}
                      className="
                        rounded-xl border border-slate-200 dark:border-slate-700 
                        p-3 
                        hover:bg-slate-50/70 dark:hover:bg-slate-800/50 
                        cursor-pointer transition
                      "
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {m.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {m.description}
                      </p>
                    </li>
                  ))}
            </ul>
          </div>

        </section>

      </div>
    </MainLayout>
  );
}
