"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileSpreadsheet,
  MoreHorizontal,
  X,
  Clock3,
  CircleCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function CurrentJob() {
  const router = useRouter();

  const [latestUpload, setLatestUpload] = useState<any>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [logsOpen, setLogsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchCurrentJob() {
      try {
        const res = await fetch("/api/uploads");
        if (!res.ok) return;

        const data = await res.json();
        const uploads = data.uploads || [];
        if (uploads.length === 0) return;

        const latest = uploads[0]; // Most recent upload
        if (isMounted) setLatestUpload(latest);

        const detailRes = await fetch(`/api/uploads/${latest.id}`);
        if (detailRes.ok && isMounted) {
          const detailData = await detailRes.json();
          setJobDetails(detailData);
        }
      } catch (err) {
        console.error("CurrentJob fetch error:", err);
      }
    }

    fetchCurrentJob();

    const interval = setInterval(fetchCurrentJob, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const counts = jobDetails?.counts || {
    match: 0,
    mismatch: 0,
    failed: 0,
    processing: 0,
    total: 0,
  };

  const progress = jobDetails?.progressPercent ?? (latestUpload ? 100 : 0);
  const fileName = latestUpload?.file || "No active jobs";
  const processed = counts.match + counts.mismatch + counts.failed;
  const total = counts.total || latestUpload?.rawRows || 0;
  const success = counts.match + counts.mismatch;
  const failed = counts.failed;
  const isFinished = latestUpload?.status === "Completed" || progress === 100;

  const stats = [
    {
      label: "Processed",
      value: processed.toLocaleString("en-IN"),
      sub: "rows",
      color: "text-blue-600",
    },
    {
      label: "Success",
      value: success.toLocaleString("en-IN"),
      sub: "rows",
      color: "text-emerald-600",
    },
    {
      label: "Failed",
      value: failed.toLocaleString("en-IN"),
      sub: "rows",
      color: "text-red-500",
    },
    {
      label: "Status",
      value: isFinished ? "Completed" : "Processing",
      sub: isFinished ? "done" : "live",
      color: "text-slate-900",
    },
  ];

  return (
    <>
      <section className="flex min-h-[405px] flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)]">
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-slate-900">
                Current Processing Job
              </h2>

              <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <p className="mt-1 text-[13px] text-slate-500">
              Live invoice processing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[11px] font-medium ${
                isFinished
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isFinished ? "bg-emerald-600" : "bg-blue-600 animate-pulse"
                }`}
              />
              {isFinished ? "Completed" : "Processing"}
            </span>

            {latestUpload && (
              <button
                type="button"
                onClick={() => router.push(`/history/${latestUpload.id}`)}
                className="flex h-8 items-center gap-1 rounded-full border border-slate-200 px-3 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                View
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid flex-1 grid-cols-[166px_minmax(0,1fr)] gap-5 p-5">
          {/* PROGRESS RING */}
          <div className="flex h-full min-h-0 flex-col rounded-[18px] bg-slate-50 px-4 py-5">
            <p className="shrink-0 text-center text-[11px] font-medium text-slate-500">
              Overall Progress
            </p>

            <div className="relative mx-auto mt-5 h-[116px] w-[116px] shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#E8EDF5"
                  strokeWidth="7"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={314}
                  strokeDashoffset={314 * (1 - progress / 100)}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[30px] font-semibold tracking-[-0.05em] text-slate-900">
                  {progress}%
                </span>

                <span className="text-[10px] text-slate-500">completed</span>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

                <div>
                  <p className="text-[12px] font-semibold text-emerald-600">
                    Healthy
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Processing normally
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex min-w-0 min-h-0 flex-col">
            {/* FILE */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-emerald-50 text-emerald-600">
                <FileSpreadsheet size={21} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-[17px] font-semibold tracking-[-0.025em] text-slate-900">
                  {fileName}
                </h3>

                <p className="mt-0.5 text-[12px] text-slate-500">
                  {latestUpload?.uploaded || "No uploads yet"}
                </p>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-5 shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">
                  Processing invoices
                </span>

                <span className="text-[12px] font-medium text-slate-700">
                  {processed.toLocaleString("en-IN")} / {total.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="h-[7px] overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                <span>{progress}% complete</span>
                <span>{Math.max(0, total - processed).toLocaleString("en-IN")} remaining</span>
              </div>
            </div>

            {/* STATS */}
            <div className="mt-5 grid shrink-0 grid-cols-4 divide-x divide-slate-200 rounded-[14px] border border-slate-200">
              {stats.map((item) => (
                <div key={item.label} className="px-4 py-3">
                  <p className="text-[10px] font-medium text-slate-500">
                    {item.label}
                  </p>
                  <p className={`mt-1 text-[18px] font-semibold tracking-[-0.025em] ${item.color}`}>
                    {item.value}
                  </p>
                  <p className="text-[9px] text-slate-400">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Validation running automatically
              </div>

              {latestUpload && (
                <button
                  type="button"
                  onClick={() => router.push(`/history/${latestUpload.id}`)}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[11px] font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}