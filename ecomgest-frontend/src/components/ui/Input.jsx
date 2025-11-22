// src/components/ui/Input.jsx

import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      error = "",
      helper = "",
      icon: Icon, // icono opcional
      iconRight: IconRight, // icono opcional derecho
      className = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full flex flex-col ${className}`}>
        
        {/* LABEL */}
        {label && (
          <label className="text-sm font-medium text-gray-700 mb-1 tracking-wide">
            {label}
          </label>
        )}

        {/* WRAPPER */}
        <div
          className={`
            relative flex items-center
            bg-white/80 backdrop-blur-sm
            border rounded-xl transition-all
            shadow-sm
            ${error ? "border-red-400" : "border-gray-300"}
            focus-within:border-purple-500
            focus-within:ring-2 focus-within:ring-purple-400/40
          `}
        >
          {/* Ícono izquierda */}
          {Icon && (
            <Icon
              className="w-5 h-5 text-gray-500 ml-3"
            />
          )}

          {/* INPUT */}
          <input
            ref={ref}
            type={type}
            {...props}
            className={`
              w-full px-3 py-2.5
              bg-transparent outline-none
              text-gray-800
              placeholder-gray-400
              ${Icon ? "pl-2" : ""}
              ${IconRight ? "pr-8" : ""}
            `}
          />

          {/* Ícono derecha */}
          {IconRight && (
            <IconRight className="w-5 h-5 text-gray-500 absolute right-3" />
          )}
        </div>

        {/* Helper text (cuando no hay error) */}
        {helper && !error && (
          <p className="text-xs text-gray-500 mt-1">{helper}</p>
        )}

        {/* Error message */}
        {error && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
