// src/pages/Configuracion/Users.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import { Plus, Pencil, RefreshCw, Shield } from "lucide-react";

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState(null);

  const [form, setForm] = useState({
    nombre_completo: "",
    correo: "",
    rol_id: "",
    activo: true,
    empresas: []
  });

  // ======================================================
  // CARGA INICIAL
  // ======================================================
  async function loadData() {
    try {
      setLoading(true);

      const [usersRes, rolesRes, companiesRes] = await Promise.all([
        api.get("/users"),
        api.get("/roles"),
        api.get("/companies")
      ]);

      setUsers(usersRes.users || []);
      setRoles(rolesRes.roles || []);
      setCompanies(companiesRes.companies || []);

    } catch (err) {
      console.error("❌ Error cargando usuarios:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ======================================================
  // NUEVO USUARIO
  // ======================================================
  function openCreate() {
    setEditMode(false);
    setCurrent(null);
    setForm({
      nombre_completo: "",
      correo: "",
      rol_id: "",
      activo: true,
      empresas: []
    });
    setModalOpen(true);
  }

  // ======================================================
  // EDITAR USUARIO
  // ======================================================
  function openEdit(user) {
    setEditMode(true);
    setCurrent(user);

    setForm({
      nombre_completo: user.nombre_completo,
      correo: user.correo,
      rol_id: user.rol_id,
      activo: user.activo,
      empresas: user.empresas || [] // todavía no viene del backend
    });

    setModalOpen(true);
  }

  // ======================================================
  // GUARDAR (CREAR / ACTUALIZAR)
  // ======================================================
  async function saveUser() {
    try {
      if (!form.nombre_completo.trim() || !form.correo.trim() || !form.rol_id) {
        alert("Nombre, correo y rol son obligatorios.");
        return;
      }

      if (editMode) {
        await api.put(`/users/${current.id}`, {
          nombre_completo: form.nombre_completo,
          correo: form.correo,
          rol_id: form.rol_id,
          activo: form.activo,
          empresas: form.empresas
        });
      } else {
        await api.post(`/users`, {
          ...form,
          empresas: form.empresas
        });
      }

      setModalOpen(false);
      loadData();

    } catch (err) {
      console.error("❌ Error guardando usuario:", err.message);
      alert("No se pudo guardar.");
    }
  }

  // ======================================================
  // CAMBIAR ESTADO
  // ======================================================
  async function toggleActive(user) {
    try {
      await api.patch(`/users/${user.id}/state`, { activo: !user.activo });
      loadData();
    } catch {
      alert("No se pudo actualizar el estado.");
    }
  }

  // ======================================================
  // RESET PASSWORD
  // ======================================================
  async function resetPass(user) {
    if (!confirm(`¿Resetear contraseña de ${user.nombre_completo}?`)) return;

    try {
      const res = await api.post(`/users/${user.id}/reset-password`);
      alert(`Nueva contraseña: ${res.new_password}`);
    } catch {
      alert("No se pudo resetear la contraseña.");
    }
  }

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="animate-fade space-y-8">

      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wide">
            Configuración
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Usuarios
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Administra los usuarios y accesos del sistema central.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-xl shadow"
        >
          <Plus size={16} /> Nuevo usuario
        </button>
      </header>

      {/* TABLA */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-10" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                  <th className="py-2 pr-4">Nombre</th>
                  <th className="py-2 pr-4">Correo</th>
                  <th className="py-2 pr-4">Rol</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}

                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 pr-4">{u.nombre_completo}</td>
                    <td className="py-3 pr-4">{u.correo}</td>
                    <td className="py-3 pr-4">
                      <span className="text-xs bg-slate-800/20 dark:bg-slate-700 px-2 py-1 rounded">
                        {u.rol_id}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {u.activo ? (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          Inactivo
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => toggleActive(u)}
                          className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                        >
                          <Shield size={16} />
                        </button>

                        <button
                          onClick={() => resetPass(u)}
                          className="p-1.5 rounded-lg hover:bg-purple-200/60 dark:hover:bg-purple-900/40"
                        >
                          <RefreshCw size={16} />
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? "Editar usuario" : "Nuevo usuario"} size="md">
        <div className="space-y-4">

          {/* Nombre */}
          <div>
            <label className="text-xs text-slate-500">Nombre completo</label>
            <input
              type="text"
              value={form.nombre_completo}
              onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="text-xs text-slate-500">Correo</label>
            <input
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="text-xs text-slate-500">Rol</label>
            <select
              value={form.rol_id}
              onChange={(e) => setForm({ ...form, rol_id: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="">Seleccionar...</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>

          {/* Empresas */}
          <div>
            <label className="text-xs text-slate-500">Empresas</label>
            <select
              multiple
              value={form.empresas}
              onChange={(e) =>
                setForm({
                  ...form,
                  empresas: Array.from(e.target.selectedOptions).map((o) => o.value)
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
            />
            <span className="text-sm">Activo</span>
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-2 pt-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
            >
              Cancelar
            </button>

            <button
              onClick={saveUser}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
            >
              {editMode ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>

        </div>
      </Modal>
    </div>
  );
}
