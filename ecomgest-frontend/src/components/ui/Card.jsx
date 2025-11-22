// src/components/ui/Card.jsx

import { motion } from "framer-motion";

export default function Card({
  children,
  title = "",
  subtitle = "",
  footer = null,
  variant = "default", // default | outline | elevated
  className = "",
}) {
  const baseStyle = `
    w-full rounded-2xl p-5 transition-all duration-300
    backdrop-blur-sm bg-white/70
  `;

  const variants = {
    default: `
      shadow-sm hover:shadow-md
      border border-gray-200
    `,
    outline: `
      border-2 border-gray-300
      bg-white/60
      shadow-none
    `,
    elevated: `
      shadow-lg hover:shadow-xl
      bg-white
      border border-gray-100
    `,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {/* HEADER */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 -mt-1">{subtitle}</p>
          )}
        </div>
      )}

      {/* CONTENIDO */}
      <div className="text-gray-700">{children}</div>

      {/* FOOTER */}
      {footer && (
        <div className="mt-5 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
