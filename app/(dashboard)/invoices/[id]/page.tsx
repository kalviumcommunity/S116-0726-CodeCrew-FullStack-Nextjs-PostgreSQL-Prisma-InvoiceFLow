"use client";

import {
  ArrowLeft,
  Download,
  FileText,
  Building2,
  CalendarDays,
  Hash,
  Receipt,
  Loader2,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/* =========================================================
   TYPES
========================================================= */

type InvoiceStatus = "PROCESSING" | "MATCH" | "MISMATCH" | "FAILED";

interface Invoice {
  id: string;
  dbId: string;
  invoiceNumber: string;
  vendor: string;
  gstin: string;
  date: string;
  amount: string;
  rawAmount: number;
  gst: string;
  status: InvoiceStatus;
  dbStatus: string;
  errorMessage: string | null;
  source: string;
  uploadId: string;
}

/* =========================================================
   PAGE
========================================================= */

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const invoiceId = typeof params.id === "string" ? params.id : "";

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;

    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setInvoice(data.invoice);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [invoiceId]);

  /* -------------------------------------------------------
     Loading
  ------------------------------------------------------- */
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  /* -------------------------------------------------------
     Not found
  ------------------------------------------------------- */
  if (notFound || !invoice) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <FileText size={24} className="text-slate-400" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-slate-900">
            Invoice not found
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            This invoice does not exist or you don&apos;t have access to it.
          </p>
          <button
            type="button"
            onClick={() => router.push("/invoices")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     Download single invoice as CSV
  ------------------------------------------------------- */
  function handleDownload() {
    if (!invoice) return;
    const headers = ["Invoice Number", "Vendor", "Date", "Amount", "Status", "Source"];
    const row = [
      invoice.invoiceNumber,
      invoice.vendor,
      invoice.date,
      invoice.rawAmount.toString(),
      invoice.status,
      invoice.source,
    ];
    const csv = [headers, row]
      .map((line) => line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /* -------------------------------------------------------
     Status styles
  ------------------------------------------------------- */
  const statusStyles: Record<InvoiceStatus, string> = {
    PROCESSING: "border-blue-100 bg-blue-50 text-blue-700",
    MATCH: "border-emerald-100 bg-emerald-50 text-emerald-700",
    MISMATCH: "border-amber-100 bg-amber-50 text-amber-700",
    FAILED: "border-red-100 bg-red-50 text-red-700",
  };

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */
  return (
    <div className="pb-8">
      {/* TOP BAR */}
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/invoices")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Invoices
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Download size={15} />
          Download CSV
        </button>
      </div>

      {/* INVOICE HEADER */}
      <section className="rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-start justify-between gap-6 px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-blue-50">
              <FileText size={22} strokeWidth={1.8} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="truncate text-[20px] font-semibold tracking-[-0.025em] text-slate-900">
                  {invoice.invoiceNumber}
                </h1>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[invoice.status]}`}
                >
                  {invoice.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{invoice.vendor}</p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Invoice Date
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{invoice.date}</p>
          </div>
        </div>
      </section>

      {/* ERROR MESSAGE (if any) */}
      {invoice.errorMessage && (
        <div className="mt-4 rounded-[14px] border border-red-100 bg-red-50 px-5 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-red-400">
            Processing Error
          </p>
          <p className="mt-1 text-[13px] text-red-700">{invoice.errorMessage}</p>
        </div>
      )}

      {/* INFORMATION GRID */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* INVOICE INFORMATION */}
        <section className="rounded-[20px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <FileText size={16} className="text-slate-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Invoice Information</h2>
          </div>
          <div className="mt-5">
            <InfoRow icon={<Hash size={15} />} label="Invoice Number" value={invoice.invoiceNumber} />
            <InfoRow icon={<Building2 size={15} />} label="Vendor" value={invoice.vendor} />
            <InfoRow icon={<CalendarDays size={15} />} label="Invoice Date" value={invoice.date} />
          </div>
        </section>

        {/* SOURCE INFORMATION */}
        <section className="rounded-[20px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Receipt size={16} className="text-slate-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Source Information</h2>
          </div>
          <div className="mt-5">
            <InfoRow icon={<FileText size={15} />} label="Source CSV" value={invoice.source} />
            <InfoRow
              icon={<Receipt size={15} />}
              label="Processing Status"
              value={invoice.dbStatus}
            />
          </div>
        </section>
      </div>

      {/* FINANCIAL SUMMARY */}
      <section className="mt-4 rounded-[20px] border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <Receipt size={16} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Financial Summary</h2>
            <p className="mt-0.5 text-xs text-slate-500">Invoice amount details.</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <AmountCard label="Invoice Amount" value={invoice.amount} />
          <AmountCard label="Total Amount" value={invoice.amount} highlighted />
        </div>
      </section>

      {/* BOTTOM ACTIONS */}
      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => invoice.uploadId ? router.push(`/history/${invoice.uploadId}`) : router.push("/history")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={15} />
          View Upload
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Download size={15} />
          Download CSV
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 py-3 last:border-b-0">
      <div className="flex items-center gap-2.5">
        <span className="text-slate-400">{icon}</span>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <span
        className="max-w-[55%] truncate text-right text-xs font-semibold text-slate-800"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function AmountCard({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] border p-4 ${
        highlighted ? "border-blue-100 bg-blue-50/50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p
        className={`mt-2 text-lg font-semibold tracking-[-0.02em] ${
          highlighted ? "text-blue-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
