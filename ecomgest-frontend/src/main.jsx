// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Render principal
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="animate-fade">
      <App />
    </div>
  </React.StrictMode>
);
