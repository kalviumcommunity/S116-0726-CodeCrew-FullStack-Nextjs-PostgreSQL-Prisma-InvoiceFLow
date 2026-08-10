"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileSpreadsheet,
  MoreHorizontal,
  X,
  Clock3,
  CircleCheck,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    label: "Processed",
    value: "14,250",
    sub: "rows",
    color: "text-blue-600",
  },
  {
    label: "Success",
    value: "13,720",
    sub: "rows",
    color: "text-emerald-600",
  },
  {
    label: "Failed",
    value: "530",
    sub: "rows",
    color: "text-red-500",
  },
  {
    label: "ETA",
    value: "2m 18s",
    sub: "remaining",
    color: "text-slate-900",
  },
];

const logs = [
  {
    time: "10:30:02 AM",
    title: "Processing started",
    description: "CSV upload successfully initialized.",
    type: "success",
  },
  {
    time: "10:30:18 AM",
    title: "Validation started",
    description: "Checking invoice rows and required fields.",
    type: "success",
  },
  {
    time: "10:31:04 AM",
    title: "14,250 rows processed",
    description: "Invoice processing is currently running.",
    type: "info",
  },
  {
    time: "10:31:26 AM",
    title: "530 failed rows detected",
    description: "Some invoice rows contain validation errors.",
    type: "error",
  },
];

export default function CurrentJob() {
  const progress = 58;

  const [logsOpen, setLogsOpen] = useState(false);

  return (
    <>
      {/* =====================================================
          CURRENT PROCESSING JOB
      ===================================================== */}

      <section
        className="
          flex
          min-h-[405px]
          flex-col
          overflow-hidden
          rounded-[20px]
          border
          border-slate-200
          bg-white
          shadow-[0_4px_18px_rgba(15,23,42,0.035)]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-100
            px-6
            py-5
          "
        >
          <div>
            <div className="flex items-center gap-2.5">
              <h2
                className="
                  text-[18px]
                  font-semibold
                  tracking-[-0.03em]
                  text-slate-900
                "
              >
                Current Processing Job
              </h2>

              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[12px]
                  font-medium
                  text-emerald-600
                "
              >
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
              className="
                flex
                h-8
                items-center
                gap-1.5
                rounded-full
                bg-blue-50
                px-3.5
                text-[11px]
                font-medium
                text-blue-600
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Processing
            </span>

            <button
              type="button"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                text-slate-500
                transition
                hover:bg-slate-50
                hover:text-slate-900
              "
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            grid
            flex-1
            grid-cols-[166px_minmax(0,1fr)]
            gap-5
            p-5
          "
        >
          {/* =================================================
              OVERALL PROGRESS
          ================================================= */}

          <div
            className="
              flex
              h-full
              min-h-0
              flex-col
              rounded-[18px]
              bg-slate-50
              px-4
              py-5
            "
          >
            <p
              className="
                shrink-0
                text-center
                text-[11px]
                font-medium
                text-slate-500
              "
            >
              Overall Progress
            </p>

            {/* PROGRESS RING */}

            <div className="relative mx-auto mt-5 h-[116px] w-[116px] shrink-0">
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full -rotate-90"
              >
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
                <span
                  className="
                    text-[30px]
                    font-semibold
                    tracking-[-0.05em]
                    text-slate-900
                  "
                >
                  {progress}%
                </span>

                <span className="text-[10px] text-slate-500">
                  completed
                </span>
              </div>
            </div>

            {/* STATUS */}

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

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <div className="flex min-w-0 min-h-0 flex-col">
            {/* FILE */}

            <div className="flex shrink-0 items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-emerald-50
                "
              >
                <FileSpreadsheet
                  size={21}
                  strokeWidth={1.8}
                  className="text-emerald-600"
                />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-[17px]
                    font-semibold
                    tracking-[-0.025em]
                    text-slate-900
                  "
                >
                  invoices_jun_2025.csv
                </h3>

                <p className="mt-0.5 text-[12px] text-slate-500">
                  Started today • 10:30 AM
                </p>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="mt-5 shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">
                  Processing invoices
                </span>

                <span className="text-[12px] font-medium text-slate-700">
                  14,250 / 24,580
                </span>
              </div>

              <div className="h-[7px] overflow-hidden rounded-full bg-slate-100">
                <div
                  className="
                    h-full
                    rounded-full
                    bg-blue-600
                    transition-all
                    duration-700
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                <span>58% complete</span>
                <span>10,330 remaining</span>
              </div>
            </div>

            {/* STATS */}

            <div
              className="
                mt-5
                grid
                shrink-0
                grid-cols-4
                divide-x
                divide-slate-200
                rounded-[14px]
                border
                border-slate-200
              "
            >
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="px-4 py-3"
                >
                  <p className="text-[10px] font-medium text-slate-500">
                    {item.label}
                  </p>

                  <p
                    className={`
                      mt-1
                      text-[18px]
                      font-semibold
                      tracking-[-0.025em]
                      ${item.color}
                    `}
                  >
                    {item.value}
                  </p>

                  <p className="text-[9px] text-slate-400">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* FOOTER */}

            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <CheckCircle2
                  size={13}
                  className="text-emerald-500"
                />

                Validation is running automatically
              </div>

              {/* ONLY VIEW LOGS */}

              <button
                type="button"
                onClick={() => setLogsOpen(true)}
                className="
                  flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-blue-600
                  px-4
                  text-[11px]
                  font-medium
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  active:scale-[0.98]
                "
              >
                View Logs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOGS MODAL
      ===================================================== */}

      {logsOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/20
            px-5
            backdrop-blur-[2px]
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLogsOpen(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-[560px]
              overflow-hidden
              rounded-[20px]
              border
              border-slate-200
              bg-white
              shadow-[0_25px_80px_rgba(15,23,42,0.18)]
            "
          >
            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-100
                px-6
                py-5
              "
            >
              <div>
                <h3 className="text-[17px] font-semibold text-slate-900">
                  Processing Logs
                </h3>

                <p className="mt-1 text-[12px] text-slate-500">
                  invoices_jun_2025.csv
                </p>
              </div>

              <button
                type="button"
                onClick={() => setLogsOpen(false)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <X size={17} />
              </button>
            </div>

            {/* LOGS */}

            <div className="max-h-[420px] overflow-y-auto px-6 py-5">
              <div className="space-y-5">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    {/* ICON */}

                    <div className="mt-0.5 shrink-0">
                      {log.type === "error" ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
                          <AlertCircle
                            size={15}
                            className="text-red-500"
                          />
                        </div>
                      ) : log.type === "info" ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50">
                          <Clock3
                            size={15}
                            className="text-blue-600"
                          />
                        </div>
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                          <CircleCheck
                            size={15}
                            className="text-emerald-600"
                          />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[13px] font-medium text-slate-900">
                          {log.title}
                        </p>

                        <span className="shrink-0 text-[10px] text-slate-400">
                          {log.time}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setLogsOpen(false)}
                className="
                  h-9
                  w-full
                  rounded-lg
                  bg-slate-900
                  text-[12px]
                  font-medium
                  text-white
                  transition
                  hover:bg-slate-800
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}