import * as React from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "success" | "warning" | "destructive";
}

const badgeVariants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    destructive: "bg-rose-100 text-rose-700",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", badgeVariants[variant], className)} {...props} />;
}

export { Badge };
