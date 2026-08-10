"use client";

import {
  Clock3,
  FileText,
  ShieldCheck,
  Database,
  CheckCircle2,
} from "lucide-react";

export default function UploadTimeline() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
      {/* Recent Uploads */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Recent Uploads
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest invoice files
            </p>
          </div>

          <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            View All
          </button>
        </div>

        <div className="space-y-3">
          <UploadRow
            name="invoice_jun_2025.csv"
            time="Today • 10:30 AM"
            invoices="24,580"
            status="Completed"
          />

          <UploadRow
            name="invoice_may_2025.csv"
            time="Yesterday • 4:45 PM"
            invoices="18,240"
            status="Completed"
          />

          <UploadRow
            name="invoice_apr_2025.csv"
            time="4 Aug • 9:20 AM"
            invoices="22,310"
            status="Completed"
          />
        </div>
      </div>

      {/* Help Card */}
      <div className="space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Need Help?
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Download a sample CSV and follow the required invoice format.
          </p>

          <button className="mt-5 w-full rounded-xl border border-slate-200 py-3 text-sm font-medium transition hover:bg-slate-50">
            Download CSV Template
          </button>

          <button className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-sm font-medium transition hover:bg-slate-50">
            Import Guidelines
          </button>
        </div>

        <div className="rounded-3xl border border-green-100 bg-green-50 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="text-green-600" size={22} />

            <div>
              <h4 className="font-semibold text-green-800">
                Your data is secure
              </h4>

              <p className="mt-1 text-sm text-green-700">
                All uploaded files are encrypted and processed securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadRow({
  name,
  time,
  invoices,
  status,
}: {
  name: string;
  time: string;
  invoices: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
          <FileText
            size={20}
            className="text-green-600"
          />
        </div>

        <div>
          <p className="font-medium text-slate-900">
            {name}
          </p>

          <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
            <span>{time}</span>

            <span>{invoices} invoices</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          {status}
        </span>

        <Clock3
          size={18}
          className="text-slate-400"
        />
      </div>
    </div>
  );
}