"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
    CircleCheck,
    CircleX,
    Download,
    FileSpreadsheet,
    TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceSearch } from "@/components/invoices/InvoiceSearch";
import { InvoiceSummaryCard } from "@/components/invoices/InvoiceSummaryCard";
import { InvoiceTabs } from "@/components/invoices/InvoiceTabs";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { invoiceRows } from "@/components/invoices/data";

const summaryCards = [
    { title: "Total Invoices", value: 1250, icon: FileSpreadsheet, accent: "violet" as const },
    { title: "Successful", value: 1198, icon: CircleCheck, accent: "green" as const },
    { title: "Mismatch", value: 32, icon: TriangleAlert, accent: "orange" as const },
    { title: "Failed", value: 20, icon: CircleX, accent: "red" as const },
];

function InvoiceResultsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <Skeleton className="mb-3 h-4 w-24" />
                            <Skeleton className="mb-2 h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardContent className="space-y-3 p-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export default function InvoicesResultsPage() {
    const [activeTab, setActiveTab] = useState<"all" | "mismatch" | "failed">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState(false);
    const [loading] = useState(false);

    const filteredInvoices = useMemo(() => {
        let rows = invoiceRows;

        if (activeTab === "mismatch") {
            rows = rows.filter((invoice) => invoice.status === "MISMATCH");
        } else if (activeTab === "failed") {
            rows = rows.filter((invoice) => invoice.status === "FAILED");
        }

        if (filterActive) {
            rows = rows.filter((invoice) => invoice.status !== "MATCH");
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            rows = rows.filter((invoice) => {
                return (
                    invoice.invoiceNumber.toLowerCase().includes(term) ||
                    invoice.customerName.toLowerCase().includes(term)
                );
            });
        }

        return rows;
    }, [activeTab, searchTerm, filterActive]);

    if (loading) {
        return (
            <AppShell title="Invoice Results" subtitle="Review validation outcomes and invoice-level status for the selected upload.">
                <InvoiceResultsSkeleton />
            </AppShell>
        );
    }

    return (
        <AppShell title="Invoice Results" subtitle="Review validation outcomes and invoice-level status for the selected upload.">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <Link href="/dashboard" className="hover:text-violet-600">
                                Dashboard
                            </Link>
                            <span>/</span>
                            <Link href="/history" className="hover:text-violet-600">
                                Upload History
                            </Link>
                            <span>/</span>
                            <span className="text-slate-700">July_Invoices.csv</span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                July_Invoices.csv
                            </h1>
                            <Badge variant="success">Completed</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                            <span>Uploaded on: 12 Jul 2024, 10:30 AM</span>
                            <span>Total Invoices: 1,250</span>
                            <span>File Size: 8.4 MB</span>
                        </div>
                    </div>
                    <Button className="bg-violet-600 hover:bg-violet-700">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <InvoiceSummaryCard
                                key={card.title}
                                title={card.title}
                                value={card.value}
                                icon={Icon}
                                accent={card.accent}
                            />
                        );
                    })}
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-xl">Invoice Results</CardTitle>
                        <InvoiceTabs
                            activeTab={activeTab}
                            onChange={setActiveTab}
                            counts={{
                                all: invoiceRows.length,
                                mismatch: invoiceRows.filter((invoice) => invoice.status === "MISMATCH").length,
                                failed: invoiceRows.filter((invoice) => invoice.status === "FAILED").length,
                            }}
                        />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <InvoiceSearch
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                filterActive={filterActive}
                                onFilterToggle={() => setFilterActive((prev) => !prev)}
                            />
                        </div>

                        <InvoiceTable invoices={filteredInvoices} />

                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <p>Showing 1–{Math.min(filteredInvoices.length, 10)} of {filteredInvoices.length} results</p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    Previous
                                </Button>
                                <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                                    1
                                </Button>
                                <Button variant="outline" size="sm">
                                    2
                                </Button>
                                <Button variant="outline" size="sm">
                                    3
                                </Button>
                                <Button variant="outline" size="sm">
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
