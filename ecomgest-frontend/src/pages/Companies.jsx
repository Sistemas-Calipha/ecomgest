// src/pages/Companies.jsx

import { useEffect, useState } from "react";
import api from "../utils/api";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Companies() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    cuit: "",
    estado: "activa",
  });

  // ============================
  // Load companies
  // ============================
  async function loadCompanies() {
    try {
      setLoading(true);
      const res = await api.get("/companies");
      setCompanies(res.companies || []);
    } catch (err) {
      console.error("❌ Error loading companies:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  // ============================
  // Open Create Modal
  // ============================
  function openCreateModal() {
    setEditMode(false);
    setForm({ nombre: "", cuit: "", estado: "activa" });
    setCurrent(null);
    setModalOpen(true);
  }

  // ============================
  // Open Edit Modal
  // ============================
  function openEditModal(company) {
    setEditMode(true);
    setCurrent(company);
    setForm({
      nombre: company.nombre,
      cuit: company.cuit,
      estado: company.estado,
    });
    setModalOpen(true);
  }

  // ============================
  // Save Company (Create or Update)
  // ============================
  async function saveCompany() {
    try {
      if (!form.nombre.trim() || !form.cuit.trim()) {
        alert("Nombre y CUIT son requeridos.");
        return;
      }

      if (editMode) {
        await api.put(`/companies/${current.id}`, form);
      } else {
        await api.post("/companies", form);
      }

      setModalOpen(false);
      loadCompanies();
    } catch (err) {
      console.error("❌ Error saving:", err.message);
      alert("Error al guardar empresa.");
    }
  }

  // ============================
  // Delete
  // ============================
  async function deleteCompany(company) {
    if (!confirm(`¿Seguro quieres eliminar "${company.nombre}"?`)) return;

    try {
      await api.delete(`/companies/${company.id}`);
      loadCompanies();
    } catch (err) {
      console.error("❌ Error deleting:", err.message);
      alert("No se pudo eliminar la empresa.");
    }
  }

  // ============================
  // JSX
  // ============================
  return (
    <div className="animate-fade space-y-8">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Administración
          </p>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Empresas
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gestiona todas las compañías vinculadas a tu sistema.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl
                     bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition"
        >
          <Plus size={16} />
          Add Company
        </button>
      </header>

      {/* TABLE */}
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
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <th className="py-2">Nombre</th>
                <th className="py-2">CUIT</th>
                <th className="py-2">Estado</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {companies.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">
                    No hay empresas registradas.
                  </td>
                </tr>
              )}

              {companies.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-3">{c.nombre}</td>
                  <td className="py-3">{c.cuit}</td>
                  <td className="py-3 capitalize">{c.estado}</td>

                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition"
                      >
                        <Pencil size={16} className="text-slate-600" />
                      </button>

                      <button
                        onClick={() => deleteCompany(c)}
                        className="p-1.5 rounded-lg hover:bg-red-200/40 dark:hover:bg-red-800/40 transition"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Company" : "Add Company"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">CUIT</label>
            <input
              type="text"
              value={form.cuit}
              onChange={(e) => setForm({ ...form, cuit: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={saveCompany}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition"
            >
              {editMode ? "Save changes" : "Create company"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
