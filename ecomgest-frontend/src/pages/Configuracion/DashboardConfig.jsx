// src/pages/Configuracion/DashboardConfig.jsx
import { useNavigate } from "react-router-dom";

export default function DashboardConfig() {
  const navigate = useNavigate();

  function irAlDashboard() {
    navigate("/", { state: { openDashboardConfig: true } });
  }

  return (
    <div className="animate-fade max-w-3xl mx-auto space-y-6">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
          Configuración
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Desde aquí puedes abrir el configurador avanzado de widgets del
          dashboard principal.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Personalización de widgets
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Podrás elegir qué módulos se muestran, ocultar bloques que no usas y
          reorganizar el layout mediante drag &amp; drop, todo por usuario y por
          empresa.
        </p>

        <button
          onClick={irAlDashboard}
          className="
            px-4 py-2 text-sm rounded-xl
            bg-purple-600 hover:bg-purple-700
            text-white shadow-sm
            transition
          "
        >
          Abrir configurador de dashboard
        </button>
      </section>
    </div>
  );
}
