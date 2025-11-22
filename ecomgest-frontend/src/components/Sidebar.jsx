// src/components/Sidebar.jsx

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  Home,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  LogOut
} from "lucide-react";
import Skeleton from "../components/ui/Skeleton";

export default function Sidebar({ onLogout, user }) {
  const [collapsed, setCollapsed] = useState(false);

  // Simulación de carga
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const username = user?.correo || "Usuario";

  // ================================
  //   ESTRUCTURA DEL MENÚ
  // ================================
  const menu = [
    {
      title: "Dashboard",
      icon: <Home size={18} />,
      to: "/",
    },

    {
      title: "Ventas",
      icon: <ShoppingCart size={18} />,
      children: [
        { label: "Inicio", to: "/ventas" },
        { label: "Órdenes", to: "/ventas/ordenes" },
        { label: "Facturación", to: "/ventas/facturacion" },
        { label: "Métodos de pago", to: "/ventas/metodos-pago" },
      ],
    },

    {
      title: "Inventario",
      icon: <Package size={18} />,
      children: [
        { label: "Inicio", to: "/inventario" },
        { label: "Productos", to: "/inventario/productos" },
        { label: "Movimientos", to: "/inventario/movimientos" },
        { label: "Alertas", to: "/inventario/alertas" },
        { label: "Proveedores", to: "/inventario/proveedores" },
      ],
    },

    {
      title: "Clientes",
      icon: <Users size={18} />,
      children: [
        { label: "Inicio", to: "/clientes" },
        { label: "CRM", to: "/clientes/crm" },
        { label: "Historial", to: "/clientes/historial" },
        { label: "Segmentos", to: "/clientes/segmentos" },
      ],
    },

    {
      title: "Finanzas",
      icon: <Boxes size={18} />,
      children: [
        { label: "Inicio", to: "/finanzas" },
        { label: "Caja", to: "/finanzas/caja" },
        { label: "Pagos", to: "/finanzas/pagos" },
        { label: "Ingresos", to: "/finanzas/ingresos" },
        { label: "Cierres", to: "/finanzas/cierres" },
      ],
    },

    {
      title: "Configuración",
      icon: <Users size={18} />,
      children: [
        { label: "Inicio", to: "/configuracion" },
        { label: "Usuarios", to: "/configuracion/usuarios" },
        { label: "Roles", to: "/configuracion/roles" },
        { label: "Permisos", to: "/configuracion/permisos" },
      ],
    },
  ];

  // Estado de submenús abiertos
  const [openMenus, setOpenMenus] = useState({});

  function toggleMenu(title) {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  return (
    <div
      className={`
        h-screen flex flex-col transition-all duration-300
        border-r border-gray-200 dark:border-gray-800
        bg-gray-900 dark:bg-black
        text-gray-200 dark:text-gray-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-700">
        {!collapsed && (
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {loading ? <Skeleton className="h-5 w-24" /> : "ECOMGEST"}
          </h2>
        )}

        <button
          className="text-gray-300 hover:text-white transition"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* CONTENEDOR DEL MENÚ */}
      <nav className="flex-1 overflow-y-auto p-3 custom-scroll">

        {loading
          ? [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded bg-gray-800/40 mb-2"
              >
                <Skeleton className="h-4 w-4" />
                {!collapsed && <Skeleton className="h-4 w-24" />}
              </div>
            ))
          : menu.map((item) => (
              <SidebarCategory
                key={item.title}
                item={item}
                collapsed={collapsed}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
              />
            ))}
      </nav>

      {/* FOOTER → usuario + logout */}
      <div className="p-3 border-t border-gray-800 dark:border-gray-700">
        {!collapsed && (
          <div className="mb-3 text-xs text-gray-400">
            <span className="font-medium text-gray-200">{username}</span>
          </div>
        )}

        <button
          onClick={onLogout}
          className="
            w-full flex items-center gap-3
            p-2 rounded 
            hover:bg-red-600/20 text-red-400 
            dark:hover:bg-red-700/20
            transition cursor-pointer
          "
        >
          <LogOut size={18} />
          {!collapsed && (
            <span className="text-sm font-medium">Cerrar sesión</span>
          )}
        </button>
      </div>
    </div>
  );
}

// ===============================
// COMPONENTE DE CATEGORÍA
// ===============================
function SidebarCategory({ item, collapsed, openMenus, toggleMenu }) {
  const hasChildren = !!item.children;
  const isOpen = openMenus[item.title];

  // Categoria sin submódulos (Dashboard)
  if (!hasChildren) {
    return (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `
        flex items-center gap-3 p-2 rounded mb-1 transition
        ${isActive
          ? "bg-purple-600 text-white"
          : "text-gray-300 hover:bg-gray-800"}
      `
        }
        title={collapsed ? item.title : ""}
      >
        {item.icon}
        {!collapsed && (
          <span className="text-sm font-medium">{item.title}</span>
        )}
      </NavLink>
    );
  }

  // Categoría con submódulos
  return (
    <div className="mb-1">
      {/* Título de categoría */}
      <div
        onClick={() => toggleMenu(item.title)}
        className="
          flex items-center gap-3 p-2 rounded cursor-pointer
          hover:bg-gray-800 transition
        "
        title={collapsed ? item.title : ""}
      >
        {item.icon}

        {!collapsed && (
          <span className="text-sm font-semibold">{item.title}</span>
        )}

        {/* Flecha */}
        {!collapsed && (
          <span
            className={`ml-auto text-xs transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
        )}
      </div>

      {/* Submenú */}
      {isOpen && !collapsed && (
        <div className="ml-6 mt-1 flex flex-col gap-1">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `
                text-sm rounded p-2 transition
                ${isActive
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"}
              `
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
