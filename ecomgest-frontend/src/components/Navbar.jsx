// src/components/Navbar.jsx

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Navbar({ user }) {
  const { theme, toggleTheme } = useTheme();
  const [logoutLoading] = useState(false);

  const username = user?.correo || "Usuario";

  // ============================================
  //   BREADCRUMB DINÁMICO SEGÚN LA RUTA ACTUAL
  // ============================================
  const location = useLocation();
  const path = location.pathname;

  const routeTitles = {
    "/": ["Dashboard"],

    "/ventas": ["Ventas"],
    "/ventas/ordenes": ["Ventas", "Órdenes"],
    "/ventas/facturacion": ["Ventas", "Facturación"],
    "/ventas/metodos-pago": ["Ventas", "Métodos de pago"],

    "/inventario": ["Inventario"],
    "/inventario/productos": ["Inventario", "Productos"],
    "/inventario/movimientos": ["Inventario", "Movimientos"],
    "/inventario/alertas": ["Inventario", "Alertas"],
    "/inventario/proveedores": ["Inventario", "Proveedores"],

    "/clientes": ["Clientes"],
    "/clientes/crm": ["Clientes", "CRM"],
    "/clientes/historial": ["Clientes", "Historial"],
    "/clientes/segmentos": ["Clientes", "Segmentos"],

    "/finanzas": ["Finanzas"],
    "/finanzas/caja": ["Finanzas", "Caja"],
    "/finanzas/pagos": ["Finanzas", "Pagos"],
    "/finanzas/ingresos": ["Finanzas", "Ingresos"],
    "/finanzas/cierres": ["Finanzas", "Cierres"],

    "/configuracion": ["Configuración"],
    "/configuracion/usuarios": ["Configuración", "Usuarios"],
    "/configuracion/roles": ["Configuración", "Roles"],
    "/configuracion/permisos": ["Configuración", "Permisos"],
  };

  const breadcrumb = routeTitles[path] || ["ECOMGEST"];

  return (
    <div
      className="
        w-full h-16 flex items-center justify-between px-6
        sticky top-0 z-50
        backdrop-blur-md
        bg-white/80 dark:bg-gray-900/80
        border-b border-gray-200 dark:border-gray-700
        transition-all duration-300
      "
    >
      {/* =======================================
          BREADCRUMB (TÍTULO DEL MÓDULO)
      ======================================== */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          {breadcrumb.map((item, i) => (
            <span key={i}>
              {item}
              {i < breadcrumb.length - 1 && (
                <span className="mx-1 opacity-70">/</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* =======================================
          CONTROLES (MODO OSCURO + USUARIO)
      ======================================== */}
      <div className="flex items-center gap-4">

        {/* MODO OSCURO */}
        <button
          onClick={toggleTheme}
          className="
            w-10 h-10 rounded-xl flex items-center justify-center
            bg-gray-200 dark:bg-gray-700
            text-gray-700 dark:text-gray-200
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition-all
          "
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* NOMBRE DEL USUARIO */}
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {username}
        </span>
      </div>
    </div>
  );
}
