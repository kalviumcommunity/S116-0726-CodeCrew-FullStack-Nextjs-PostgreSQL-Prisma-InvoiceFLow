"use client";

import {
  X,
  FileText,
  Building2,
  Calendar,
  BadgeIndianRupee,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Invoice } from "@/app/(dashboard)/invoices/page";

interface InvoiceDrawerProps {
  invoice: Invoice;
  onClose: () => void;
}

export default function InvoiceDrawer({
  invoice,
  onClose,
}: InvoiceDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-[430px] flex-col border-l border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Invoice Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {invoice.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X
              size={20}
              className="text-slate-500"
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">

          {/* Status */}
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              invoice.status === "MATCH"
                ? "bg-emerald-100 text-emerald-700"
                : invoice.status === "MISMATCH"
                ? "bg-amber-100 text-amber-700"
                : invoice.status === "FAILED"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {invoice.status}
          </span>

          {/* Information */}
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-5 font-semibold text-slate-900">
              Invoice Information
            </h3>

            <InfoRow
              icon={<FileText size={16} />}
              label="Invoice No"
              value={invoice.id}
            />

            <InfoRow
              icon={<Building2 size={16} />}
              label="Vendor"
              value={invoice.vendor}
            />

            <InfoRow
              icon={<Calendar size={16} />}
              label="Invoice Date"
              value={invoice.date}
            />

            <InfoRow
              icon={<FileText size={16} />}
              label="GSTIN"
              value={invoice.gstin}
            />

            <InfoRow
              icon={<FileText size={16} />}
              label="Source"
              value={invoice.source}
            />
          </div>

          {/* Financial Summary */}
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-5 font-semibold text-slate-900">
              Financial Summary
            </h3>

            <AmountRow
              label="Invoice Amount"
              value={invoice.amount}
            />

            <AmountRow
              label="GST"
              value={invoice.gst}
            />

            <AmountRow
              label="Total"
              value={invoice.amount}
              bold
            />
          </div>

        </div>

        {/* Footer */}
        <div className="space-y-3 border-t border-slate-200 p-6">

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Download size={17} />
            Download PDF
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <Pencil size={17} />
            Edit Invoice
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50">
            <Trash2 size={17} />
            Delete Invoice
          </button>

        </div>

      </aside>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </div>

      <span className="text-sm font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}

function AmountRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className={`text-sm ${
          bold
            ? "font-bold text-slate-900"
            : "font-medium text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}