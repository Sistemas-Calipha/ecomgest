// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login";
import SelectCompany from "../pages/SelectCompany";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

// Módulos
import VentasIndex from "../pages/Ventas";
import VentasOrdenes from "../pages/Ventas/Ordenes";
import VentasFacturacion from "../pages/Ventas/Facturacion";
import VentasPago from "../pages/Ventas/MetodosPago";

import InventarioIndex from "../pages/Inventario";
import InventarioProductos from "../pages/Inventario/Productos";
import InventarioMovimientos from "../pages/Inventario/Movimientos";
import InventarioAlertas from "../pages/Inventario/Alertas";
import InventarioProveedores from "../pages/Inventario/Proveedores";

import ClientesIndex from "../pages/Clientes";
import ClientesCRM from "../pages/Clientes/CRM";
import ClientesHistorial from "../pages/Clientes/Historial";
import ClientesSegmentos from "../pages/Clientes/Segmentos";

import FinanzasIndex from "../pages/Finanzas";
import FinanzasCaja from "../pages/Finanzas/Caja";
import FinanzasPagos from "../pages/Finanzas/Pagos";
import FinanzasIngresos from "../pages/Finanzas/Ingresos";
import FinanzasCierres from "../pages/Finanzas/Cierres";

import ConfiguracionIndex from "../pages/Configuracion";
import ConfigUsuarios from "../pages/Configuracion/Usuarios";
import ConfigRoles from "../pages/Configuracion/Roles";
import ConfigPermisos from "../pages/Configuracion/Permisos";

export default function AppRouter({
  user,
  pendingUser,
  onLogin,
  onCompanySelected,
  onLogout
}) {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !user && !pendingUser
              ? <Login onLogin={onLogin} />
              : <Navigate to="/select-company" replace />
          }
        />

        {/* SELECT COMPANY – SIEMPRE SE DEBE PASAR POR AQUÍ */}
        <Route
          path="/select-company"
          element={
            pendingUser
              ? (
                <SelectCompany
                  user={pendingUser}
                  onCompanySelected={onCompanySelected}
                />
              )
              : user
              ? <Navigate to="/" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* RUTAS PROTEGIDAS */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <MainLayout onLogout={onLogout} user={user} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard user={user} />} />

          {/* ventas */}
          <Route path="ventas" element={<VentasIndex />} />
          <Route path="ventas/ordenes" element={<VentasOrdenes />} />
          <Route path="ventas/facturacion" element={<VentasFacturacion />} />
          <Route path="ventas/metodos-pago" element={<VentasPago />} />

          {/* inventario */}
          <Route path="inventario" element={<InventarioIndex />} />
          <Route path="inventario/productos" element={<InventarioProductos />} />
          <Route path="inventario/movimientos" element={<InventarioMovimientos />} />
          <Route path="inventario/alertas" element={<InventarioAlertas />} />
          <Route path="inventario/proveedores" element={<InventarioProveedores />} />

          {/* clientes */}
          <Route path="clientes" element={<ClientesIndex />} />
          <Route path="clientes/crm" element={<ClientesCRM />} />
          <Route path="clientes/historial" element={<ClientesHistorial />} />
          <Route path="clientes/segmentos" element={<ClientesSegmentos />} />

          {/* finanzas */}
          <Route path="finanzas" element={<FinanzasIndex />} />
          <Route path="finanzas/caja" element={<FinanzasCaja />} />
          <Route path="finanzas/pagos" element={<FinanzasPagos />} />
          <Route path="finanzas/ingresos" element={<FinanzasIngresos />} />
          <Route path="finanzas/cierres" element={<FinanzasCierres />} />

          {/* configuración */}
          <Route path="configuracion" element={<ConfiguracionIndex />} />
          <Route path="configuracion/usuarios" element={<ConfigUsuarios />} />
          <Route path="configuracion/roles" element={<ConfigRoles />} />
          <Route path="configuracion/permisos" element={<ConfigPermisos />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
