// src/layout/MainLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* NAVBAR */}
        <Navbar onLogout={onLogout} user={user} />

        {/* CONTENIDO DINÁMICO DEL ROUTER */}
        <main
          className="
            flex-1 overflow-y-auto p-6 
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
