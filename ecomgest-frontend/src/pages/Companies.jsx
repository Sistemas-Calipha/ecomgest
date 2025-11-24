// src/pages/Companies.jsx

import { useEffect, useState } from "react";
import api from "../utils/api";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";

// ============================================
// VALIDACIÓN AFIP (frontend)
// ============================================
function validarCuitAFIP(cuit) {
  const clean = cuit.replace(/\D/g, "");
  if (clean.length !== 11) return false;

  const coef = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    suma += parseInt(clean[i], 10) * coef[i];
  }

  const resto = suma % 11;
  let verificador;

  if (resto === 0) verificador = 0;
  else if (resto === 1) verificador = clean.startsWith("20") ? 9 : 4;
  else verificador = 11 - resto;

  return verificador === parseInt(clean[10], 10);
}

// ============================================
// AUTOFORMATEAR EL CUIT MIENTRAS SE ESCRIBE
// ============================================
function formatearCuit(value) {
  let clean = value.replace(/\D/g, "");
  if (clean.length > 2) clean = clean.replace(/^(\d{2})(\d+)/, "$1-$2");
  if (clean.length > 11) clean = clean.replace(/^(\d{2})-(\d{8})(\d+)/, "$1-$2-$3");
  return clean;
}

export default function Companies() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    cuit: "",
    plan: "",
    estado: "activa",
  });

  const [search, setSearch] = useState("");

  // ============================
  // Cargar empresas
  // ============================
  async function loadCompanies() {
    try {
      setLoading(true);
      const res = await api.get("/companies");
      setCompanies(res.companies || []);
    } catch (err) {
      console.error("❌ Error cargando empresas:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  // ============================
  // Crear empresa
  // ============================
  function openCreateModal() {
    setEditMode(false);
    setCurrent(null);
    setForm({
      nombre: "",
      cuit: "",
      plan: "",
      estado: "activa",
    });
    setModalOpen(true);
  }

  // ============================
  // Editar empresa
  // ============================
  function openEditModal(company) {
    setEditMode(true);
    setCurrent(company);
    setForm({
      nombre: company.nombre || "",
      cuit: company.cuit || "",
      plan: company.plan || "",
      estado: company.estado || "activa",
    });
    setModalOpen(true);
  }

  // ============================
  // Guardar empresa (crear/update)
  // ============================
  async function saveCompany() {
    try {
      // --- VALIDACIONES ---
      if (!form.nombre.trim()) {
        alert("El nombre es obligatorio.");
        return;
      }

      if (!form.cuit.trim()) {
        alert("El CUIT es obligatorio.");
        return;
      }

      if (!validarCuitAFIP(form.cuit)) {
        alert("CUIT inválido según AFIP. Verifica el número.");
        return;
      }

      if (!form.plan.trim()) {
        alert("El plan es obligatorio.");
        return;
      }

      if (editMode && current) {
        await api.put(`/companies/${current.id}`, {
          ...form,
          cuit: form.cuit.replace(/\D/g, ""), // normalizar
        });
      } else {
        await api.post("/companies", {
          ...form,
          cuit: form.cuit.replace(/\D/g, ""), // normalizar
        });
      }

      setModalOpen(false);
      await loadCompanies();
    } catch (err) {
      console.error("❌ Error guardando empresa:", err.message);
      alert("No se pudo guardar la empresa.");
    }
  }

  // ============================
  // Eliminar empresa
  // ============================
  async function deleteCompany(company) {
    const ok = window.confirm(
      `¿Seguro que quieres eliminar la empresa "${company.nombre}"?\nEsta acción no se puede deshacer.`
    );
    if (!ok) return;

    try {
      await api.delete(`/companies/${company.id}`);
      await loadCompanies();
    } catch (err) {
      console.error("❌ Error eliminando empresa:", err.message);
      alert("No se pudo eliminar la empresa.");
    }
  }

  // ============================
  // Filtrar empresas
  // ============================
  const filteredCompanies = companies.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.nombre?.toLowerCase().includes(q) ||
      c.plan?.toLowerCase().includes(q) ||
      c.cuit?.toLowerCase().includes(q)
    );
  });

  function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("es-AR");
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="animate-fade space-y-8">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
            Administración
          </p>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Empresas
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gestiona las empresas disponibles en tu entorno de ECOMGEST.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Buscar por nombre, CUIT o plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700
              bg-white/80 dark:bg-slate-900/70
              text-sm text-slate-700 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-purple-500/60
            "
          />

          <button
            onClick={openCreateModal}
            className="
              flex items-center justify-center gap-2
              px-4 py-2 text-sm rounded-xl
              bg-purple-600 hover:bg-purple-700
              text-white shadow-sm
              transition
            "
          >
            <Plus size={16} />
            Nueva empresa
          </button>
        </div>
      </header>

      {/* TABLA */}
      <section
        className="
          rounded-2xl border border-slate-200 dark:border-slate-800
          bg-white/70 dark:bg-slate-900/60 backdrop-blur
          shadow-sm p-6
        "
      >
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-10" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No se encontraron empresas con el criterio actual.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 pr-4">Nombre</th>
                  <th className="py-2 pr-4">CUIT</th>
                  <th className="py-2 pr-4">Plan</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4">Creada en</th>
                  <th className="py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-3 pr-4">{c.nombre}</td>
                    <td className="py-3 pr-4">{c.cuit}</td>
                    <td className="py-3 pr-4">{c.plan || "—"}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`
                          inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium
                          ${
                            c.estado === "activa"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : c.estado === "inactiva"
                              ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          }
                        `}
                      >
                        {c.estado}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{formatDate(c.creado_en)}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="
                            p-1.5 rounded-lg
                            hover:bg-slate-200/60 dark:hover:bg-slate-700/60
                            transition
                          "
                        >
                          <Pencil
                            size={16}
                            className="text-slate-600 dark:text-slate-200"
                          />
                        </button>

                        <button
                          onClick={() => deleteCompany(c)}
                          className="
                            p-1.5 rounded-lg
                            hover:bg-red-100/60 dark:hover:bg-red-900/40
                            transition
                          "
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>  
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Editar empresa" : "Nueva empresa"}
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="
                px-3 py-1.5 text-xs rounded-lg
                border border-slate-200 dark:border-slate-700
                text-slate-600 dark:text-slate-200
                bg-white/70 dark:bg-slate-950
                hover:bg-slate-100 dark:hover:bg-slate-900
                transition
              "
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={saveCompany}
              className="
                px-3 py-1.5 text-xs rounded-lg
                bg-purple-600 hover:bg-purple-700
                text-white shadow-sm
                transition
              "
            >
              {editMode ? "Guardar cambios" : "Crear empresa"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Nombre
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="
                w-full mt-1 px-3 py-2 rounded-xl border
                border-slate-300 dark:border-slate-700
                bg-white dark:bg-slate-900
                text-sm text-slate-800 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-purple-500/60
              "
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400">
              CUIT
            </label>
            <input
              type="text"
              value={form.cuit}
              onChange={(e) =>
                setForm({
                  ...form,
                  cuit: formatearCuit(e.target.value),
                })
              }
              placeholder="20-12345678-5"
              className="
                w-full mt-1 px-3 py-2 rounded-xl border
                border-slate-300 dark:border-slate-700
                bg-white dark:bg-slate-900
                text-sm text-slate-800 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-purple-500/60
              "
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Plan
            </label>
            <input
              type="text"
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
              placeholder="Free, Basic, Pro..."
              className="
                w-full mt-1 px-3 py-2 rounded-xl border
                border-slate-300 dark:border-slate-700
                bg-white dark:bg-slate-900
                text-sm text-slate-800 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-purple-500/60
              "
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Estado
            </label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="
                w-full mt-1 px-3 py-2 rounded-xl border
                border-slate-300 dark:border-slate-700
                bg-white dark:bg-slate-900
                text-sm text-slate-800 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-purple-500/60
              "
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
              <option value="suspendida">Suspendida</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
