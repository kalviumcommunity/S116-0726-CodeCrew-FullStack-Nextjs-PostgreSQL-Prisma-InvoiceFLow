"use client";

import { useState } from "react";
import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadProgress from "@/components/upload/UploadProgress";
import UploadSuccess from "@/components/upload/UploadSuccess";
import FormatGuide from "@/components/upload/FormatGuide";

type UploadStatus = "idle" | "uploading" | "success";

export default function UploadPage() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error("CSV Upload failed:", err);
      setError(err.message || "Upload failed");
      setStatus("idle");
    }
  }

  function handleComplete() {
    // Optional transition to success state if desired
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

        {status === "success" && <UploadSuccess />}
      </div>

      {/* FORMAT GUIDE */}
      {showFormatGuide && (
        <FormatGuide onClose={() => setShowFormatGuide(false)} />
      )}
    </div>
  );
}