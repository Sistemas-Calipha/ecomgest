// src/App.jsx
import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import SelectCompany from "./pages/SelectCompany.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// ------------------------------------------------------
// Helper para decodificar el JWT
// ------------------------------------------------------
function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function App() {
  const [token, setToken] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // ------------------------------------------------------
  // CARGAR SESIÓN DESDE sessionStorage
  // ------------------------------------------------------
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedPendingUser = sessionStorage.getItem("pendingUser");
    const savedUserData = sessionStorage.getItem("userData");

    if (savedToken) setToken(savedToken);
    if (savedPendingUser) setPendingUser(JSON.parse(savedPendingUser));
    if (savedUserData) setUserData(JSON.parse(savedUserData));
  }, []);

  // ------------------------------------------------------
  // LOGIN (usuario autenticado → falta elegir empresa)
  // ------------------------------------------------------
  function handleLogin(user) {
    // Acá el token y user ya los guardó Login.jsx en sessionStorage
    const token = sessionStorage.getItem("token");

    setToken(token);
    setPendingUser(user);

    sessionStorage.setItem("pendingUser", JSON.stringify(user));
  }

  // ------------------------------------------------------
  // EMPRESA SELECCIONADA (token final con empresa + rol)
  // ------------------------------------------------------
  function handleCompanySelected(finalToken) {
    const decoded = decodeToken(finalToken);

    const formatted = {
      id: decoded.id,
      correo: decoded.correo,
      company: {
        id: decoded.empresa_id,
        nombre: decoded.empresa_nombre || "Empresa",
      },
      role: {
        id: decoded.rol_id,
        nombre: decoded.rol_nombre,
      },
    };

    // Guardar token final + user final
    sessionStorage.setItem("token", finalToken);
    sessionStorage.setItem("userData", JSON.stringify(formatted));
    sessionStorage.removeItem("pendingUser");

    setToken(finalToken);
    setUserData(formatted);
    setPendingUser(null);
  }

  // ------------------------------------------------------
  // LOGOUT TOTAL
  // ------------------------------------------------------
  function handleLogout() {
    sessionStorage.clear();
    setToken(null);
    setPendingUser(null);
    setUserData(null);
  }

  // ------------------------------------------------------
  // RENDERS
  // ------------------------------------------------------

  // 1) Sin login
  if (!token && !pendingUser) {
    return <Login onLogin={handleLogin} />;
  }

  // 2) Login ok → falta elegir empresa
  if (token && pendingUser && !userData) {
    return (
      <SelectCompany
        user={pendingUser}
        onCompanySelected={handleCompanySelected}
      />
    );
  }

  // 3) Empresa elegida → sistema completo
  if (token && userData && userData.company) {
    return (
      <Dashboard 
        user={userData}
        onLogout={handleLogout}
      />
    );
  }

  return <p>Cargando...</p>;
}
