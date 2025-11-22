// src/components/ui/Card.jsx

export default function Card({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-2xl p-6 shadow-sm
        bg-white/80 dark:bg-gray-800/60
        border border-gray-200 dark:border-gray-700
        backdrop-blur-sm
        transition-colors
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
