import { useState } from "react";
import api from "../utils/api";

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
      console.log("🔵 Enviando login al backend...");

      // Llamada al backend
      const res = await api.post("/auth/login", {
        correo,
        contrasena,
      });

      // 👇 ESTA ES LA LÍNEA CORRECTA
      const data = res;

      console.log("🟣 LOGIN → Full Data:", data);
      console.log("🟣 LOGIN → Empresas:", data?.user?.empresas);

      // Validaciones
      if (!data || !data.token || !data.user) {
        setError("Respuesta inválida del servidor");
        setLoading(false);
        return;
      }

      // Enviamos token + info al componente padre
      onLogin({
        token: data.token,
        user: data.user,
      });

    } catch (err) {
      console.error("❌ Error en LOGIN:", err);
      setError(err.response?.data?.error || err.message || "Credenciales inválidas");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">ECOMGEST</h2>

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-3 p-2 border rounded"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-2 border rounded"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {error && (
          <p className="text-red-500 mt-3 text-center font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
