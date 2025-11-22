// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import KPIBox from "../components/KPIBox";
import Skeleton from "../components/ui/Skeleton";

// Recharts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// =========================
// Datos de ejemplo
// =========================

const ventasDiariasData = [
  { dia: "Lun", ventas: 12 },
  { dia: "Mar", ventas: 18 },
  { dia: "Mié", ventas: 9 },
  { dia: "Jue", ventas: 22 },
  { dia: "Vie", ventas: 17 },
  { dia: "Sáb", ventas: 14 },
  { dia: "Dom", ventas: 6 },
];

const ingresosVsGastosData = [
  { mes: "Ene", ingresos: 12000, gastos: 8000 },
  { mes: "Feb", ingresos: 13500, gastos: 9000 },
  { mes: "Mar", ingresos: 15000, gastos: 9500 },
  { mes: "Abr", ingresos: 14200, gastos: 10000 },
];

const stockPorCategoriaData = [
  { nombre: "Moldes", valor: 35 },
  { nombre: "Electrónica", valor: 25 },
  { nombre: "Hogar", valor: 20 },
  { nombre: "Otros", valor: 20 },
];

const clientesNuevosData = [
  { mes: "Ene", clientes: 18 },
  { mes: "Feb", clientes: 22 },
  { mes: "Mar", clientes: 27 },
  { mes: "Abr", clientes: 24 },
];

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#f97316"];

// KPIs demo
const KPIS_DEMO = [
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

// =========================
// Componente principal
// =========================

export default function Dashboard({ user }) {
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingWidgets, setLoadingWidgets] = useState(true);

  // Orden inicial de widgets (modular arrastrable)
  const [widgetsOrder, setWidgetsOrder] = useState([
    "kpis",
    "ventas",
    "ingresosGastos",
    "stock",
    "clientes",
    "actividad",
  ]);

  // Sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Simular carga
  useEffect(() => {
    const t1 = setTimeout(() => setLoadingKPIs(false), 800);
    const t2 = setTimeout(() => setLoadingWidgets(false), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const empresaNombre = user?.company?.nombre || "Empresa";
  const rolNombre = user?.role?.nombre || "—";
  const usuarioNombre = user?.correo || "Usuario";

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setWidgetsOrder((prev) => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  return (
    <div className="animate-fade space-y-8">
      {/* HEADER */}
      <section className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
          Panel principal
        </p>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {empresaNombre}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Rol: <span className="font-semibold">{rolNombre}</span> · Usuario:{" "}
          <span className="font-semibold">{usuarioNombre}</span>
        </p>
      </section>

      {/* CONTENEDOR DRAG & DROP */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgetsOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {widgetsOrder.map((id) => (
              <SortableWidget key={id} id={id}>
                {renderWidgetContent(id, { loadingKPIs, loadingWidgets })}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// =========================
// Widget arrastrable
// =========================

function SortableWidget({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        rounded-2xl border border-slate-200 dark:border-slate-800 
        bg-white/70 dark:bg-slate-900/60 backdrop-blur 
        shadow-sm p-5 cursor-move
        transition-shadow
        ${isDragging ? "shadow-xl ring-2 ring-purple-500/40" : ""}
      `}
    >
      {children}
      <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-400 text-right">
        Arrastra para reorganizar
      </p>
    </section>
  );
}

// =========================
// Contenido de cada widget
// =========================

function renderWidgetContent(id, { loadingKPIs, loadingWidgets }) {
  switch (id) {
    case "kpis":
      return <WidgetKPIs loading={loadingKPIs} />;

    case "ventas":
      return <WidgetVentas loading={loadingWidgets} />;

    case "ingresosGastos":
      return <WidgetIngresosGastos loading={loadingWidgets} />;

    case "stock":
      return <WidgetStock loading={loadingWidgets} />;

    case "clientes":
      return <WidgetClientes loading={loadingWidgets} />;

    case "actividad":
    default:
      return <WidgetActividad loading={loadingWidgets} />;
  }
}

// =========================
// Widgets individuales
// =========================

function WidgetKPIs({ loading }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
          Indicadores clave
        </h2>
        <span className="text-xs text-slate-400">Demo – pronto en tiempo real</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 p-4"
              >
                <Skeleton className="w-20 h-4 mb-2" />
                <Skeleton className="w-24 h-7 mb-2" />
                <Skeleton className="w-full h-5" />
              </div>
            ))
          : KPIS_DEMO.map((k) => <KPIBox key={k.id} {...k} />)}
      </div>
    </div>
  );
}

function WidgetVentas({ loading }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
        Ventas últimos 7 días
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Gráfico de ejemplo. Luego lo conectamos a tu API de ventas.
      </p>

      <div className="h-56">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ventasDiariasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b33" />
              <XAxis dataKey="dia" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: "0.5rem",
                  border: "1px solid #1f2937",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function WidgetIngresosGastos({ loading }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
        Ingresos vs gastos
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Ideal para ver rápido la salud financiera.
      </p>

      <div className="h-56">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ingresosVsGastosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b33" />
              <XAxis dataKey="mes" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: "0.5rem",
                  border: "1px solid #1f2937",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
              <Bar dataKey="ingresos" stackId="a" fill="#3b82f6" />
              <Bar dataKey="gastos" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function WidgetStock({ loading }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
        Stock por categoría
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Cuánto representa cada grupo de productos.
      </p>

      <div className="h-56 flex items-center justify-center">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockPorCategoriaData}
                dataKey="valor"
                nameKey="nombre"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
              >
                {stockPorCategoriaData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: "0.5rem",
                  border: "1px solid #1f2937",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function WidgetClientes({ loading }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
        Clientes nuevos por mes
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Cuando conectemos el módulo de clientes, esto se vuelve 100% real.
      </p>

      <div className="h-56">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientesNuevosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b33" />
              <XAxis dataKey="mes" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: "0.5rem",
                  border: "1px solid #1f2937",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
              <Bar dataKey="clientes" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function WidgetActividad({ loading }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
        Actividad reciente
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Aquí mostraremos ventas, movimientos de stock, reclamos y tareas.
      </p>

      {loading ? (
        <div className="space-y-3">
          <Skeleton width="90%" height="18px" />
          <Skeleton width="80%" height="18px" />
          <Skeleton width="70%" height="18px" />
        </div>
      ) : (
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>• Venta registrada en MercadoLibre – #MLA00123</li>
          <li>• Stock ajustado para SKU AFILADOR-SHARPENER</li>
          <li>• Nuevo cliente agregado desde Tienda Nube</li>
          <li>• Reclamo abierto: “Demora en la entrega”</li>
        </ul>
      )}
    </div>
  );
}
