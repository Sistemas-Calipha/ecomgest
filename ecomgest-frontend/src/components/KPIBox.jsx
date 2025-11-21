// src/components/KPIBox.jsx
export default function KPIBox({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-1 border border-gray-100">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
