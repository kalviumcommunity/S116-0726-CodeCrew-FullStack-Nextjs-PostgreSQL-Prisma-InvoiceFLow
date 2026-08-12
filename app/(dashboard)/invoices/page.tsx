"use client";

import { useEffect, useMemo, useState } from "react";

import InvoiceToolbar from "@/components/invoice/InvoiceToolbar";
import InvoiceTable from "@/components/invoice/InvoiceTable";

export type InvoiceStatus = "Matched" | "Pending" | "Error";
export type StatusFilter = "All" | "Matched" | "Pending" | "Error";
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

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/invoices");
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices || []);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = invoices.filter((invoice) => {
      const matchesSearch =
        query === "" ||
        (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(query)) ||
        invoice.id.toLowerCase().includes(query) ||
        invoice.vendor.toLowerCase().includes(query) ||
        invoice.source.toLowerCase().includes(query);

      const matchesStatus = status === "All" || invoice.status === status;

      return matchesSearch && matchesStatus;
    });

    // Apply date range filter
    if (dateRange !== "All Dates") {
      const now = new Date();
      let fromDate: Date | null = null;
      let toDate: Date | null = null;

      if (dateRange === "Last 7 Days") {
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "Last 30 Days") {
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "Custom Range" && customFrom && customTo) {
        fromDate = new Date(customFrom);
        toDate = new Date(customTo);
        toDate.setHours(23, 59, 59, 999);
      }

      if (fromDate) {
        result = result.filter((inv) => {
          // invoiceDate is an ISO string returned from the API
          const invDate = new Date((inv as any).invoiceDate || inv.date);
          if (toDate) return invDate >= fromDate! && invDate <= toDate;
          return invDate >= fromDate!;
        });
      }
    }

    // Apply sort
    result = [...result].sort((a, b) => {
      const dateA = new Date((a as any).invoiceDate || a.date).getTime();
      const dateB = new Date((b as any).invoiceDate || b.date).getTime();
      return sort === "Oldest First" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [invoices, search, status, sort, dateRange, customFrom, customTo]);

  function handleCustomRange(from: string, to: string) {
    setCustomFrom(from);
    setCustomTo(to);
    setDateRange("Custom Range");
  }

  function handleDeleteInvoice(invoice: Invoice) {
    setInvoices((current) => current.filter((item) => item.id !== invoice.id));
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
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
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
        onSortChange={setSort}
        onExport={handleExport}
      />

      <InvoiceTable
        invoices={filteredInvoices}
        onDeleteInvoice={handleDeleteInvoice}
      />
    </div>
  );
}