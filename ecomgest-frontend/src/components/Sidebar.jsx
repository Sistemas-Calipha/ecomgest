// src/components/Sidebar.jsx

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const [open, setOpen] = useState({
    ventas: false,
    inventario: false,
    clientes: false,
    finanzas: false,
    configuracion: false,
  });

  function toggle(menu) {
    setOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      to: "/",
    },
    {
      id: "ventas",
      label: "Ventas",
      icon: <ShoppingCart size={18} />,
      children: [
        { label: "Órdenes", to: "/ventas/ordenes" },
        { label: "Facturación", to: "/ventas/facturacion" },
        { label: "Métodos de pago", to: "/ventas/metodos-pago" },
      ],
    },
    {
      id: "inventario",
      label: "Inventario",
      icon: <Package size={18} />,
      children: [
        { label: "Productos", to: "/inventario/productos" },
        { label: "Movimientos", to: "/inventario/movimientos" },
        { label: "Alertas", to: "/inventario/alertas" },
        { label: "Proveedores", to: "/inventario/proveedores" },
      ],
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: <Users size={18} />,
      children: [
        { label: "CRM", to: "/clientes/crm" },
        { label: "Historial", to: "/clientes/historial" },
        { label: "Segmentos", to: "/clientes/segmentos" },
      ],
    },
    {
      id: "finanzas",
      label: "Finanzas",
      icon: <DollarSign size={18} />,
      children: [
        { label: "Caja", to: "/finanzas/caja" },
        { label: "Pagos", to: "/finanzas/pagos" },
        { label: "Ingresos", to: "/finanzas/ingresos" },
        { label: "Cierres", to: "/finanzas/cierres" },
      ],
    },
    {
      id: "configuracion",
      label: "Configuración",
      icon: <Settings size={18} />,
      children: [
        { label: "Usuarios", to: "/configuracion/usuarios" },
        { label: "Roles", to: "/configuracion/roles" },
        { label: "Permisos", to: "/configuracion/permisos" },
      ],
    },
  ];

  return (
    <aside
      className="
        w-60 h-screen bg-slate-900 text-slate-200
        flex flex-col justify-between border-r border-slate-800
      "
    >
      {/* LOGO */}
      <div className="px-6 py-4 text-lg font-bold tracking-wide">
        ECOMGEST
      </div>

      {/* MENÚ */}
      <nav className="flex-1 px-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isOpen = open[item.id];
          const hasChildren = !!item.children;

          return (
            <div key={item.id} className="mb-1">
              <button
                onClick={() => (hasChildren ? toggle(item.id) : null)}
                className="
                  w-full flex items-center justify-between
                  px-3 py-2 rounded-lg
                  hover:bg-slate-800 transition-colors
                  text-left
                "
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!hasChildren ? (
                    <Link to={item.to}>{item.label}</Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>

                {/* Chevron minimalista */}
                {hasChildren && (
                  <ChevronDown
                    size={17}
                    className={`
                      transition-transform duration-200
                      ${isOpen ? "rotate-180" : "rotate-0"}
                      text-slate-400 group-hover:text-white
                    `}
                  />
                )}
              </button>

              {/* Submenú */}
              {hasChildren && isOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l border-slate-700 pl-3">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      className={`
                        block text-sm py-1 rounded
                        hover:text-white hover:underline
                        ${
                          location.pathname === sub.to
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        }
                      `}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="px-4 py-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="
            flex items-center gap-2 px-3 py-2 w-full
            text-red-400 hover:text-red-200
            hover:bg-slate-800 rounded-lg transition
          "
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
