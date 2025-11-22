// src/layout/MainLayout.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children, onLogout, user }) {
  // Estado del sidebar colapsado
  const [collapsed, setCollapsed] = useState(false);

  function toggleSidebar() {
    setCollapsed((prev) => !prev);
  }

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
      <Sidebar
        collapsed={collapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={onLogout}
      />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* NAVBAR SUPERIOR */}
        <Navbar
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          user={user}
          onLogout={onLogout}
        />

        {/* CONTENIDO */}
        <main
          className="
            flex-1 p-6 
            bg-gray-100 dark:bg-gray-900
            text-gray-800 dark:text-gray-100
            transition-colors duration-300
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
