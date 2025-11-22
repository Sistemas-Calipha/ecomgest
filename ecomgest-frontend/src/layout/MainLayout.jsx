// src/layout/MainLayout.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout({ onLogout, user }) {
  return (
    <div
      className="
        flex h-screen w-full overflow-hidden
        bg-gray-100 dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
      "
    >
      {/* SIDEBAR */}
      <Sidebar onLogout={onLogout} user={user} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* NAVBAR SUPERIOR */}
        <Navbar onLogout={onLogout} user={user} />

        {/* CONTENIDO DE LAS RUTAS (Dashboard, Ventas, etc.) */}
        <main
          className="
            flex-1 p-6 
            bg-gray-100 dark:bg-gray-900
            text-gray-800 dark:text-gray-100
            transition-colors duration-300
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
