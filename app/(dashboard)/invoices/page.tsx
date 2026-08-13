"use client";

import { useEffect, useMemo, useState } from "react";

import InvoiceToolbar from "@/components/invoice/InvoiceToolbar";
import InvoiceTable from "@/components/invoice/InvoiceTable";

export type InvoiceStatus = "PROCESSING" | "MATCH" | "MISMATCH" | "FAILED";
export type StatusFilter = "All" | "PROCESSING" | "MATCH" | "MISMATCH" | "FAILED";
export type DateFilter = "All Dates" | "Last 7 Days" | "Last 30 Days" | "Custom Range";
export type SortFilter = "Newest First" | "Oldest First";

export interface Invoice {
  id: string;
  dbId?: string;
  invoiceNumber?: string;
  vendor: string;
  gstin: string;
  date: string;
  amount: string;
  gst: string;
  status: InvoiceStatus;
  source: string;
  gstType?: "IGST" | "CGST + SGST";
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [dateRange, setDateRange] = useState<DateFilter>("All Dates");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [sort, setSort] = useState<SortFilter>("Newest First");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(50);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchInvoices() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          search: search.trim(),
          status,
          sort,
        });

        const res = await fetch(`/api/invoices?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, [page, limit, search, status, sort, refreshTrigger]);

  const filteredInvoices = invoices;

  function handleCustomRange(from: string, to: string) {
    setCustomFrom(from);
    setCustomTo(to);
    setDateRange("Custom Range");
  }

  function handleDeleteInvoice(invoice: Invoice) {
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleExport() {
    if (filteredInvoices.length === 0) return;

    const headers = [
      "Invoice",
      "Vendor",
      "GSTIN",
      "Date",
      "Amount",
      "GST",
      "Status",
      "Source",
    ];

    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber || inv.id,
      inv.vendor,
      inv.gstin,
      inv.date,
      inv.amount,
      inv.gst,
      inv.status,
      inv.source,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <section className="mb-3">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-slate-900">
          Invoices
        </h1>
        <p className="text-xs text-slate-500">
          View, search and manage all extracted invoices.
        </p>
      </section>

      <InvoiceToolbar
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        status={status}
        onStatusChange={(val) => { setStatus(val); setPage(1); }}
        dateRange={dateRange}
        onDateRangeChange={(value) => {
          setDateRange(value);
          if (value !== "Custom Range") {
            setCustomFrom("");
            setCustomTo("");
          }
        }}
        customFrom={customFrom}
        customTo={customTo}
        onCustomRange={handleCustomRange}
        sort={sort}
        onSortChange={(val) => { setSort(val); setPage(1); }}
        onExport={handleExport}
      />

      <InvoiceTable
        invoices={filteredInvoices}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onDeleteInvoice={handleDeleteInvoice}
      />
    </div>
  );
}