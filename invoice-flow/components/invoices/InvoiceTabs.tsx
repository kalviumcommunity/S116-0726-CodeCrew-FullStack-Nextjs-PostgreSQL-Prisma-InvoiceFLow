interface InvoiceTabsProps {
    activeTab: "all" | "mismatch" | "failed";
    onChange: (value: "all" | "mismatch" | "failed") => void;
    counts: {
        all: number;
        mismatch: number;
        failed: number;
    };
}

const tabs = [
    { id: "all", label: "Invoice Results", countKey: "all" as const },
    { id: "mismatch", label: "Mismatch", countKey: "mismatch" as const },
    { id: "failed", label: "Failed", countKey: "failed" as const },
];

export function InvoiceTabs({ activeTab, onChange, counts }: InvoiceTabsProps) {
    return (
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id as "all" | "mismatch" | "failed")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${isActive
                                ? "bg-violet-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-white hover:text-slate-900"
                            }`}
                    >
                        {tab.label} {counts[tab.countKey]}
                    </button>
                );
            })}
        </div>
    );
}
