// src/old/AdminEmpresas.jsx

import { useState } from "react";
import PageTitle from "../components/ui/PageTitle";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Plus, Users } from "lucide-react";

export default function AdminEmpresas() {
  // Fake data (luego conectaremos a tu backend real)
  const [empresas, setEmpresas] = useState([
    {
      id: "1",
      nombre: "Calipha Digital",
      cuit: "20-95917830-6",
      estado: "Activa",
      usuarios: [
        { nombre: "Erick", correo: "erick@calipha.com", rol: "Administrador" },
        { nombre: "Deka", correo: "ventas@deka.com", rol: "Vendedor" },
      ],
    },
    {
      id: "2",
      nombre: "Deka Tienda",
      cuit: "30-48765432-1",
      estado: "Activa",
      usuarios: [
        { nombre: "Ana", correo: "ana@deka.com", rol: "Administrador" },
      ],
    },
  ]);

  // Estados de modales
  const [openEmpresa, setOpenEmpresa] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openNuevoUsuario, setOpenNuevoUsuario] = useState(false);

  // Empresa seleccionada para ver usuarios
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  // Nueva empresa
  const [newEmpresa, setNewEmpresa] = useState({
    nombre: "",
    cuit: "",
  });

  // Nuevo usuario
  const [newUsuario, setNewUsuario] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "Vendedor",
  });

  // Crear empresa
  const crearEmpresa = () => {
    setEmpresas([
      ...empresas,
      {
        id: Date.now().toString(),
        ...newEmpresa,
        estado: "Activa",
        usuarios: [],
      },
    ]);

    setNewEmpresa({ nombre: "", cuit: "" });
    setOpenEmpresa(false);
  };

  // Crear usuario dentro de la empresa seleccionada
  const crearUsuario = () => {
    if (!empresaSeleccionada) return;

    const updated = empresas.map((e) =>
      e.id === empresaSeleccionada.id
        ? { ...e, usuarios: [...e.usuarios, newUsuario] }
        : e
    );

    setEmpresas(updated);

    // Reset
    setNewUsuario({
      nombre: "",
      correo: "",
      contrasena: "",
      rol: "Vendedor",
    });

    setOpenNuevoUsuario(false);
  };

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <PageTitle
        title="Administración de Empresas"
        subtitle="Gestiona empresas, usuarios y roles del sistema"
        breadcrumb={["Sistema", "Empresas"]}
        actions={
          <Button icon={Plus} onClick={() => setOpenEmpresa(true)}>
            Nueva empresa
          </Button>
        }
      />

      {/* CARD PRINCIPAL */}
      <Card title="Empresas registradas" subtitle="Vista general del sistema">
        <Table
          columns={["Nombre", "CUIT", "Estado", "Usuarios"]}
          data={empresas.map((e) => [
            e.nombre,
            e.cuit,
            e.estado,
            `${e.usuarios.length} usuarios`,
          ])}
          actions={(row, index) => (
            <Button
              variant="ghost"
              icon={Users}
              onClick={() => {
                setEmpresaSeleccionada(empresas[index]);
                setOpenUsuarios(true);
              }}
            >
              Ver usuarios
            </Button>
          )}
        />
      </Card>

      {/* MODAL CREAR EMPRESA */}
      <Modal
        isOpen={openEmpresa}
        onClose={() => setOpenEmpresa(false)}
        title="Nueva Empresa"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpenEmpresa(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={crearEmpresa}>
              Crear empresa
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la empresa"
            value={newEmpresa.nombre}
            onChange={(e) =>
              setNewEmpresa({ ...newEmpresa, nombre: e.target.value })
            }
          />
          <Input
            label="CUIT"
            value={newEmpresa.cuit}
            onChange={(e) =>
              setNewEmpresa({ ...newEmpresa, cuit: e.target.value })
            }
          />
        </div>
      </Modal>

      {/* MODAL LISTA DE USUARIOS */}
      <Modal
        isOpen={openUsuarios}
        onClose={() => setOpenUsuarios(false)}
        title={`Usuarios de ${empresaSeleccionada?.nombre}`}
        size="lg"
        footer={
          <Button
            icon={Plus}
            variant="primary"
            onClick={() => setOpenNuevoUsuario(true)}
          >
            Nuevo usuario
          </Button>
        }
      >
        {empresaSeleccionada ? (
          <Table
            compact
            columns={["Nombre", "Correo", "Rol"]}
            data={empresaSeleccionada.usuarios.map((u) => [
              u.nombre,
              u.correo,
              u.rol,
            ])}
            actions={() => <Button variant="ghost">Editar</Button>}
          />
        ) : (
          <p className="text-gray-600">No hay usuarios.</p>
        )}
      </Modal>

      {/* MODAL CREAR USUARIO */}
      <Modal
        isOpen={openNuevoUsuario}
        onClose={() => setOpenNuevoUsuario(false)}
        title="Nuevo Usuario"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpenNuevoUsuario(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={crearUsuario}>
              Crear usuario
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            value={newUsuario.nombre}
            onChange={(e) =>
              setNewUsuario({ ...newUsuario, nombre: e.target.value })
            }
          />

          <Input
            label="Correo electrónico"
            type="email"
            value={newUsuario.correo}
            onChange={(e) =>
              setNewUsuario({ ...newUsuario, correo: e.target.value })
            }
          />

          <Input
            label="Contraseña"
            type="password"
            value={newUsuario.contrasena}
            onChange={(e) =>
              setNewUsuario({ ...newUsuario, contrasena: e.target.value })
            }
          />

          {/* Selección de rol */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={newUsuario.rol}
              onChange={(e) =>
                setNewUsuario({ ...newUsuario, rol: e.target.value })
              }
              className="
                w-full px-3 py-2 mt-1 rounded-xl border border-gray-300
                bg-white/80 backdrop-blur-sm outline-none
                focus:border-purple-500 focus:ring-2 focus:ring-purple-400/40
                text-gray-700 transition
              "
            >
              <option>Administrador</option>
              <option>Vendedor</option>
              <option>Operador</option>
              <option>Invitado</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
