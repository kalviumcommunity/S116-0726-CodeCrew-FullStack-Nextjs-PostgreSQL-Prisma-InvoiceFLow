"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface UploadProgressProps {
  uploadId: string | null;
  fileName?: string;
  onComplete?: (details: any) => void;
}

export default function UploadProgress({
  uploadId,
  fileName = "upload.csv",
  onComplete,
}: UploadProgressProps) {
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [uploadData, setUploadData] = useState<{
    upload?: any;
    counts?: {
      match: number;
      mismatch: number;
      failed: number;
      processing: number;
      total: number;
    };
  }>({});

  useEffect(() => {
    if (!uploadId) return;

    let isMounted = true;
    // Track completion in a ref so the interval callback always sees the latest value
    let completed = false;

    async function pollStatus() {
      if (completed) return;
      try {
        const res = await fetch(`/api/uploads/${uploadId}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        setUploadData(data);
        setProgress(data.progressPercent ?? 0);

        if (data.upload?.status === "COMPLETED" || data.upload?.status === "FAILED" || data.progressPercent === 100) {
          completed = true;
          if (onComplete) {
            onComplete(data);
          }
        }
      } catch (err) {
        console.error("Polling upload status error:", err);
      }
    }

    pollStatus();
    const interval = setInterval(pollStatus, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [uploadId, onComplete]);

  const counts = uploadData.counts || {
    match: 0,
    mismatch: 0,
    failed: 0,
    processing: 0,
    total: 0,
  };

  const processedCount = counts.match + counts.mismatch + counts.failed;
  const successCount = counts.match + counts.mismatch;
  const remainingCount = Math.max(0, counts.total - processedCount);
  const isFinished = uploadData.upload?.status === "COMPLETED" || progress === 100;

  return (
    <div className="flex min-h-[540px] flex-col rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h1 className="text-[21px] font-semibold tracking-[-0.025em] text-slate-900">
            {isFinished ? "Upload Processing Completed" : "Processing Upload"}
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            {isFinished
              ? "All rows processed and validated"
              : "Invoice validation in progress"}
          </p>
        </div>

        <span
          className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold ${
            isFinished
              ? "bg-emerald-50 text-emerald-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {isFinished ? (
            <CheckCircle2 size={14} strokeWidth={2} />
          ) : (
            <Loader2 size={14} strokeWidth={2} className="animate-spin" />
          )}
          {isFinished ? "Completed" : "Processing"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex min-h-0 flex-1 flex-col px-6 py-5">
        {/* FILE */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-emerald-50 text-emerald-600">
            <FileText size={22} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-semibold tracking-[-0.015em] text-slate-900">
              {uploadData.upload?.fileName || fileName}
            </h3>

            <p className="mt-1 text-[13px] text-slate-500">
              Uploaded today · {counts.total.toLocaleString("en-IN")} invoices
            </p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-7">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-600">
              Processing invoices
            </span>

            <span className="text-[13px] font-semibold text-slate-900">
              {progress}%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[12px] text-slate-400">
            <span>
              {processedCount.toLocaleString("en-IN")} /{" "}
              {counts.total.toLocaleString("en-IN")} processed
            </span>

            <span>{remainingCount.toLocaleString("en-IN")} remaining</span>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-7 grid grid-cols-4 overflow-hidden rounded-[14px] border border-slate-200">
          <Stat
            title="Processed"
            value={processedCount.toLocaleString("en-IN")}
            color="text-blue-600"
          />

          <Stat
            title="Success"
            value={successCount.toLocaleString("en-IN")}
            color="text-emerald-600"
          />

          <Stat
            title="Failed"
            value={counts.failed.toLocaleString("en-IN")}
            color="text-red-600"
          />

          <Stat
            title="Status"
            value={isFinished ? "Ready" : "Live"}
            color="text-slate-900"
            last
          />
        </div>

        {/* STATUS AREA */}
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
                  {counts.match} Matched
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
                  {counts.failed + counts.mismatch} Mismatch / Errors
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (uploadId) router.push(`/history/${uploadId}`);
              }}
              className="flex h-9 items-center gap-1.5 rounded-[9px] bg-blue-600 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              View Details
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className={`px-5 py-4 ${!last ? "border-r border-slate-200" : ""}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-400">
        {title}
      </p>

      <p className={`mt-1.5 text-[22px] font-semibold tracking-[-0.02em] ${color}`}>
        {value}
      </p>
    </div>
  );
}