// src/components/Sidebar.jsx

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  Package,
  Users,
  Menu,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Ventas", icon: ShoppingCart },
    { label: "Inventario", icon: Package },
    { label: "Productos", icon: Layers },
    { label: "Clientes", icon: Users },
  ];

  return (
    <aside
      className={`
        h-screen
        bg-gray-900 text-gray-200
        flex flex-col
        border-r border-gray-800
        transition-all duration-300 shadow-xl
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* === HEADER === */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <h1 className="text-xl font-bold tracking-wide text-white">
            ECOMGEST
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* === MENU === */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* === FOOTER === */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        {!collapsed && (
          <p className="text-[11px] leading-tight opacity-70">
            © {new Date().getFullYear()} ECOMGEST
            <br />
            Sistema de gestión empresarial
          </p>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({ label, icon: Icon, collapsed }) {
  return (
    <div
      className={`
        group 
        flex items-center gap-3
        px-3 py-2 rounded-lg cursor-pointer
        text-gray-300 transition
        hover:bg-gray-800 hover:text-white
      `}
      title={collapsed ? label : ""}
    >
      <Icon size={20} className="min-w-[20px]" />
      {!collapsed && (
        <span className="text-sm font-medium tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
}
