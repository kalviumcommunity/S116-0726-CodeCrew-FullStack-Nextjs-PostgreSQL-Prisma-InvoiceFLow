"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

type SettingsColor =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "yellow"
  | "cyan";

interface SettingsCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: SettingsColor;
  onClick?: () => void; // ⭐ Added
}

const themes: Record<
  SettingsColor,
  {
    bg: string;
    icon: string;
  }
> = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
  },
  green: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  purple: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
  },
  yellow: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
  },
};

export default function SettingsCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}: SettingsCardProps) {
  const theme = themes[color];

  return (
    <button
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-5
        py-4
        text-left
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:border-slate-300
        hover:shadow-md
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${theme.bg}`}
          >
            <Icon
              size={22}
              strokeWidth={2}
              className={theme.icon}
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <ChevronRight
          size={20}
          strokeWidth={2}
          className="text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-600"
        />
      </div>
    </button>
  );
}