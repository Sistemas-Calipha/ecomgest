// src/components/ui/Button.jsx

export default function Button({
  children,
  icon: Icon,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all select-none";

  const variants = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white shadow-sm active:scale-[0.98]",
    secondary:
      "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600",
    ghost:
      "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/40",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
