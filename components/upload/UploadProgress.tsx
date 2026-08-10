"use client";

import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function UploadProgress() {
  return (
    <div className="flex min-h-[540px] flex-col rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h1 className="text-[21px] font-semibold tracking-[-0.025em] text-slate-900">
            Processing Upload
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Invoice validation in progress
          </p>
        </div>

        <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-2 text-[12px] font-semibold text-blue-700">
          <Loader2
            size={14}
            strokeWidth={2}
            className="animate-spin"
          />
          Processing
        </span>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="flex min-h-0 flex-1 flex-col px-6 py-5">
        {/* FILE */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-emerald-50 text-emerald-600">
            <FileText
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-semibold tracking-[-0.015em] text-slate-900">
              invoices_jun_2025.csv
            </h3>

            <p className="mt-1 text-[13px] text-slate-500">
              Uploaded today · 24,580 invoices
            </p>
          </div>
        </div>

        {/* =================================================
            PROGRESS
        ================================================= */}
        <div className="mt-7">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-600">
              Processing invoices
            </span>

            <span className="text-[13px] font-semibold text-slate-900">
              58%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[58%] rounded-full bg-blue-600 transition-all duration-700" />
          </div>

          <div className="mt-2 flex items-center justify-between text-[12px] text-slate-400">
            <span>14,250 / 24,580 processed</span>

            <span>10,330 remaining</span>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================= */}
        <div className="mt-7 grid grid-cols-4 overflow-hidden rounded-[14px] border border-slate-200">
          <Stat
            title="Processed"
            value="14,250"
            color="text-blue-600"
          />

          <Stat
            title="Success"
            value="13,720"
            color="text-emerald-600"
          />

          <Stat
            title="Failed"
            value="530"
            color="text-red-600"
          />

          <Stat
            title="ETA"
            value="2m 18s"
            color="text-slate-900"
            last
          />
        </div>

        {/* =================================================
            STATUS AREA
        ================================================= */}
        <div className="mt-5 flex flex-1 items-end">
          <div className="flex w-full items-center justify-between rounded-[14px] border border-slate-100 bg-slate-50 px-4 py-3.5">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  strokeWidth={1.8}
                  className="text-emerald-500"
                />

                <span className="text-[13px] font-medium text-slate-600">
                  Valid invoices
                </span>
              </div>

              <div className="h-4 w-px bg-slate-200" />

              <div className="flex items-center gap-2">
                <XCircle
                  size={16}
                  strokeWidth={1.8}
                  className="text-red-500"
                />

                <span className="text-[13px] font-medium text-slate-600">
                  GST mismatch found
                </span>
              </div>
            </div>

            <button
              type="button"
              className="
                flex
                h-9
                items-center
                rounded-[9px]
                bg-blue-600
                px-4
                text-[12px]
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                active:scale-[0.98]
              "
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   STAT
============================================================= */

function Stat({
  title,
  value,
  color,
  last = false,
}: {
  title: string;
  value: string;
  color: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        px-5
        py-4
        ${!last ? "border-r border-slate-200" : ""}
      `}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-400">
        {title}
      </p>

      <p
        className={`
          mt-1.5
          text-[22px]
          font-semibold
          tracking-[-0.02em]
          ${color}
        `}
      >
        {value}
      </p>
    </div>
  );
}