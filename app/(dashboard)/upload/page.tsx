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

async function postUploadChunk(formData: FormData) {
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  let data: any = {};
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      error:
        res.status === 413
          ? "File size exceeds server upload limit (HTTP 413)."
          : `Upload server error (HTTP ${res.status})`,
    };
  }

  if (!res.ok || data.error) {
    throw new Error(data.error || `Upload failed (HTTP ${res.status})`);
  }

  return data;
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

      // For small files (<= 2.5MB), use single request upload
      if (file.size <= 2.5 * 1024 * 1024) {
        const formData = new FormData();
        formData.append("file", file);

        const data = await postUploadChunk(formData);

        setUploadId(data.uploadId);
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
        return;
      }

      // For large files (> 2.5MB), split CSV lines into chunk requests to bypass Vercel 4.5MB limits
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

      if (lines.length <= 1) {
        throw new Error("CSV file contains no data rows or only a header line");
      }

      const header = lines[0];
      const dataLines = lines.slice(1);
      const totalRows = dataLines.length;

      const CHUNK_SIZE = 15000; // ~650 KB per request (well below 4.5MB Vercel limit)
      const totalChunks = Math.ceil(totalRows / CHUNK_SIZE);
      let currentUploadId: string | null = null;
      let lastData: any = null;

      for (let i = 0; i < totalChunks; i++) {
        const chunkLines = dataLines.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const chunkCsv = header + "\n" + chunkLines.join("\n");
        const chunkBlob = new Blob([chunkCsv], { type: "text/csv" });

        const formData = new FormData();
        formData.append("file", chunkBlob, file.name);
        formData.append("isFirstChunk", String(i === 0));
        formData.append("isLastChunk", String(i === totalChunks - 1));
        formData.append("totalRows", String(totalRows));
        if (currentUploadId) {
          formData.append("uploadId", currentUploadId);
        }

        const data = await postUploadChunk(formData);
        lastData = data;

        if (i === 0) {
          currentUploadId = data.uploadId;
          setUploadId(data.uploadId);
        }
      }

      if (lastData) {
        setUploadResult({
          uploadId: lastData.uploadId,
          totalRows: lastData.totalRows ?? totalRows,
          successfulRows: lastData.successfulRows ?? 0,
          failedRows: lastData.failedRows ?? 0,
          matchCount: lastData.matchCount ?? 0,
          mismatchCount: lastData.mismatchCount ?? 0,
          failedCount: lastData.failedCount ?? 0,
          fileName: file.name,
        });
      }
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