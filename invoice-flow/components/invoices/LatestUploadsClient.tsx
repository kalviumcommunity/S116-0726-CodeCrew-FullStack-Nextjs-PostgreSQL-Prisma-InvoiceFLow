"use client";

import { useMemo, useState } from "react";

type UploadRow = {
  id: string;
  fileName: string;
  uploadedOn: string;
  totalInvoices: number;
  status: string;
  progress: number;
  badgeClass: string;
};

export default function LatestUploadsClient({ initialRecords }: { initialRecords: UploadRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialRecords;
    return initialRecords.filter((r) => r.fileName.toLowerCase().includes(q));
  }, [search, initialRecords]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Latest Upload Activity</h2>
          <p className="mt-1 text-sm text-slate-500">Overview of the most recent upload activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search uploads"
              aria-label="Search latest uploads"
              className="w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:self-auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            Live processing queue
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-600">No uploads found.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                {[
                  "File Name",
                  "Uploaded On",
                  "Total Invoices",
                  "Status",
                  "Progress",
                  "Action",
                ].map((heading) => (
                  <th key={heading} scope="col" className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:px-6">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((upload) => (
                <tr key={upload.fileName} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-950">{upload.fileName}</p>
                        <p className="text-sm text-slate-500">CSV upload</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">{upload.uploadedOn}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-900 sm:px-6">{upload.totalInvoices.toLocaleString()}</td>
                  <td className="px-5 py-4 sm:px-6">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${upload.badgeClass}`}>
                      {upload.status}
                    </span>
                  </td>
                  <td className="min-w-55 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${upload.status === "Completed" ? "bg-linear-to-r from-emerald-500 to-teal-500" : upload.status === "Failed" ? "bg-linear-to-r from-rose-500 to-red-500" : "bg-linear-to-r from-violet-500 to-fuchsia-500"}`} style={{ width: `${upload.progress}%` }} />
                      </div>
                      <span className="w-10 text-right text-sm font-medium text-slate-600">{upload.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <a className="inline-flex items-center justify-center rounded-md font-medium transition-colors border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 h-9 px-3 text-sm gap-2" href={`/uploads/${upload.id}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
