"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Search,
  SlidersHorizontal,
  X,
  XCircle,
  Loader2,
} from "lucide-react";

interface CSVRow {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerGSTIN: string;
  productName: string;
  quantity: string;
  unitPrice: string;
  taxAmount: string;
  totalAmount: string;
  status: "Success" | "Failed";
  errorMessage?: string | null;
}

export default function UploadDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const uploadId = typeof params.id === "string" ? params.id : "";

  const [uploadDetails, setUploadDetails] = useState<any>(null);
  const [rows, setRows] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Success" | "Failed"
  >("All");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  // Fetch upload metadata and invoices
  useEffect(() => {
    if (!uploadId) return;

    let isMounted = true;

    async function fetchData() {
      try {
        const [upRes, invRes] = await Promise.all([
          fetch(`/api/uploads/${uploadId}`),
          fetch(`/api/uploads/${uploadId}/invoices`),
        ]);

        if (upRes.ok && isMounted) {
          const upData = await upRes.json();
          setUploadDetails(upData);
        }

        if (invRes.ok && isMounted) {
          const invData = await invRes.json();
          const mapped: CSVRow[] = (invData.invoices || []).map((inv: any) => ({
            invoiceNumber: inv.invoiceNumber || inv.id,
            invoiceDate: inv.date,
            customerName: inv.customerName || inv.vendor,
            customerGSTIN: inv.gstin || "N/A",
            productName: "Invoice Item",
            quantity: "1",
            unitPrice: inv.amount,
            taxAmount: inv.gst || "₹0",
            totalAmount: inv.amount,
            status: inv.dbStatus === "FAILED" ? "Failed" : "Success",
            errorMessage: inv.errorMessage,
          }));
          setRows(mapped);
        }
      } catch (err) {
        console.error("Error fetching upload details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    // Poll if processing
    const interval = setInterval(() => {
      if (
        uploadDetails &&
        uploadDetails.upload &&
        uploadDetails.upload.status === "PROCESSING"
      ) {
        fetchData();
      }
    }, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [uploadId, uploadDetails?.upload?.status]);

  const uploadInfo = useMemo(() => {
    const up = uploadDetails?.upload || {};
    const counts = uploadDetails?.counts || { match: 0, mismatch: 0, failed: 0, total: 0 };

    const total = up.totalRows || counts.total || rows.length || 0;
    const success = (up.successfulRows ?? (counts.match + counts.mismatch)) || 0;
    const failed = (up.failedRows ?? counts.failed) || 0;
    const successRate =
      total > 0 ? `${((success / total) * 100).toFixed(1)}%` : "0%";

    return {
      fileName: up.fileName || `upload_${uploadId}.csv`,
      fileSize: "CSV",
      format: "CSV",
      encoding: "UTF-8",
      uploaded: up.uploadDate ? new Date(up.uploadDate).toLocaleString("en-GB") : "Recently",
      uploadId: `#${uploadId.slice(-6)}`,
      totalRows: total.toLocaleString("en-IN"),
      successfulRows: success.toLocaleString("en-IN"),
      failedRows: failed.toLocaleString("en-IN"),
      successRate,
      status: up.status || "PROCESSING",
    };
  }, [uploadDetails, uploadId, rows]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        row.invoiceNumber.toLowerCase().includes(query) ||
        row.customerName.toLowerCase().includes(query) ||
        row.customerGSTIN.toLowerCase().includes(query) ||
        row.productName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const visibleRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: "All" | "Success" | "Failed") {
    setStatusFilter(value);
    setPage(1);
  }

  function downloadCSV() {
    if (rows.length === 0) return;

    const header = [
      "Invoice Number",
      "Invoice Date",
      "Customer Name",
      "Customer GSTIN",
      "Total Amount",
      "Status",
      "Error Message",
    ];

    const csvRowsData = rows.map((row) => [
      row.invoiceNumber,
      row.invoiceDate,
      row.customerName,
      row.customerGSTIN,
      row.totalAmount,
      row.status,
      row.errorMessage || "",
    ]);

    const csv = [header, ...csvRowsData]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = uploadInfo.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (loading && !uploadDetails) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <div className="mx-auto w-full max-w-[1500px] px-6 py-6">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={14} />
              Back to Upload History
            </Link>

            <div className="mt-4 flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-emerald-50 text-emerald-600">
                <FileSpreadsheet size={21} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[22px] font-semibold tracking-[-0.03em] text-slate-900">
                  {uploadInfo.fileName}
                </h1>

                <p className="mt-1 text-[12px] text-slate-500">
                  {uploadInfo.fileSize} · Uploaded {uploadInfo.uploaded}
                </p>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  uploadInfo.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    uploadInfo.status === "COMPLETED"
                      ? "bg-emerald-500"
                      : "bg-blue-500 animate-pulse"
                  }`}
                />
                {uploadInfo.status === "COMPLETED" ? "Completed" : "Processing"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadCSV}
            className="flex h-9 shrink-0 items-center gap-2 rounded-[9px] bg-blue-600 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Download size={14} />
            Download CSV
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <section className="mt-6 grid grid-cols-4 gap-4">
          <SummaryCard label="Total Rows" value={uploadInfo.totalRows} />

          <SummaryCard
            label="Successful"
            value={uploadInfo.successfulRows}
            valueClassName="text-emerald-600"
          />

          <SummaryCard
            label="Failed"
            value={uploadInfo.failedRows}
            valueClassName="text-red-500"
          />

          <SummaryCard
            label="Success Rate"
            value={uploadInfo.successRate}
            valueClassName="text-blue-600"
          />
        </section>

        {/* FILE INFORMATION */}
        <section className="mt-5 rounded-[18px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-[14px] font-semibold text-slate-900">
              File Information
            </h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Details about this upload.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-slate-100">
            <InfoItem label="File Name" value={uploadInfo.fileName} />

            <InfoItem label="File Size" value={uploadInfo.fileSize} />

            <InfoItem label="Format" value={uploadInfo.format} />

            <InfoItem label="Encoding" value={uploadInfo.encoding} />

            <InfoItem label="Uploaded" value={uploadInfo.uploaded} />

            <InfoItem label="Upload ID" value={uploadInfo.uploadId} />
          </div>
        </section>

        {/* CSV PREVIEW TABLE */}
        <section className="mt-5 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-5 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-[14px] font-semibold text-slate-900">
                CSV Preview
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                View the invoice rows included in this upload.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-[230px] items-center rounded-full border border-slate-200 bg-white px-3">
                <Search size={14} className="shrink-0 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => handleSearch(event.target.value)}
                  placeholder="Search rows..."
                  className="ml-2 min-w-0 flex-1 bg-transparent text-[12px] text-slate-700 outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearch("")}
                    className="text-slate-400 transition hover:text-slate-700"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    handleStatusChange(
                      event.target.value as "All" | "Success" | "Failed"
                    )
                  }
                  className="h-9 appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-9 text-[12px] font-medium text-slate-600 outline-none transition hover:bg-slate-50 focus:border-blue-300"
                >
                  <option value="All">All Rows</option>
                  <option value="Success">Successful</option>
                  <option value="Failed">Failed</option>
                </select>

                <SlidersHorizontal
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <TableHeader>#</TableHeader>
                  <TableHeader>Invoice Number</TableHeader>
                  <TableHeader>Invoice Date</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader align="right">Amount</TableHeader>
                  <TableHeader align="center">Status</TableHeader>
                  <TableHeader>Error / Notes</TableHeader>
                </tr>
              </thead>

              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center">
                        <Search size={22} className="text-slate-300" />

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          No rows found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row, index) => {
                    const rowNumber = (safePage - 1) * rowsPerPage + index + 1;
                    const failed = row.status === "Failed";

                    return (
                      <tr
                        key={index}
                        className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/50"
                      >
                        <td className="px-4 py-3 text-[12px] font-medium text-slate-400">
                          {rowNumber}
                        </td>

                        <td className="px-4 py-3 text-[13px] font-semibold text-slate-900">
                          {row.invoiceNumber}
                        </td>

                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {row.invoiceDate}
                        </td>

                        <td className="px-4 py-3 text-[13px] text-slate-700">
                          {row.customerName}
                        </td>

                        <td className="px-4 py-3 text-right text-[13px] font-semibold text-slate-900">
                          {row.totalAmount}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              failed
                                ? "bg-red-50 text-red-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {failed ? (
                              <XCircle size={12} className="text-red-500" />
                            ) : (
                              <CheckCircle2 size={12} className="text-emerald-500" />
                            )}
                            {row.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-[12px] text-red-500">
                          {row.errorMessage || "--"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-[24px] font-semibold tracking-[-0.03em] ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-[13px] font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ${
        align === "center"
          ? "text-center"
          : align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}