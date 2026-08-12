"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import HistoryToolbar from "@/components/history/HistoryToolbar";
import HistoryTable from "@/components/history/HistoryTable";

export type UploadStatus =
  | "Completed"
  | "Processing"
  | "Queued"
  | "Failed";

export type Upload = {
  id: string | number;
  file: string;
  uploaded: string;
  uploadedAt: string;
  rows: string;
  success: string;
  failed: string;
  status: UploadStatus;
  size: string;
};

export type StatusFilter = "All Status" | UploadStatus;
export type DateFilter = "All Dates" | "Last 7 Days" | "Last 30 Days" | "Custom Range";
export type SortFilter = "Newest First" | "Oldest First";

export default function HistoryPage() {
  const router = useRouter();

  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [dateRange, setDateRange] = useState<DateFilter>("All Dates");
  const [sort, setSort] = useState<SortFilter>("Newest First");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [page, setPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    async function fetchUploads() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        });
        
        const res = await fetch(`/api/uploads?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setUploads(data.uploads || []);
          setTotalPages(data.totalPages || 1);
          setTotalRecords(data.total || 0);
        }
      } catch (err) {
        console.error("Error fetching uploads:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUploads();
  }, [page, refreshTrigger]);

  const filteredUploads = uploads; // For simplicity, we are passing pagination to the server. If advanced filtering is needed, it should be done on the API. 
  const visibleUploads = uploads;
  const safePage = page;

  function handleView(upload: Upload) {
    router.push(`/history/${upload.id}`);
  }

  function handleDownload(upload: Upload) {
    window.open(`/api/uploads/${upload.id}/invoices`, "_blank");
  }

  function handleDelete(upload: Upload) {
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleRetry(upload: Upload) {
    // Retry logic
  }

  function handleExport() {
    if (filteredUploads.length === 0) return;
    const headers = ["File", "Uploaded", "Rows", "Success", "Failed", "Status"];
    const rows = filteredUploads.map((u) => [
      u.file,
      u.uploaded,
      u.rows,
      u.success,
      u.failed,
      u.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "upload_history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <section className="mb-3">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-slate-900">
          Upload History
        </h1>
        <p className="text-xs text-slate-500">
          View all previous invoice CSV uploads and status reports.
        </p>
      </section>

      <HistoryToolbar
        search={search}
        onSearch={(v: string) => {
          setSearch(v);
          setPage(1);
        }}
        status={status}
        onStatusChange={(v: StatusFilter) => {
          setStatus(v);
          setPage(1);
        }}
        dateRange={dateRange}
        onDateChange={(v: DateFilter) => {
          setDateRange(v);
          setPage(1);
        }}
        customFrom={customFrom}
        customTo={customTo}
        onCustomRange={(f: string, t: string) => {
          setCustomFrom(f);
          setCustomTo(t);
          setDateRange("Custom Range");
          setPage(1);
        }}
        sort={sort}
        onSortChange={(v: SortFilter) => {
          setSort(v);
          setPage(1);
        }}
        onExport={handleExport}
      />

      <HistoryTable
        uploads={visibleUploads}
        totalUploads={totalRecords}
        page={safePage}
        totalPages={totalPages}
        onView={handleView}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onRetry={handleRetry}
        onPageChange={setPage}
      />
    </div>
  );
}