"use client";

import { useState } from "react";
import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadProgress from "@/components/upload/UploadProgress";
import UploadSuccess from "@/components/upload/UploadSuccess";
import FormatGuide from "@/components/upload/FormatGuide";

type UploadStatus = "idle" | "uploading" | "success";

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

export default function UploadPage() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  async function handleFileSelected(file: File) {
    try {
      setError(null);
      setFileName(file.name);
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload file");
      }

      setUploadId(data.uploadId);
      // Store result for success screen — will be populated when polling completes
      setUploadResult({
        uploadId: data.uploadId,
        totalRows: data.totalRows ?? 0,
        successfulRows: data.successfulRows ?? 0,
        failedRows: data.failedRows ?? 0,
        matchCount: data.matchCount ?? 0,
        mismatchCount: data.mismatchCount ?? 0,
        failedCount: data.failedCount ?? 0,
        fileName: file.name,
      });
    } catch (err: any) {
      console.error("CSV Upload failed:", err);
      setError(err.message || "Upload failed");
      setStatus("idle");
    }
  }

  function handleComplete(details: any) {
    // Transition to success screen once UploadProgress reports COMPLETED
    const counts = details?.counts;
    const upload = details?.upload;
    if (uploadResult) {
      setUploadResult((prev) => prev && {
        ...prev,
        totalRows: upload?.totalRows ?? prev.totalRows,
        successfulRows: upload?.successfulRows ?? prev.successfulRows,
        failedRows: upload?.failedRows ?? prev.failedRows,
        matchCount: counts?.match ?? prev.matchCount,
        mismatchCount: counts?.mismatch ?? prev.mismatchCount,
        failedCount: counts?.failed ?? prev.failedCount,
      });
    }
    setStatus("success");
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <section>
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-slate-900">
          Upload Invoices
        </h1>

        <p className="text-xs text-slate-500">
          Upload invoice CSV files and monitor processing in real time.
        </p>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
            {error}
          </div>
        )}
      </section>

      {/* UPLOAD STATES */}
      <div className="mt-6">
        {status === "idle" && (
          <UploadDropzone
            onFormatGuide={() => setShowFormatGuide(true)}
            onFileSelected={handleFileSelected}
          />
        )}

        {status === "uploading" && (
          <UploadProgress
            uploadId={uploadId}
            fileName={fileName}
            onComplete={handleComplete}
          />
        )}

        {status === "success" && (
          <UploadSuccess
            result={uploadResult}
            onUploadAnother={() => {
              setStatus("idle");
              setUploadId(null);
              setUploadResult(null);
              setFileName("");
            }}
          />
        )}
      </div>

      {/* FORMAT GUIDE */}
      {showFormatGuide && (
        <FormatGuide onClose={() => setShowFormatGuide(false)} />
      )}
    </div>
  );
}