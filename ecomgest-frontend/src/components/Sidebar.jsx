// src/components/Sidebar.jsx

import { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`
        h-screen flex flex-col transition-all duration-300
        border-r border-gray-200 dark:border-gray-700
        bg-gray-900 dark:bg-black
        text-gray-200 dark:text-gray-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-700">
        {!collapsed && (
          <h2 className="text-xl font-bold text-white dark:text-gray-100">
            ECOMGEST
          </h2>
        )}

        <button
          className="text-gray-300 hover:text-white dark:hover:text-gray-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1 p-3">
        <SidebarItem collapsed={collapsed} label="Dashboard" />
        <SidebarItem collapsed={collapsed} label="Ventas" />
        <SidebarItem collapsed={collapsed} label="Productos" />
        <SidebarItem collapsed={collapsed} label="Stock" />
        <SidebarItem collapsed={collapsed} label="Clientes" />
      </nav>
    </div>
  );
}

function SidebarItem({ label, collapsed }) {
  return (
    <div
      className="
        hover:bg-gray-800 dark:hover:bg-gray-900
        p-2 rounded cursor-pointer transition
        text-gray-300 dark:text-gray-300
      "
      title={collapsed ? label : ""}
    >
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <div className="w-full text-center font-semibold text-gray-300 dark:text-gray-400">
          {label[0]}
        </div>
      )}
    </div>
  );
}
