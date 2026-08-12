"use client";

import {
  CheckCircle2,
  FileText,
  ArrowRight,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UploadResult {
  uploadId: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  matchCount: number;
  mismatchCount: number;
  failedCount: number;
  fileName: string;
}

interface UploadSuccessProps {
  result: UploadResult | null;
  onUploadAnother?: () => void;
}

export default function UploadSuccess({ result, onUploadAnother }: UploadSuccessProps) {
  const router = useRouter();

  const totalRows = result?.totalRows ?? 0;
  const successfulRows = result?.successfulRows ?? 0;
  const failedRows = result?.failedRows ?? 0;
  const fileName = result?.fileName ?? "upload.csv";
  const uploadId = result?.uploadId ?? "";

  return (
    <section className="flex min-h-[540px] flex-col rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

      {/* SUCCESS HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-7 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={25} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-[21px] font-semibold tracking-[-0.025em] text-slate-900">
              Upload Completed Successfully
            </h1>
            <p className="mt-1 text-[13px] text-slate-500">
              Your invoice file has been imported, validated and processed.
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex min-h-0 flex-1 flex-col px-7 py-5">

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-3 overflow-hidden rounded-[14px] border border-slate-200">
          <Summary
            title="Total Rows"
            value={totalRows.toLocaleString("en-IN")}
            color="text-blue-600"
          />
          <Summary
            title="Successful"
            value={successfulRows.toLocaleString("en-IN")}
            color="text-emerald-600"
          />
          <Summary
            title="Need Attention"
            value={failedRows.toLocaleString("en-IN")}
            color={failedRows > 0 ? "text-red-600" : "text-slate-400"}
            last
          />
        </div>

        {/* FILE INFO */}
        <div className="mt-5 rounded-[14px] border border-slate-200 bg-white px-4 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-emerald-50 text-emerald-600">
              <FileText size={21} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[14px] font-semibold text-slate-900">
                {fileName}
              </h3>
              <p className="mt-0.5 text-[12px] text-slate-500">
                Processed successfully
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              Completed
            </span>
          </div>
        </div>

        {/* RESULT BREAKDOWN */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-[13px] bg-emerald-50/60 px-4 py-3">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <div>
              <p className="text-[13px] font-semibold text-slate-900">
                {successfulRows.toLocaleString("en-IN")} invoices matched
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
                {failedRows.toLocaleString("en-IN")} need attention
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Mismatches or validation errors
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2 text-[12px] text-slate-400">
            <Sparkles size={15} className="text-emerald-500" />
            Your invoices are now available in the Invoices section.
          </div>

          <div className="flex items-center gap-2.5">
            {onUploadAnother && (
              <button
                type="button"
                onClick={onUploadAnother}
                className="flex h-9 items-center gap-2 rounded-[9px] border border-slate-200 bg-white px-4 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCcw size={14} />
                Upload Another
              </button>
            )}

            <button
              type="button"
              onClick={() => uploadId ? router.push(`/history/${uploadId}`) : router.push("/invoices")}
              className="flex h-9 items-center gap-2 rounded-[9px] bg-blue-600 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              View Results
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <div className={`px-5 py-4 ${!last ? "border-r border-slate-200" : ""}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-400">
        {title}
      </p>
      <h3 className={`mt-1.5 text-[22px] font-semibold tracking-[-0.02em] ${color}`}>
        {value}
      </h3>
    </div>
  );
}
