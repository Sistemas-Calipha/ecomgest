// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Importamos el ThemeProvider (MODO OSCURO)
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="animate-fade">
        <App />
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
