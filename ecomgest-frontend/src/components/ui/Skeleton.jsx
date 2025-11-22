// src/components/ui/Skeleton.jsx

export default function Skeleton({
  width = "100%",
  height = "20px",
  className = "",
  rounded = "rounded-md"
}) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-gray-200 
        ${rounded}
        ${className}
      `}
      style={{ width, height }}
    >
      <div
        className="
          absolute inset-0 
          animate-skeleton-shimmer
          bg-gradient-to-r
          from-transparent via-white/50 to-transparent
        "
      ></div>
    </div>
  );
}
