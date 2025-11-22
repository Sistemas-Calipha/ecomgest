// src/components/ui/Modal.jsx

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title = "",
  children,
  footer = null,
  closeOnBackdrop = true,
  size = "md", // sm | md | lg | xl
}) {
  // Cerrar con tecla ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Ancho según tamaño
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  // Si no está abierto, no renderizar nada
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed inset-0 z-50 
            flex items-center justify-center
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div
            className="
              absolute inset-0 
              bg-black/40 backdrop-blur-sm
            "
            onClick={() => {
              if (closeOnBackdrop) onClose?.();
            }}
          />

          {/* Contenedor del modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
              relative z-10
              w-full ${sizes[size]}
              bg-white/95 backdrop-blur-xl
              rounded-2xl shadow-2xl border border-gray-200
              max-h-[90vh] flex flex-col
            `}
          >
            {/* HEADER */}
            {(title || onClose) && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <div>
                  {title && (
                    <h2 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h2>
                  )}
                </div>

                {onClose && (
                  <button
                    onClick={onClose}
                    className="
                      w-8 h-8 flex items-center justify-center
                      rounded-full hover:bg-gray-100
                      text-gray-500 hover:text-gray-800
                      transition
                    "
                    type="button"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* BODY */}
            <div className="px-5 py-4 overflow-y-auto text-gray-700">
              {children}
            </div>

            {/* FOOTER */}
            {footer && (
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50/80">
                <div className="flex justify-end gap-2">
                  {footer}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
