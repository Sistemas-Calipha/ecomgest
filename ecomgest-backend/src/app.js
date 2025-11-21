// ======================================================================
//  CONFIGURACIÓN PRINCIPAL DEL SERVIDOR EXPRESS
// ======================================================================

// -------------------------------
// IMPORTS
// -------------------------------
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Rutas API
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import permissionsRoutes from "./routes/permissions.routes.js";
import rolePermissionsRoutes from "./routes/rolePermissions.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import companiesRoutes from "./routes/companies.routes.js";
import paymentMethodsRoutes from "./routes/paymentMethods.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

// -------------------------------
// __dirname para ES Modules
// -------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------
// APP
// -------------------------------
const app = express();

// ======================================================================
//  CORS (Optimizado / Seguro / Flexible)
// ======================================================================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======================================================================
//  PARSERS
// ======================================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================================
//  MIDDLEWARE GLOBAL PARA METADATA DE REQUEST
//  (IP, User-Agent, Ruta, Método) → usado por auditoría
// ======================================================================
app.use((req, res, next) => {
  req._meta = {
    ip:
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      null,
    user_agent: req.headers["user-agent"] || "unknown",
    ruta: req.originalUrl,
    metodo: req.method,
  };
  next();
});

// ======================================================================
//  RUTAS API (ORGANIZADAS POR MÓDULO)
// ======================================================================
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/roles", rolesRoutes);
app.use("/permissions", permissionsRoutes);
app.use("/role-permissions", rolePermissionsRoutes);
app.use("/audit", auditRoutes);
app.use("/companies", companiesRoutes);
app.use("/payment-methods", paymentMethodsRoutes);
app.use("/reports", reportsRoutes);

// ======================================================================
//  EXPORT
// ======================================================================
export default app;
