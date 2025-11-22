// src/components/ui/Button.jsx

import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all px-4 py-2.5 text-sm shadow-sm";

  const variants = {
    primary:
      "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-300/20",
    secondary:
      "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-red-300/20",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-300",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${base}
        ${variants[variant]}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${loading ? "opacity-80 cursor-wait" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Ícono izquierda */}
      {Icon && !loading && <Icon size={18} />}

      {/* Spinner */}
      {loading && (
        <Loader2 size={18} className="animate-spin" />
      )}

      {/* Texto */}
      <span>{loading ? "Cargando..." : children}</span>
    </button>
  );
}
