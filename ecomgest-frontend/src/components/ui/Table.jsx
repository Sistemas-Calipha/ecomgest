// src/components/ui/Table.jsx

export default function Table({
  columns = [],
  data = [],
  actions = null,
  compact = false,
}) {
  return (
    <div
      className="
        overflow-x-auto rounded-xl border
        border-gray-200 dark:border-gray-700
        bg-white/70 dark:bg-gray-800/60
        backdrop-blur-sm shadow-sm transition
      "
    >
      <table className="w-full text-left border-collapse">
        {/* HEADER */}
        <thead
          className="
            bg-gray-100 dark:bg-gray-800
            border-b border-gray-200 dark:border-gray-700
          "
        >
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`
                  px-4 py-3 text-sm font-semibold
                  text-gray-700 dark:text-gray-300
                  ${compact ? "py-2" : ""}
                `}
              >
                {col}
              </th>
            ))}

            {actions && (
              <th
                className="
                  px-4 py-3 text-sm font-semibold
                  text-gray-700 dark:text-gray-300
                  text-right
                "
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="
                  text-center py-6 text-gray-500 dark:text-gray-400
                "
              >
                No hay datos disponibles.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="
                  border-b border-gray-200 dark:border-gray-700
                  hover:bg-gray-50 dark:hover:bg-gray-700/40
                  transition
                "
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`
                      px-4 py-3 text-sm text-gray-800 dark:text-gray-200
                      ${compact ? "py-2" : ""}
                    `}
                  >
                    {cell}
                  </td>
                ))}

                {actions && (
                  <td
                    className="
                      px-4 py-3 text-sm 
                      text-right
                    "
                  >
                    {actions(row, rowIndex)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
