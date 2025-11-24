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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, user }) {
  const location = useLocation();

  const [open, setOpen] = useState({
    sales: false,
    inventory: false,
    customers: false,
    finance: false,
    settings: false
  });

  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);

  const isCollapsed = collapsed && !hovering;

  function toggleSection(menu) {
    setOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  }

  const username = user?.correo || "User";

  // ========================================================
  // MENÚ PRINCIPAL
  // ========================================================

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      to: "/"
    },

    // COMPANIES (nuevo módulo)
    {
      id: "companies",
      label: "Companies",
      icon: <Building2 size={18} />,
      to: "/companies"
    },

    // SALES
    {
      id: "sales",
      label: "Sales",
      icon: <ShoppingCart size={18} />,
      children: [
        { label: "Orders", to: "/sales/orders" },
        { label: "Billing", to: "/sales/billing" },
        { label: "Payment Methods", to: "/sales/payment-methods" }
      ]
    },

    // INVENTORY
    {
      id: "inventory",
      label: "Inventory",
      icon: <Package size={18} />,
      children: [
        { label: "Products", to: "/inventory/products" },
        { label: "Stock Movements", to: "/inventory/movements" },
        { label: "Alerts", to: "/inventory/alerts" },
        { label: "Suppliers", to: "/inventory/suppliers" }
      ]
    },

    // CUSTOMERS
    {
      id: "customers",
      label: "Customers",
      icon: <Users size={18} />,
      children: [
        { label: "CRM", to: "/customers/crm" },
        { label: "History", to: "/customers/history" },
        { label: "Segments", to: "/customers/segments" }
      ]
    },

    // FINANCE
    {
      id: "finance",
      label: "Finance",
      icon: <DollarSign size={18} />,
      children: [
        { label: "Cash", to: "/finance/cash" },
        { label: "Payments", to: "/finance/payments" },
        { label: "Income", to: "/finance/income" },
        { label: "Closings", to: "/finance/closings" }
      ]
    },

    // SETTINGS
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={18} />,
      children: [
        { label: "Users", to: "/settings/users" },
        { label: "Roles", to: "/settings/roles" },
        { label: "Permissions", to: "/settings/permissions" },
        { label: "Dashboard", to: "/settings/dashboard" }
      ]
    }
  ];

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <aside
      className={`
        h-screen
        bg-slate-950/90 dark:bg-slate-950/95
        text-slate-100
        border-r border-slate-800/70
        backdrop-blur-xl
        flex flex-col
        transition-[width] duration-300
        ${isCollapsed ? "w-16" : "w-64"}
      `}
      onMouseEnter={() => collapsed && setHovering(true)}
      onMouseLeave={() => collapsed && setHovering(false)}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <div
            className="
              flex items-center justify-center rounded-xl
              bg-slate-900/80 border border-slate-700/70
              w-8 h-8 text-xs font-bold tracking-tight
            "
          >
            EG
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide">ECOMGEST</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Admin Panel
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="
            flex items-center justify-center
            w-8 h-8 rounded-xl
            bg-slate-900/70 hover:bg-slate-800
            border border-slate-700/70
            text-slate-300 hover:text-white
            transition-colors
          "
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const hasChildren = !!item.children;
          const isOpen = open[item.id];

          const isActive =
            item.to && location.pathname === item.to ||
            (!item.to && location.pathname.startsWith(`/${item.id}`));

          return (
            <div key={item.id} className="group">
              {/* Item principal */}
              {hasChildren ? (
                <button
                  onClick={() => toggleSection(item.id)}
                  className={`
                    w-full flex items-center justify-between
                    px-2 py-2 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-slate-900/70"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <ChevronDown
                      size={16}
                      className={`
                        transition-transform duration-200
                        ${isOpen ? "rotate-180" : "rotate-0"}
                      `}
                    />
                  )}
                </button>
              ) : (
                <Link
                  to={item.to}
                  className={`
                    flex items-center gap-3 px-2 py-2 rounded-lg
                    transition-colors
                    ${
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-slate-900/70"
                    }
                  `}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              )}

              {hasChildren && isOpen && !isCollapsed && (
                <div className="ml-7 mt-1 space-y-1 border-l border-slate-800/70 pl-3">
                  {item.children.map((sub) => {
                    const subActive = location.pathname === sub.to;
                    return (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className={`
                          block text-xs py-1.5 rounded transition-colors
                          ${
                            subActive
                              ? "text-white font-semibold"
                              : "text-slate-400 hover:text-white"
                          }
                        `}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-800/70 px-3 py-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium truncate max-w-[9rem]">
                {username}
              </span>
              <span className="text-[10px] text-slate-500">Administrator</span>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`
            flex items-center justify-center
            w-full text-red-400 hover:text-red-100
            hover:bg-red-700/30
            border border-red-500/40 transition-colors
            ${isCollapsed ? "h-10 rounded-full" : "gap-2 px-3 py-2 rounded-lg"}
          `}
          title="Log out"
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
