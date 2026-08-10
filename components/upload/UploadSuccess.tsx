"use client";

import {
  CheckCircle2,
  FileText,
  ArrowRight,
  Download,
  Sparkles,
} from "lucide-react";

export default function UploadSuccess() {
  return (
    <section className="flex min-h-[540px] flex-col rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

      {/* =====================================================
          SUCCESS HEADER
      ===================================================== */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-7 py-5">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-emerald-50 text-emerald-600">
            <CheckCircle2
              size={25}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h1 className="text-[21px] font-semibold tracking-[-0.025em] text-slate-900">
              Upload Completed Successfully
            </h1>

            <p className="mt-1 text-[13px] text-slate-500">
              Your invoice file has been imported, validated and processed successfully.
            </p>
          </div>

        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="flex min-h-0 flex-1 flex-col px-7 py-5">

        {/* SUMMARY */}
        <div className="grid grid-cols-4 overflow-hidden rounded-[14px] border border-slate-200">

          <Summary
            title="Invoices Imported"
            value="24,580"
            color="text-blue-600"
          />

          <Summary
            title="Successful"
            value="23,870"
            color="text-emerald-600"
          />

          <Summary
            title="Failed"
            value="710"
            color="text-red-600"
          />

          <Summary
            title="Processing Time"
            value="18 sec"
            color="text-slate-900"
            last
          />

        </div>


        {/* FILE */}
        <div className="mt-5 rounded-[14px] border border-slate-200 bg-white px-4 py-4">

          <div className="flex items-center gap-3.5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-emerald-50 text-emerald-600">
              <FileText
                size={21}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0 flex-1">

              <h3 className="truncate text-[14px] font-semibold text-slate-900">
                invoices_jun_2025.csv
              </h3>

              <p className="mt-0.5 text-[12px] text-slate-500">
                Uploaded today · 10:30 AM
              </p>

            </div>

            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              Completed
            </span>

          </div>

        </div>


        {/* PROCESSING RESULT */}
        <div className="mt-4 grid grid-cols-2 gap-3">

          <div className="flex items-center gap-3 rounded-[13px] bg-emerald-50/60 px-4 py-3">

            <CheckCircle2
              size={18}
              className="shrink-0 text-emerald-600"
            />

            <div>
              <p className="text-[13px] font-semibold text-slate-900">
                23,870 invoices ready
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Successfully validated and imported
              </p>
            </div>

          </div>


          <div className="flex items-center gap-3 rounded-[13px] bg-red-50/60 px-4 py-3">

            <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold text-red-600">
              !
            </div>

            <div>
              <p className="text-[13px] font-semibold text-slate-900">
                710 invoices need attention
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Download the error report to review them
              </p>
            </div>

          </div>

        </div>


        {/* ACTIONS */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">

          <div className="flex items-center gap-2 text-[12px] text-slate-400">

            <Sparkles
              size={15}
              className="text-emerald-500"
            />

            Your invoices are now available in the Invoices section.

          </div>

          <div className="flex items-center gap-2.5">

            <button
              type="button"
              className="
                flex
                h-9
                items-center
                gap-2
                rounded-[9px]
                border
                border-slate-200
                bg-white
                px-4
                text-[12px]
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              <Download size={14} />

              Download Error Report
            </button>

            <button
              type="button"
              className="
                flex
                h-9
                items-center
                gap-2
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
              View Invoices

              <ArrowRight size={14} />
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}


/* =============================================================
   SUMMARY
============================================================= */

function Summary({
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

      <h3
        className={`
          mt-1.5
          text-[22px]
          font-semibold
          tracking-[-0.02em]
          ${color}
        `}
      >
        {value}
      </h3>

    </div>
  );
}