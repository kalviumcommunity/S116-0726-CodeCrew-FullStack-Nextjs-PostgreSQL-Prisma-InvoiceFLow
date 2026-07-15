import type { LucideIcon } from "lucide-react";

interface InvoiceSummaryCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    accent: "violet" | "green" | "orange" | "red";
}

const accentStyles = {
    violet: "bg-violet-50 text-violet-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-amber-50 text-amber-600",
    red: "bg-rose-50 text-rose-600",
};

export function InvoiceSummaryCard({ title, value, icon: Icon, accent }: InvoiceSummaryCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
                </div>
                <div className={`rounded-xl p-3 ${accentStyles[accent]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}
