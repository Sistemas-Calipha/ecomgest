// src/config/supabase.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// -----------------------------------------------------
// LOAD .ENV BEFORE ANYTHING ELSE
// -----------------------------------------------------
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// -----------------------------------------------------
// VALIDATION
// -----------------------------------------------------
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ ERROR: Missing Supabase environment variables.");
  console.error("SUPABASE_URL:", SUPABASE_URL);
  console.error(
    "SUPABASE_KEY:",
    SUPABASE_KEY ? "***LOADED***" : "***MISSING***"
  );
  throw new Error("Supabase configuration error: missing environment variables.");
}

// -----------------------------------------------------
// INITIALIZE CLIENT
// -----------------------------------------------------
console.log("🔵 Supabase configuration loaded successfully.");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// -----------------------------------------------------
// EXPORT DEFAULT (CORRECT FORM FOR ESM)
// -----------------------------------------------------
export default supabase;
