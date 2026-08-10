"use client";

import { useRef, useState } from "react";

import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  HardDrive,
  ArrowRight,
} from "lucide-react";

interface UploadDropzoneProps {
  onFormatGuide?: () => void;
  onFileSelected?: (file: File) => void;
}

export default function UploadDropzone({
  onFormatGuide,
  onFileSelected,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  function validateFile(file: File) {
    setError("");

    const isCSV =
      file.name.toLowerCase().endsWith(".csv") ||
      file.type === "text/csv";

    if (!isCSV) {
      setError("Please select a CSV file.");
      return false;
    }

    const maxSize = 25 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("File size must be less than 25 MB.");
      return false;
    }

    return true;
  }

  function handleFile(file: File) {
    if (!validateFile(file)) return;

    onFileSelected?.(file);
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    // Allows selecting the same file again
    event.target.value = "";
  }

  function handleBrowse() {
    inputRef.current?.click();
  }

  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  return (
    <div
      className="
        grid
        min-h-0
        grid-cols-1
        gap-5
        xl:grid-cols-[minmax(0,1fr)_390px]
      "
    >
      {/* =====================================================
          LEFT — UPLOAD AREA
      ===================================================== */}

      <div className="min-w-0">

        {/* DROPZONE */}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative
            flex
            min-h-[452px]
            flex-col
            items-center
            justify-center
            overflow-hidden
            rounded-[20px]
            border
            border-dashed
            px-8
            py-8
            shadow-[0_2px_8px_rgba(15,23,42,0.03)]
            transition
            duration-200

            ${
              isDragging
                ? "border-blue-500 bg-blue-50/40"
                : "border-blue-200 bg-white hover:border-blue-300"
            }
          `}
        >

          {/* Hidden file input */}

          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Background decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -right-14
              opacity-[0.055]
            "
          >
            <FileText
              size={220}
              className="text-blue-600"
              strokeWidth={1}
            />
          </div>

          {/* Upload Icon */}

          <div
            className="
              relative
              flex
              h-[72px]
              w-[72px]
              items-center
              justify-center
              rounded-[20px]
              border
              border-blue-100
              bg-blue-50
              text-blue-600
              shadow-sm
            "
          >
            <UploadCloud
              size={34}
              strokeWidth={1.8}
            />
          </div>

          {/* Title */}

          <h2
            className="
              relative
              mt-6
              text-center
              text-[24px]
              font-semibold
              tracking-[-0.025em]
              text-slate-900
            "
          >
            Upload Invoice CSV
          </h2>

          {/* Description */}

          <p
            className="
              relative
              mt-2
              max-w-[540px]
              text-center
              text-[15px]
              leading-6
              text-slate-500
            "
          >
            Drag & drop your invoice CSV here or browse files from your
            computer.
          </p>

          {/* Browse Button */}

          <button
            type="button"
            onClick={handleBrowse}
            className="
              relative
              mt-7
              inline-flex
              h-11
              items-center
              gap-2
              rounded-[10px]
              bg-blue-600
              px-6
              text-[14px]
              font-semibold
              text-white
              shadow-sm
              transition
              duration-200
              hover:bg-blue-700
              active:scale-[0.98]
            "
          >
            <UploadCloud
              size={17}
              strokeWidth={2}
            />

            Browse Files
          </button>

          {/* Error */}

          {error && (
            <p className="relative mt-3 text-[12px] font-medium text-red-500">
              {error}
            </p>
          )}

          {/* File Requirements */}

          <div
            className="
              relative
              mt-5
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-2
              gap-y-1
              text-[13px]
              text-slate-400
            "
          >
            <span>Supports CSV</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>Maximum 25MB</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>UTF-8 Encoding</span>
          </div>

          {/* Drop Hint */}

          <div
            className="
              relative
              mt-7
              flex
              items-center
              gap-2
              text-[12px]
              font-medium
              text-slate-400
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

            {isDragging
              ? "Drop your file here"
              : "Drop your file anywhere inside this area"}
          </div>
        </div>

        {/* Bottom Helper Strip */}

        <div
          className="
            mt-4
            flex
            min-h-[48px]
            items-center
            justify-between
            gap-4
            rounded-[12px]
            border
            border-blue-100
            bg-blue-50/50
            px-4
          "
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-blue-100
                text-blue-600
              "
            >
              <FileSpreadsheet
                size={15}
                strokeWidth={1.8}
              />
            </div>

            <p className="truncate text-[13px] text-slate-600">
              Make sure your CSV contains the required invoice columns.
            </p>
          </div>

          <button
            type="button"
            onClick={onFormatGuide}
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-1
              rounded-md
              py-1
              text-[13px]
              font-semibold
              text-blue-600
              outline-none
              transition
              duration-200
              hover:text-blue-700
              focus-visible:ring-2
              focus-visible:ring-blue-200
              active:scale-[0.98]
            "
          >
            Format Guide

            <ArrowRight
              size={14}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* =====================================================
          RIGHT — UPLOAD INFORMATION
      ===================================================== */}

      <div
        className="
          flex
          min-h-0
          flex-col
          rounded-[20px]
          border
          border-slate-200
          bg-white
          p-6
          shadow-[0_2px_8px_rgba(15,23,42,0.03)]
        "
      >
        <div>
          <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">
            Upload Information
          </h3>

          <p className="mt-1 text-[13px] text-slate-500">
            File requirements and processing details.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <Info
            icon={<FileText size={16} strokeWidth={1.8} />}
            label="File Format"
            value="CSV"
          />

          <Info
            icon={<HardDrive size={16} strokeWidth={1.8} />}
            label="Maximum Size"
            value="25 MB"
          />

          <Info
            icon={<FileSpreadsheet size={16} strokeWidth={1.8} />}
            label="Encoding"
            value="UTF-8"
          />

          <Info
            icon={<Clock3 size={16} strokeWidth={1.8} />}
            label="Processing Time"
            value="10–20 sec"
          />
        </div>

        <div className="my-6 h-px bg-slate-100" />

        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-semibold text-slate-900">
              Last Upload
            </h4>

            <span className="text-[12px] text-slate-400">
              Today
            </span>
          </div>

          <div
            className="
              mt-3
              rounded-[14px]
              border
              border-slate-100
              bg-slate-50
              p-4
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[10px]
                  bg-emerald-50
                  text-emerald-600
                "
              >
                <FileSpreadsheet
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-slate-900">
                  invoices_jun_2025.csv
                </p>

                <p className="mt-1 text-[12px] text-slate-500">
                  Today · 10:30 AM
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-emerald-50
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  text-emerald-700
                "
              >
                <CheckCircle2
                  size={13}
                  strokeWidth={2}
                />

                Completed
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div
          className="
            mt-5
            rounded-[12px]
            border
            border-slate-100
            bg-slate-50
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

            <p className="text-[12px] font-medium text-slate-500">
              Your files are securely uploaded and processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-[9px]
            bg-slate-50
            text-slate-500
          "
        >
          {icon}
        </div>

        <span className="truncate text-[14px] font-medium text-slate-600">
          {label}
        </span>
      </div>

      <span
        className="
          shrink-0
          rounded-full
          bg-slate-100
          px-3
          py-1.5
          text-[12px]
          font-semibold
          text-slate-700
        "
      >
        {value}
      </span>
    </div>
  );
}