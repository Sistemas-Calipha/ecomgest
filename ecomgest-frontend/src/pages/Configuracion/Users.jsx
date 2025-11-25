// src/pages/Configuracion/Users.jsx

import { useEffect, useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

export default function Users() {

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Data from backend
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  // Form
  const [form, setForm] = useState({
    nombre_completo: "",
    correo: "",
    contrasena: "",
    rol_id: "",
    activo: true,
    empresas_asignadas: [], // array de IDs de empresa
  });

  const [search, setSearch] = useState("");


  // ======================================================
  // LOAD INIT DATA
  // ======================================================

  async function loadAll() {
    try {
      setLoading(true);

      const [uRes, rRes, cRes] = await Promise.all([
        api.get("/users"),
        api.get("/roles"),
        api.get("/companies"),
      ]);

      setUsers(uRes.users || []);
      setRoles(rRes.roles || []);
      setCompanies(cRes.companies || []);

    } catch (err) {
      console.error("❌ Error cargando datos:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);


  // ======================================================
  // OPEN MODALS
  // ======================================================

  function openCreateModal() {
    setEditMode(false);
    setCurrentUser(null);
    setForm({
      nombre_completo: "",
      correo: "",
      contrasena: "",
      rol_id: "",
      activo: true,
      empresas_asignadas: [],
    });
    setModalOpen(true);
  }

  function openEditModal(user) {
    setEditMode(true);
    setCurrentUser(user);

    // Consultar sus empresas asignadas
    api.get(`/company-users/${user.id}`).then((res) => {
      const empresas = res.empresas_asignadas || [];

      setForm({
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        contrasena: "",
        rol_id: user.rol_id,
        activo: user.activo,
        empresas_asignadas: empresas.map((e) => e.empresa_id),
      });

      setModalOpen(true);
    });
  }


  // ======================================================
  // SAVE USER (CREATE / UPDATE)
  // ======================================================

  async function saveUser() {
    try {
      if (!form.nombre_completo.trim()) {
        alert("El nombre es obligatorio.");
        return;
      }

      if (!form.correo.trim()) {
        alert("El correo es obligatorio.");
        return;
      }

      if (!form.rol_id.trim()) {
        alert("Debe seleccionar un rol.");
        return;
      }

      if (form.empresas_asignadas.length === 0) {
        alert("Debe asignar al menos una empresa.");
        return;
      }

      let userData;

      // --------------------------------
      // CREATE
      // --------------------------------
      if (!editMode) {
        userData = await api.post("/users", {
          nombre_completo: form.nombre_completo,
          correo: form.correo,
          contrasena: form.contrasena || undefined,
          rol_id: form.rol_id,
          activo: form.activo,
        });

        const newUserId = userData.user.id;

        // Asignar empresas
        await api.post(`/company-users/assign-bulk`, {
          userId: newUserId,
          empresas: form.empresas_asignadas,
        });
      }

      // --------------------------------
      // UPDATE
      // --------------------------------
      else {
        await api.put(`/users/${currentUser.id}`, {
          nombre_completo: form.nombre_completo,
          correo: form.correo,
          rol_id: form.rol_id,
          activo: form.activo,
        });

        // Reemplazar asignaciones
        await api.post(`/company-users/assign-bulk`, {
          userId: currentUser.id,
          empresas: form.empresas_asignadas,
        });
      }

      setModalOpen(false);
      await loadAll();

    } catch (err) {
      console.error("❌ Error guardando usuario:", err.message);
      alert("No se pudo guardar el usuario.");
    }
  }


  // ======================================================
  // DELETE USER
  // ======================================================

  async function deactivateUser(user) {
    const ok = confirm(`¿Seguro que deseas desactivar a "${user.nombre_completo}"?`);
    if (!ok) return;

    try {
      await api.patch(`/users/${user.id}/state`, { activo: false });
      await loadAll();
    } catch (err) {
      console.error("❌ Error desactivando:", err.message);
    }
  }


  // ======================================================
  // RESET PASSWORD
  // ======================================================

  async function resetPassword(user) {
    const ok = confirm(`¿Resetear contraseña del usuario "${user.nombre_completo}"?`);
    if (!ok) return;

    try {
      const res = await api.post(`/users/${user.id}/reset-password`);
      alert(`Nueva contraseña: ${res.new_password}`);
    } catch (err) {
      console.error("❌ Error reseteando:", err.message);
    }
  }


  // ======================================================
  // FILTER USERS
  // ======================================================

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.nombre_completo.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q)
    );
  });


  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="animate-fade space-y-8">

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Configuración
          </p>

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Usuarios
          </h1>

          <p className="text-sm text-slate-600 mt-1">
            Gestiona usuarios y sus roles dentro del sistema.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
          />

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm"
          >
            <Plus size={16} /> Nuevo usuario
          </button>
        </div>
      </header>


      {/* TABLE */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm p-6">
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Nombre</th>
                <th className="py-2">Correo</th>
                <th className="py-2">Rol</th>
                <th className="py-2">Estado</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-3">{u.nombre_completo}</td>
                  <td>{u.correo}</td>
                  <td>{roles.find(r => r.id === u.rol_id)?.nombre || "—"}</td>
                  <td>
                    {u.activo ? (
                      <span className="text-green-600">Activo</span>
                    ) : (
                      <span className="text-red-600">Inactivo</span>
                    )}
                  </td>

                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => resetPassword(u)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg"
                      >
                        <RefreshCw size={16} />
                      </button>

                      <button
                        onClick={() => deactivateUser(u)}
                        className="p-1.5 hover:bg-red-100 rounded-lg"
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
        title={editMode ? "Editar usuario" : "Nuevo usuario"}
        size="md"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border"
            >
              Cancelar
            </button>
            <button
              onClick={saveUser}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white"
            >
              {editMode ? "Guardar cambios" : "Crear usuario"}
            </button>
          </>
        }
      >
        <div className="space-y-4">

          {/* NOMBRE */}
          <div>
            <label className="text-xs text-slate-500">Nombre completo</label>
            <input
              type="text"
              value={form.nombre_completo}
              onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded-xl"
            />
          </div>

          {/* CORREO */}
          <div>
            <label className="text-xs text-slate-500">Correo</label>
            <input
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded-xl"
            />
          </div>

          {/* CONTRASEÑA (solo crear) */}
          {!editMode && (
            <div>
              <label className="text-xs text-slate-500">Contraseña</label>
              <input
                type="password"
                value={form.contrasena}
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                placeholder="Opcional"
                className="w-full mt-1 px-3 py-2 border rounded-xl"
              />
            </div>
          )}

          {/* ROL */}
          <div>
            <label className="text-xs text-slate-500">Rol</label>
            <select
              value={form.rol_id}
              onChange={(e) => setForm({ ...form, rol_id: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded-xl"
            >
              <option value="">Seleccionar...</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* EMPRESAS ASIGNADAS */}
          <div>
            <label className="text-xs text-slate-500">
              Empresas asignadas
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {companies.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.empresas_asignadas.includes(c.id)}
                    onChange={(e) => {
                      let arr = [...form.empresas_asignadas];

                      if (e.target.checked) arr.push(c.id);
                      else arr = arr.filter((x) => x !== c.id);

                      setForm({ ...form, empresas_asignadas: arr });
                    }}
                  />
                  {c.nombre}
                </label>
              ))}
            </div>
          </div>

          {/* ESTADO */}
          <div>
            <label className="text-xs text-slate-500">Estado</label>
            <select
              value={form.activo ? 1 : 0}
              onChange={(e) =>
                setForm({ ...form, activo: e.target.value === "1" })
              }
              className="w-full mt-1 px-3 py-2 border rounded-xl"
            >
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>

        </div>
      </Modal>
    </div>
  );
}
