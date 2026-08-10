"use client";

import { useState } from "react";

import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadProgress from "@/components/upload/UploadProgress";
import UploadSuccess from "@/components/upload/UploadSuccess";
import FormatGuide from "@/components/upload/FormatGuide";

type UploadStatus = "idle" | "uploading" | "success";

export default function UploadPage() {
  const [status, setStatus] =
    useState<UploadStatus>("idle");

  const [showFormatGuide, setShowFormatGuide] =
    useState(false);

  function handleFileSelected(file: File) {
    console.log("Selected CSV:", file.name);

    setStatus("uploading");

    // Frontend demo processing for now.
    // Backend will replace this later.
    setTimeout(() => {
      setStatus("success");
    }, 1800);
  }

  function handleReset() {
    setStatus("idle");
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
      </section>

      {/* UPLOAD STATES */}

      <div className="mt-6">
        {status === "idle" && (
          <UploadDropzone
            onFormatGuide={() =>
              setShowFormatGuide(true)
            }
            onFileSelected={handleFileSelected}
          />
        )}

        {status === "uploading" && (
          <UploadProgress />
        )}

        {status === "success" && (
          <UploadSuccess />
        )}
      </div>

      {/* FORMAT GUIDE */}

      {showFormatGuide && (
        <FormatGuide
          onClose={() =>
            setShowFormatGuide(false)
          }
        />
      )}
    </div>
  );
}