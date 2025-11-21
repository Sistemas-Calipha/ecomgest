// ======================================================================
//  src/config/dotenv.js
//  Cargar variables de entorno desde .env usando dotenv
// ======================================================================

import dotenv from "dotenv";

dotenv.config();

console.log("🟣 dotenv cargado → JWT_SECRET:", process.env.JWT_SECRET || "NO DEFINIDO");
