// src/pages/Login.jsx

import { useState } from "react";
import api from "../utils/api";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        correo,
        contrasena,
      });

      const data = res;

      if (!data || !data.token || !data.user) {
        setError("Respuesta inválida del servidor");
        setLoading(false);
        return;
      }

      onLogin({
        token: data.token,
        user: data.user,
      });
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      setError(err.response?.data?.error || "Credenciales inválidas");
    }

    setLoading(false);
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900
        text-gray-900
      "
    >
      {/* CARD CON ANIMACIÓN */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="
          w-96 p-8 rounded-2xl
          bg-white/20 backdrop-blur-xl 
          shadow-2xl border border-white/20
        "
      >
        {/* LOGO / TÍTULO */}
        <h2 className="text-center text-3xl font-bold text-white drop-shadow mb-6 tracking-wide">
          ECOMGEST
        </h2>

        {/* INPUT correo */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-white/90">Correo</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            className="
              w-full mt-1 px-3 py-2
              bg-white/80
              border border-gray-300 
              focus:border-purple-500
              focus:ring-2 focus:ring-purple-400/40
              rounded-xl outline-none
              transition
            "
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        {/* INPUT contraseña */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-white/90">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="
              w-full mt-1 px-3 py-2
              bg-white/80
              border border-gray-300 
              focus:border-purple-500
              focus:ring-2 focus:ring-purple-400/40
              rounded-xl outline-none
              transition
            "
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        {/* BOTÓN */}
        <button
          disabled={loading}
          className="
            w-full py-2.5 rounded-xl
            bg-purple-600 hover:bg-purple-700 
            text-white font-semibold
            shadow-md hover:shadow-lg
            transition-all
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {/* ERROR */}
        {error && (
          <p className="text-red-300 text-sm text-center font-medium mt-4">
            {error}
          </p>
        )}
      </motion.form>
    </div>
  );
}
