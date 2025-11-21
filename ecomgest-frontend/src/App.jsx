// src/App.jsx
import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import SelectCompany from "./pages/SelectCompany.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Helper
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
  const [userData, setUserData] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  // Cargar sesión del localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedPendingUser = localStorage.getItem("pendingUser");
    const savedUserData = localStorage.getItem("userData");

    if (savedToken) setToken(savedToken);
    if (savedPendingUser) setPendingUser(JSON.parse(savedPendingUser));
    if (savedUserData) setUserData(JSON.parse(savedUserData));
  }, []);

  // LOGIN
  function handleLogin({ token, user }) {
    localStorage.setItem("token", token);
    localStorage.setItem("pendingUser", JSON.stringify(user));

    setToken(token);
    setPendingUser(user);
  }

  // SELECT COMPANY – FINAL
  function handleCompanySelected(token) {
  const decoded = decodeToken(token);

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
    }
  };

  localStorage.setItem("token", token);
  localStorage.setItem("userData", JSON.stringify(formatted));
  localStorage.removeItem("pendingUser");

  setToken(token);
  setUserData(formatted);
}


  // LOGOUT
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("pendingUser");
    localStorage.removeItem("userData");

    setToken(null);
    setPendingUser(null);
    setUserData(null);
  }

  // RENDERS ==================================================

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

  // 3) Empresa elegida → dashboard
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
