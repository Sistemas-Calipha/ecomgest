// src/pages/SelectCompany.jsx
import { useState } from "react";
import api from "../utils/api";

export default function SelectCompany({ user, onCompanySelected }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSelect(company) {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/select-company", {
        userId: user.id,
        companyId: company.empresa_id,
      });

      if (!res?.token) {
        setError("Respuesta inválida del servidor.");
        setLoading(false);
        return;
      }

      // Mandamos sólo el token final al App.jsx
      onCompanySelected(res.token);

    } catch (err) {
      console.error("❌ Error seleccionando empresa:", err);
      setError("No se pudo seleccionar la empresa.");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-6">
          Selecciona una empresa
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
        )}

        {user.empresas?.map((empresa) => (
          <button
            key={empresa.empresa_id}
            disabled={loading}
            onClick={() => handleSelect(empresa)}
            className="w-full mb-3 bg-purple-600 hover:bg-purple-700 
                       text-white py-2 rounded transition"
          >
            {empresa.empresa_nombre}
            <span className="opacity-80"> — {empresa.rol_nombre}</span>
          </button>
        ))}

      </div>
    </div>
  );
}
