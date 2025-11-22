// src/components/KPIBox.jsx

import { TrendingUp, TrendingDown } from "lucide-react";
import Skeleton from "./ui/Skeleton";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function KPIBox({
  title,
  value,
  subtitle,
  trend = [],
  positive = true,
  loading,
}) {
  const fadeIn = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className="
        bg-white/90 backdrop-blur-sm
        border border-gray-100 shadow-sm
        hover:shadow-md hover:border-gray-200
        transition-all duration-300
        rounded-2xl p-5
        flex flex-col gap-2
      "
    >

      {/* HEADER */}
      <div className="flex justify-between items-center">
        {loading ? (
          <Skeleton width="60%" height="16px" />
        ) : (
          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </p>
        )}

        {!loading && (
          positive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )
        )}
      </div>

      {/* VALUE */}
      {loading ? (
        <Skeleton width="40%" height="28px" className="my-2" />
      ) : (
        <p className="text-3xl font-bold text-gray-900 leading-tight">
          {value}
        </p>
      )}

      {/* SUBTITLE */}
      {loading ? (
        <Skeleton width="70%" height="14px" />
      ) : (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}

      {/* MINI CHART */}
      <div className="mt-1 h-10">
        {loading ? (
          <Skeleton width="100%" height="32px" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={positive ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                dot={false}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </motion.div>
  );
}
