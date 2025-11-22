// src/components/Navbar.jsx

import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Navbar({ onLogout }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="
        w-full h-16 flex items-center justify-between px-6
        sticky top-0 z-50
        backdrop-blur-md
        bg-white/80 dark:bg-gray-900/80
        border-b border-gray-200 dark:border-gray-700
        transition-all
      "
    >
      {/* Título del módulo */}
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">

        {/* BOTÓN MODO OSCURO */}
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
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Nombre del usuario */}
        <span className="text-gray-700 dark:text-gray-300">Erick</span>

        {/* Botón logout */}
        <button
          onClick={onLogout}
          className="
            text-sm border border-gray-300 dark:border-gray-600
            rounded-full px-3 py-1
            bg-white/60 dark:bg-gray-800/60
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition
            text-gray-700 dark:text-gray-200
          "
        >
          Logout
        </button>
      </div>
    </div>
  );
}
