import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  change,
  positive = true,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <div className="rounded-lg bg-slate-50 p-1.5">
          <ArrowUpRight
            size={15}
            className="text-slate-400"
          />
        </div>
      </div>

      {/* Value */}
      <h2 className="mt-4 text-[34px] font-bold leading-none tracking-tight text-slate-900">
        {value}
      </h2>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
            positive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {change}
        </span>

        <span className="text-[11px] text-slate-500">
          from last month
        </span>
      </div>
    </div>
  );
}