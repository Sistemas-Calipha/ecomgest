// src/pages/Login.jsx
import { useState } from "react";
import api from "../utils/api";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { correo, contrasena });

      if (!res?.token || !res?.user) {
        setError("Respuesta inválida del servidor.");
        setLoading(false);
        return;
      }

      // Guardamos token preliminar (sin empresa)
      sessionStorage.setItem("token", res.token);

      // Disparamos flujo hacia /select-company
      onLogin(res.user);
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      setError("Credenciales inválidas");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-96 p-8 rounded-2xl bg-white/20 backdrop-blur-xl 
                   shadow-2xl border border-white/20"
      >
        <h2 className="text-center text-3xl font-bold text-white drop-shadow mb-6">
          ECOMGEST
        </h2>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-white/90">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white/80 border border-gray-300 
                       rounded-xl outline-none"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-white/90">Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white/80 border border-gray-300 
                       rounded-xl outline-none"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 
                     text-white font-semibold"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {error && (
          <p className="text-red-300 text-sm text-center mt-4">{error}</p>
        )}
      </motion.form>
    </div>
  );
}
