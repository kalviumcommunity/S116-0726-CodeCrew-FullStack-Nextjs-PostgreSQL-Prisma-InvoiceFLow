"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HistoryPagination() {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">

      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-900">1–5</span> of{" "}
        <span className="font-semibold text-slate-900">28</span> uploads
      </p>

      <div className="flex items-center gap-2">

        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50">
          <ChevronLeft size={18} />
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-semibold text-white">
          1
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50">
          2
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50">
          3
        </button>

        <span className="px-1 text-slate-400">
          ...
        </span>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50">
          8
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50">
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
}