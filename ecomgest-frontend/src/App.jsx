// src/App.jsx

import { useState, useEffect } from "react";
import AppRouter from "./router/AppRouter";

export default function App() {
  const [token, setToken] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Cargar sesión guardada en sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedPendingUser = sessionStorage.getItem("pendingUser");
    const savedUserData = sessionStorage.getItem("userData");

    if (savedToken) setToken(savedToken);
    if (savedPendingUser) setPendingUser(JSON.parse(savedPendingUser));
    if (savedUserData) setUserData(JSON.parse(savedUserData));
  }, []);

  // LOGIN → usuario autenticado pero sin empresa
  function handleLogin(user) {
    const t = sessionStorage.getItem("token");

    setToken(t);
    setPendingUser(user);

    sessionStorage.setItem("pendingUser", JSON.stringify(user));
  }

  // EMPRESA SELECCIONADA → token final con empresa + rol
  function handleCompanySelected(finalToken) {
    const decoded = JSON.parse(atob(finalToken.split(".")[1]));

    const formatted = {
      id: decoded.id,
      correo: decoded.correo,
      company: {
        id: decoded.empresa_id,
        nombre: decoded.empresa_nombre,
      },
      role: {
        id: decoded.rol_id,
        nombre: decoded.rol_nombre,
      },
    };

    sessionStorage.setItem("token", finalToken);
    sessionStorage.setItem("userData", JSON.stringify(formatted));
    sessionStorage.removeItem("pendingUser");

    setToken(finalToken);
    setUserData(formatted);
    setPendingUser(null);
  }

  // LOGOUT TOTAL
  function handleLogout() {
    sessionStorage.clear();
    setToken(null);
    setPendingUser(null);
    setUserData(null);
  }

  return (
    <AppRouter
      user={userData}
      pendingUser={pendingUser}
      onLogin={handleLogin}
      onCompanySelected={handleCompanySelected}
      onLogout={handleLogout}
    />
  );
}
