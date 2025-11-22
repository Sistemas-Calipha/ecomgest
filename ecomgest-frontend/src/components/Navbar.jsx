// src/components/Navbar.jsx

import { LogOut } from "lucide-react";

export default function Navbar({ onLogout }) {
  return (
    <header
      className="
        w-full h-16
        backdrop-blur-md bg-white/80
        border-b border-gray-200
        flex items-center justify-between
        px-6
        sticky top-0 z-50
        shadow-sm
      "
    >
      {/* Título dinámico (si querés luego lo hacemos automático por ruta) */}
      <h1 className="text-lg font-semibold text-gray-800 tracking-wide">
        Panel principal
      </h1>

      {/* --- USER SECTION --- */}
      <div className="flex items-center gap-4">

        {/* Nombre del usuario */}
        <div className="hidden sm:flex flex-col leading-tight text-right">
          <span className="text-sm font-semibold text-gray-800">Erick</span>
          <span className="text-xs text-gray-500">Administrador</span>
        </div>

        {/* Avatar minimalista */}
        <div
          className="
            w-9 h-9 rounded-full
            bg-gradient-to-br from-purple-500 to-purple-700
            text-white flex items-center justify-center
            font-semibold text-sm shadow
          "
        >
          E
        </div>

        {/* Botón de Logout */}
        <button
          onClick={onLogout}
          className="
            flex items-center gap-2
            px-3 py-1.5
            text-sm font-medium
            rounded-xl
            border border-gray-300
            text-gray-700 bg-white
            hover:bg-gray-100
            transition-all
            shadow-sm
          "
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}
