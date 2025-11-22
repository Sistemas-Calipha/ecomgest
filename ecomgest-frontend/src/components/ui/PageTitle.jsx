// src/components/ui/PageTitle.jsx

import { motion } from "framer-motion";

export default function PageTitle({
  title,
  subtitle = "",
  breadcrumb = [],
  actions = null, // botones u otras acciones
  className = "",
}) {
  return (
    <motion.div
      className={`w-full mb-8 flex flex-col gap-3 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* ======== BREADCRUMB ======== */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              {item}
              {index < breadcrumb.length - 1 && (
                <span className="text-gray-400">/</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* ======== TITLE + ACTIONS ======== */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Acciones: botones, filtros, etc. */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </motion.div>
  );
}
