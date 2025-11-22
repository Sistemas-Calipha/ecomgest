// src/layout/MainLayout.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children, onLogout }) {
  return (
    <div
      className="
        flex h-screen 
        bg-gray-100 dark:bg-gray-900 
        text-gray-900 dark:text-gray-100
        transition-colors
      "
    >
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar onLogout={onLogout} />

        <main
          className="
            p-6 min-h-screen
            bg-gray-100 dark:bg-gray-900 
            text-gray-800 dark:text-gray-100
            transition-colors
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
