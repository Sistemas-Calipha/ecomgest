// src/layout/MainLayout.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children, onLogout }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">

      {/* === SIDEBAR === */}
      <Sidebar />

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar / Navbar */}
        <Navbar onLogout={onLogout} />

        {/* Main Content */}
        <main
          className="
            flex-1 overflow-y-auto 
            px-6 py-6
            bg-gradient-to-br from-gray-50 to-gray-100
          "
        >
          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
