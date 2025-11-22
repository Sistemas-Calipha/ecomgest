// src/components/Sidebar.jsx

import { useState, useEffect } from "react";
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

  // Menú principal
  const menuItems = [
    { label: "Dashboard", icon: <Home size={18} /> },
    { label: "Ventas", icon: <ShoppingCart size={18} /> },
    { label: "Productos", icon: <Package size={18} /> },
    { label: "Stock", icon: <Boxes size={18} /> },
    { label: "Clientes", icon: <Users size={18} /> },
  ];

  const username = user?.correo || "Usuario";

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
          <h2 className="text-xl font-semibold tracking-tight text-white dark:text-gray-100">
            {loading ? <Skeleton className="h-5 w-24" /> : "ECOMGEST"}
          </h2>
        )}

        <button
          className="text-gray-300 hover:text-white dark:hover:text-gray-200 transition"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MENU PRINCIPAL */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {loading
          ? [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded bg-gray-800/40"
              >
                <Skeleton className="h-4 w-4" />
                {!collapsed && <Skeleton className="h-4 w-24" />}
              </div>
            ))
          : menuItems.map((item) => (
              <SidebarItem
                key={item.label}
                label={item.label}
                icon={item.icon}
                collapsed={collapsed}
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
          {!collapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ label, icon, collapsed }) {
  return (
    <div
      className="
        flex items-center gap-3
        hover:bg-gray-800 dark:hover:bg-gray-900
        p-2 rounded cursor-pointer transition
        text-gray-300 dark:text-gray-300
      "
      title={collapsed ? label : ""}
    >
      {icon}
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
