// src/components/ui/Table.jsx

import { motion } from "framer-motion";
import Skeleton from "./Skeleton";

export default function Table({
  columns = [],
  data = [],
  loading = false,
  compact = false,
  actions = null, // acciones por fila opcionales
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        w-full bg-white/80 backdrop-blur-sm
        border border-gray-200 rounded-2xl
        shadow-sm overflow-hidden
      "
    >
      <table className="w-full text-left">
        
        {/* ===== HEADER ===== */}
        <thead className="bg-gray-50/60 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`
                  px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600
                  ${compact ? "py-2" : ""}
                `}
              >
                {col}
              </th>
            ))}

            {actions && (
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 text-right">
                Acciones
              </th>
            )}
          </tr>
        </thead>

        {/* ===== BODY ===== */}
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {columns.map((_, index) => (
                  <td key={index} className="px-4 py-3">
                    <Skeleton height="18px" />
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right">
                    <Skeleton width="60px" height="18px" />
                  </td>
                )}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="py-8 text-center text-gray-500"
              >
                No hay datos para mostrar.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="
                  border-b border-gray-100
                  hover:bg-gray-50/70 transition
                "
              >
                {row.map((cell, index) => (
                  <td
                    key={index}
                    className={`
                      px-4 py-3 text-gray-700 
                      ${compact ? "py-2" : ""}
                    `}
                  >
                    {cell}
                  </td>
                ))}

                {actions && (
                  <td className="px-4 py-3 text-right">
                    {actions(row, i)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
