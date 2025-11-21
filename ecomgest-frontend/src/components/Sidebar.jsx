import { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`
        h-screen 
        bg-gray-900 
        text-white 
        flex flex-col 
        transition-all 
        duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h2 className="text-xl font-bold">ECOMGEST</h2>}

        <button
          className="text-white hover:text-gray-300"
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
        hover:bg-gray-700 
        p-2 
        rounded 
        cursor-pointer
        transition
      "
      title={collapsed ? label : ""}
    >
      {!collapsed && <span>{label}</span>}
      {collapsed && <div className="w-full text-center">{label[0]}</div>}
    </div>
  );
}
