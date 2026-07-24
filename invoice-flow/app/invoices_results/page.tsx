"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CircleCheck,
    CircleX,
    Download,
    FileSpreadsheet,
    TriangleAlert,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceSearch } from "@/components/invoices/InvoiceSearch";
import { InvoiceSummaryCard } from "@/components/invoices/InvoiceSummaryCard";
import { InvoiceTabs } from "@/components/invoices/InvoiceTabs";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import type { InvoiceRecord } from "@/components/invoices/data";

interface UploadStatus {
    id: string;
    fileName: string;
    uploadDate: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    totalRows: number;
    processedRows: number;
    matchCount: number;
    mismatchCount: number;
    failedCount: number;
    progressPercent: number;
}

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
    const searchParams = useSearchParams();
    const uploadId = searchParams.get("uploadId");

    const [activeTab, setActiveTab] = useState<"all" | "mismatch" | "failed">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState(false);

    const [upload, setUpload] = useState<UploadStatus | null>(null);
    const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!uploadId) {
            setLoading(false);
            setError("No upload selected. Go to Upload and process a CSV first.");
            return;
        }

        let cancelled = false;

        async function fetchStatus() {
            try {
                const res = await fetch(`/api/uploads/${uploadId}`);
                const data = await res.json();
                if (cancelled) return;

                if (!res.ok || !data.success) {
                    setError(data.error ?? "Could not load this upload.");
                    return;
                }

                setUpload(data.upload);
                setLoading(false);

                // Keep refreshing the invoice list while still processing,
                // and once when it finishes, so remarks/status show up.
                await fetchInvoices();

                if (data.upload.status !== "PROCESSING" && data.upload.status !== "PENDING") {
                    if (pollRef.current) clearInterval(pollRef.current);
                }
            } catch (err) {
                if (!cancelled) setError("Could not reach the server.");
            }
        }

        async function fetchInvoices() {
            try {
                const res = await fetch(`/api/uploads/${uploadId}/invoices`);
                const data = await res.json();
                if (!cancelled && res.ok && data.success) {
                    setInvoices(data.invoices);
                }
            } catch {
                // non-fatal, next poll will retry
            }
        }

        fetchStatus();
        pollRef.current = setInterval(fetchStatus, 1500);

        return () => {
            cancelled = true;
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [uploadId]);

    const filteredInvoices = useMemo(() => {
        let rows = invoices;

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
            rows = rows.filter(
                (invoice) =>
                    invoice.invoiceNumber.toLowerCase().includes(term) ||
                    invoice.customerName.toLowerCase().includes(term)
            );
        }

        return rows;
    }, [invoices, activeTab, searchTerm, filterActive]);

    const summaryCards = [
        { title: "Total Invoices", value: upload?.totalRows ?? 0, icon: FileSpreadsheet, accent: "violet" as const },
        { title: "Successful (Match)", value: upload?.matchCount ?? 0, icon: CircleCheck, accent: "green" as const },
        { title: "Mismatch", value: upload?.mismatchCount ?? 0, icon: TriangleAlert, accent: "orange" as const },
        { title: "Failed", value: upload?.failedCount ?? 0, icon: CircleX, accent: "red" as const },
    ];

    if (loading) {
        return (
            <AppShell title="Invoice Results" subtitle="Review validation outcomes and invoice-level status for the selected upload.">
                <InvoiceResultsSkeleton />
            </AppShell>
        );
    }

    if (error || !upload) {
        return (
            <AppShell title="Invoice Results" subtitle="Review validation outcomes and invoice-level status for the selected upload.">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 text-sm text-slate-600">
                        {error ?? "Upload not found."}{" "}
                        <Link href="/upload" className="text-violet-600 hover:underline">
                            Go to Upload
                        </Link>
                    </CardContent>
                </Card>
            </AppShell>
        );
    }

    const isProcessing = upload.status === "PROCESSING" || upload.status === "PENDING";

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
                            <span className="text-slate-700">{upload.fileName}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{upload.fileName}</h1>
                            <Badge variant={isProcessing ? "warning" : upload.status === "FAILED" ? "destructive" : "success"}>
                                {upload.status}
                            </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                            <span>Uploaded on: {new Date(upload.uploadDate).toLocaleString()}</span>
                            <span>Total Invoices: {upload.totalRows}</span>
                        </div>
                    </div>
                    <Button className="bg-violet-600 hover:bg-violet-700" disabled={isProcessing}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </div>

                {isProcessing ? (
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="space-y-3 p-6">
                            <div className="flex items-center justify-between text-sm text-slate-600">
                                <span>Processing invoices…</span>
                                <span className="font-semibold text-slate-900">{upload.progressPercent}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all"
                                    style={{ width: `${upload.progressPercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500">
                                {upload.processedRows} of {upload.totalRows} rows processed
                            </p>
                        </CardContent>
                    </Card>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <InvoiceSummaryCard key={card.title} title={card.title} value={card.value} icon={Icon} accent={card.accent} />
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
                                all: invoices.length,
                                mismatch: invoices.filter((invoice) => invoice.status === "MISMATCH").length,
                                failed: invoices.filter((invoice) => invoice.status === "FAILED").length,
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
                            <p>
                                Showing {filteredInvoices.length === 0 ? 0 : 1}–{filteredInvoices.length} of {filteredInvoices.length} results
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
