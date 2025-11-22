// src/components/ui/PageTitle.jsx

export default function PageTitle({
  title,
  subtitle,
  breadcrumb = [],
  actions = null,
}) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              {item}
              {index < breadcrumb.length - 1 && (
                <span className="text-gray-400 dark:text-gray-600">/</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Title + Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
