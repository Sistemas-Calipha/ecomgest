// src/components/Navbar.jsx

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, LogOut } from "lucide-react";

export default function Navbar({ onLogout, user }) {
  const { theme, toggleTheme } = useTheme();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const username = user?.correo || "Usuario";

  function handleLogout() {
    if (logoutLoading) return;
    setLogoutLoading(true);

    setTimeout(() => {
      onLogout();
    }, 250);
  }

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
      {/* Título del módulo */}
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>

      {/* Controles */}
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

        {/* Nombre del usuario */}
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {username}
        </span>
      </div>
    </div>
  );
}
