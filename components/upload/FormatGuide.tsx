"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileText,
  CheckCircle2,
  Info,
  Download,
} from "lucide-react";

interface FormatGuideProps {
  onClose: () => void;
}

/* =========================================================
   CLIENT MOUNT CHECK
========================================================= */

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function FormatGuide({
  onClose,
}: FormatGuideProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  /* =========================================================
     LOCK PAGE SCROLL WHILE DRAWER IS OPEN
  ========================================================= */

  useEffect(() => {
    if (!mounted) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        className="
          fixed
          inset-0
          z-[9998]
          bg-slate-950/20
          backdrop-blur-[2px]
        "
        onClick={onClose}
        aria-hidden="true"
      />

      {/* =====================================================
          DRAWER
      ===================================================== */}

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="format-guide-title"
        className="
          fixed
          right-0
          top-0
          z-[9999]
          flex
          h-screen
          h-[100dvh]
          w-full
          max-w-[520px]
          flex-col
          overflow-hidden
          border-l
          border-slate-200
          bg-white
          shadow-[-20px_0_60px_rgba(15,23,42,0.14)]
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            flex
            h-[76px]
            min-h-[76px]
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-100
            bg-white
            px-6
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[11px]
                bg-blue-50
                text-blue-600
              "
            >
              <FileText
                size={18}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <h2
                id="format-guide-title"
                className="
                  text-[17px]
                  font-semibold
                  tracking-[-0.025em]
                  text-slate-900
                "
              >
                CSV Format Guide
              </h2>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[12px]
                  text-slate-500
                "
              >
                Prepare your invoice file before uploading.
              </p>
            </div>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close format guide"
            className="
              ml-4
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-slate-400
              transition
              duration-200
              hover:bg-slate-100
              hover:text-slate-700
              active:scale-95
            "
          >
            <X
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </header>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            bg-white
          "
        >
          <main className="px-6 py-6">

            {/* =================================================
                REQUIRED COLUMNS
            ================================================= */}

            <section>
              <h3
                className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.01em]
                  text-slate-900
                "
              >
                Required Columns
              </h3>

              <p
                className="
                  mt-1
                  text-[12px]
                  leading-5
                  text-slate-500
                "
              >
                Your CSV should contain these columns for each invoice.
              </p>

              <div
                className="
                  mt-3
                  overflow-hidden
                  rounded-[11px]
                  border
                  border-slate-200
                  bg-white
                "
              >
                {/* Table Header */}

                <div
                  className="
                    grid
                    grid-cols-[minmax(0,1fr)_96px]
                    border-b
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2.5
                  "
                >
                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.06em]
                      text-slate-500
                    "
                  >
                    Column
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.06em]
                      text-slate-500
                    "
                  >
                    Required
                  </span>
                </div>

                <ColumnRow name="Invoice Number" />
                <ColumnRow name="Invoice Date" />
                <ColumnRow name="Customer Name" />
                <ColumnRow name="Customer GSTIN" />
                <ColumnRow name="Product Name" />
                <ColumnRow name="Quantity" />
                <ColumnRow name="Unit Price" />
                <ColumnRow name="Tax Amount" />
                <ColumnRow name="Total Amount" last />
              </div>
            </section>

            {/* =================================================
                FORMATTING RULES
            ================================================= */}

            <section className="mt-7">
              <h3
                className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.01em]
                  text-slate-900
                "
              >
                Formatting Rules
              </h3>

              <div className="mt-3 space-y-2">
                <Rule>
                  Use <strong>CSV (.csv)</strong> format only.
                </Rule>

                <Rule>
                  Maximum file size is <strong>25 MB</strong>.
                </Rule>

                <Rule>
                  Use <strong>UTF-8</strong> encoding.
                </Rule>

                <Rule>
                  Keep the first row for column headers.
                </Rule>

                <Rule>
                  Do not merge cells or add multiple header rows.
                </Rule>

                <Rule>
                  Dates should use a consistent format such as{" "}
                  <strong>DD-MM-YYYY</strong>.
                </Rule>

                <Rule>
                  Numeric fields should contain numbers only.
                </Rule>
              </div>
            </section>

            {/* =================================================
                EXAMPLE
            ================================================= */}

            <section className="mt-7">
              <h3
                className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.01em]
                  text-slate-900
                "
              >
                Example
              </h3>

              <p
                className="
                  mt-1
                  text-[12px]
                  leading-5
                  text-slate-500
                "
              >
                A correctly formatted invoice row looks like this.
              </p>

              <div
                className="
                  mt-3
                  overflow-hidden
                  rounded-[11px]
                  border
                  border-slate-200
                  bg-slate-50
                "
              >
                <div className="overflow-x-auto">
                  <table
                    className="
                      min-w-[600px]
                      border-collapse
                      text-left
                    "
                  >
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-slate-500
                          "
                        >
                          Invoice Number
                        </th>

                        <th
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-slate-500
                          "
                        >
                          Invoice Date
                        </th>

                        <th
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-slate-500
                          "
                        >
                          Customer
                        </th>

                        <th
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-slate-500
                          "
                        >
                          Quantity
                        </th>

                        <th
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-slate-500
                          "
                        >
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[11px]
                            text-slate-700
                          "
                        >
                          INV-1001
                        </td>

                        <td
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[11px]
                            text-slate-700
                          "
                        >
                          09-08-2026
                        </td>

                        <td
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[11px]
                            text-slate-700
                          "
                        >
                          ABC Technologies
                        </td>

                        <td
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[11px]
                            text-slate-700
                          "
                        >
                          5
                        </td>

                        <td
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[11px]
                            text-slate-700
                          "
                        >
                          ₹59,000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p
                className="
                  mt-2
                  text-[10px]
                  leading-4
                  text-slate-400
                "
              >
                Scroll horizontally to view the full example.
              </p>
            </section>

            {/* =================================================
                INFO
            ================================================= */}

            <div
              className="
                mt-7
                flex
                items-start
                gap-3
                rounded-[11px]
                border
                border-blue-100
                bg-blue-50/60
                px-4
                py-3.5
              "
            >
              <Info
                size={16}
                strokeWidth={1.8}
                className="
                  mt-0.5
                  shrink-0
                  text-blue-600
                "
              />

              <p
                className="
                  text-[11px]
                  leading-[18px]
                  text-slate-600
                "
              >
                Make sure your column names and data formats match
                the requirements before uploading. Incorrect or
                missing values may cause invoice validation errors.
              </p>
            </div>

            <div className="h-6" />
          </main>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer
          className="
            flex
            h-[64px]
            min-h-[64px]
            shrink-0
            items-center
            justify-between
            gap-4
            border-t
            border-slate-100
            bg-white
            px-6
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
              text-[11px]
              text-slate-400
            "
          >
            <CheckCircle2
              size={14}
              strokeWidth={2}
              className="shrink-0 text-emerald-500"
            />

            <span className="truncate">
              CSV format validated during upload
            </span>
          </div>

          <a
            href="/samples/invoiceflow-sample.csv"
            download="invoiceflow-sample.csv"
            className="
              flex
              h-9
              shrink-0
              items-center
              gap-2
              rounded-[9px]
              border
              border-slate-200
              bg-white
              px-3.5
              text-[11px]
              font-semibold
              text-slate-700
              transition
              duration-200
              hover:border-slate-300
              hover:bg-slate-50
              active:scale-[0.98]
            "
          >
            <Download
              size={13}
              strokeWidth={1.8}
            />

            Sample CSV
          </a>
        </footer>
      </aside>
    </>,
    document.body
  );
}

/* =========================================================
   COLUMN ROW
========================================================= */

function ColumnRow({
  name,
  last = false,
}: {
  name: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        grid
        grid-cols-[minmax(0,1fr)_96px]
        items-center
        px-4
        py-2.5
        ${!last ? "border-b border-slate-100" : ""}
      `}
    >
      <span
        className="
          truncate
          text-[12px]
          font-medium
          text-slate-700
        "
      >
        {name}
      </span>

      <span
        className="
          flex
          items-center
          gap-1.5
          text-[11px]
          font-medium
          text-emerald-600
        "
      >
        <CheckCircle2
          size={13}
          strokeWidth={2}
        />

        Required
      </span>
    </div>
  );
}

/* =========================================================
   RULE
========================================================= */

function Rule({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="
          mt-[7px]
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-blue-600
        "
      />

      <p
        className="
          text-[12px]
          leading-5
          text-slate-600
        "
      >
        {children}
      </p>
    </div>
  );
}