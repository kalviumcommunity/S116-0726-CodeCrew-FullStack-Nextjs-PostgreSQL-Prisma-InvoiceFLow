"use client";

import {
  ArrowLeft,
  Download,
  FileText,
  Building2,
  CalendarDays,
  Hash,
  Receipt,
  Trash2,
  Pencil,
  CheckCircle2,
  X,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import {
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type InvoiceStatus =
  | "Matched"
  | "Pending"
  | "Error";

interface Invoice {
  id: string;
  vendor: string;
  gstin: string;
  date: string;
  amount: string;
  gst: string;
  status: InvoiceStatus;
  source: string;
  gstType?: "IGST" | "CGST + SGST";
}

/* =========================================================
   DEMO DATA
========================================================= */

const baseInvoices: Invoice[] = [
  {
    id: "INV-2025-001",
    vendor: "Dell Technologies",
    gstin: "27ABCDE1234F1Z5",
    date: "06 Aug 2025",
    amount: "₹1,24,500",
    gst: "₹22,410",
    status: "Matched",
    source: "aug_upload.csv",
    gstType: "IGST",
  },
  {
    id: "INV-2025-002",
    vendor: "HP India",
    gstin: "29AAACH7409R1ZX",
    date: "05 Aug 2025",
    amount: "₹84,220",
    gst: "₹15,159",
    status: "Pending",
    source: "aug_upload.csv",
    gstType: "CGST + SGST",
  },
  {
    id: "INV-2025-003",
    vendor: "Lenovo",
    gstin: "07AACCL6789P1ZT",
    date: "04 Aug 2025",
    amount: "₹42,980",
    gst: "₹7,736",
    status: "Error",
    source: "july_upload.csv",
    gstType: "IGST",
  },
  {
    id: "INV-2025-004",
    vendor: "Asus",
    gstin: "24AAECA1023M1ZF",
    date: "03 Aug 2025",
    amount: "₹65,900",
    gst: "₹11,862",
    status: "Matched",
    source: "july_upload.csv",
    gstType: "CGST + SGST",
  },
];

const invoices: Invoice[] = Array.from(
  { length: 248 },
  (_, index) => {
    const template =
      baseInvoices[
        index % baseInvoices.length
      ];

    return {
      ...template,
      id: `INV-2025-${String(
        index + 1
      ).padStart(3, "0")}`,
    };
  }
);

/* =========================================================
   PAGE
========================================================= */

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  /* =======================================================
     INVOICE ID
  ======================================================= */

  const invoiceId =
    typeof params.id === "string"
      ? params.id
      : "";

  /* =======================================================
     FIND INVOICE
  ======================================================= */

  const invoice = invoices.find(
    (item) => item.id === invoiceId
  );

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!invoice) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
            "
          >
            <FileText
              size={24}
              className="text-slate-400"
            />
          </div>

          <h1
            className="
              mt-4
              text-lg
              font-semibold
              text-slate-900
            "
          >
            Invoice not found
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            This invoice does not exist.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/invoices")
            }
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <ArrowLeft size={16} />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     DOWNLOAD
  ======================================================= */

  function handleDownload(
    currentInvoice: Invoice
  ) {
    const headers = [
      "Invoice",
      "Vendor",
      "GSTIN",
      "Date",
      "Amount",
      "GST",
      "Status",
      "GST Type",
      "Source",
    ];

    const row = [
      currentInvoice.id,
      currentInvoice.vendor,
      currentInvoice.gstin,
      currentInvoice.date,
      currentInvoice.amount,
      currentInvoice.gst,
      currentInvoice.status,
      currentInvoice.gstType ?? "",
      currentInvoice.source,
    ];

    const csv = [
      headers,
      row,
    ]
      .map((line) =>
        line
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = `${currentInvoice.id}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function handleDelete() {
    setShowDeleteModal(false);

    /*
     * Demo/local data for now.
     * Later this will delete the invoice
     * from Supabase/PostgreSQL.
     */

    router.push("/invoices");
  }

  /* =======================================================
     STATUS STYLES
  ======================================================= */

  const statusStyles: Record<
    InvoiceStatus,
    string
  > = {
    Matched:
      "border-emerald-100 bg-emerald-50 text-emerald-700",

    Pending:
      "border-amber-100 bg-amber-50 text-amber-700",

    Error:
      "border-red-100 bg-red-50 text-red-700",
  };

  const statusIconStyles: Record<
    InvoiceStatus,
    string
  > = {
    Matched:
      "text-emerald-600",

    Pending:
      "text-amber-600",

    Error:
      "text-red-600",
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <div className="pb-8">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div
          className="
            mb-5
            flex
            items-center
            justify-between
          "
        >
          <button
            type="button"
            onClick={() =>
              router.push("/invoices")
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-slate-900
            "
          >
            <ArrowLeft size={17} />
            Back to Invoices
          </button>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={() =>
                handleDownload(invoice)
              }
              className="
                inline-flex
                h-9
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-xs
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
              "
            >
              <Download size={15} />
              Download CSV
            </button>

            {/* EDIT */}

            <button
              type="button"
              className="
                inline-flex
                h-9
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-xs
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
              "
            >
              <Pencil size={15} />
              Edit
            </button>
          </div>
        </div>

        {/* =================================================
            INVOICE HEADER
        ================================================= */}

        <section
          className="
            rounded-[20px]
            border
            border-slate-200
            bg-white
            shadow-[0_2px_8px_rgba(15,23,42,0.04)]
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-6
              px-6
              py-5
            "
          >
            {/* LEFT */}

            <div
              className="
                flex
                min-w-0
                items-center
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-blue-50
                "
              >
                <FileText
                  size={22}
                  strokeWidth={1.8}
                  className="text-blue-600"
                />
              </div>

              <div className="min-w-0">
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <h1
                    className="
                      truncate
                      text-[20px]
                      font-semibold
                      tracking-[-0.025em]
                      text-slate-900
                    "
                  >
                    {invoice.id}
                  </h1>

                  <span
                    className={`
                      inline-flex
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      ${statusStyles[
                        invoice.status
                      ]}
                    `}
                  >
                    <CheckCircle2
                      size={12}
                      className={
                        statusIconStyles[
                          invoice.status
                        ]
                      }
                    />

                    {invoice.status}
                  </span>
                </div>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  {invoice.vendor}
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div
              className="
                shrink-0
                text-right
              "
            >
              <p
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Invoice Date
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-slate-800
                "
              >
                {invoice.date}
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            INFORMATION GRID
        ================================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-4
          "
        >

          {/* INVOICE INFORMATION */}

          <section
            className="
              rounded-[20px]
              border
              border-slate-200
              bg-white
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                "
              >
                <FileText
                  size={16}
                  className="text-slate-600"
                />
              </div>

              <h2
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                Invoice Information
              </h2>
            </div>

            <div className="mt-5">
              <InfoRow
                icon={<Hash size={15} />}
                label="Invoice number"
                value={invoice.id}
              />

              <InfoRow
                icon={
                  <Building2 size={15} />
                }
                label="Vendor"
                value={invoice.vendor}
              />

              <InfoRow
                icon={
                  <FileText size={15} />
                }
                label="GSTIN"
                value={invoice.gstin}
              />

              <InfoRow
                icon={
                  <CalendarDays size={15} />
                }
                label="Invoice date"
                value={invoice.date}
              />
            </div>
          </section>

          {/* SOURCE INFORMATION */}

          <section
            className="
              rounded-[20px]
              border
              border-slate-200
              bg-white
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                "
              >
                <Receipt
                  size={16}
                  className="text-slate-600"
                />
              </div>

              <h2
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                Source Information
              </h2>
            </div>

            <div className="mt-5">
              <InfoRow
                icon={
                  <FileText size={15} />
                }
                label="Source CSV"
                value={invoice.source}
              />

              <InfoRow
                icon={
                  <Receipt size={15} />
                }
                label="GST type"
                value={
                  invoice.gstType ??
                  "Not specified"
                }
              />

              <InfoRow
                icon={
                  <CheckCircle2 size={15} />
                }
                label="Processing status"
                value={invoice.status}
              />
            </div>
          </section>
        </div>

        {/* =================================================
            FINANCIAL SUMMARY
        ================================================= */}

        <section
          className="
            mt-4
            rounded-[20px]
            border
            border-slate-200
            bg-white
            p-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-blue-50
              "
            >
              <Receipt
                size={16}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                Financial Summary
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500
                "
              >
                Invoice amount and applicable
                GST.
              </p>
            </div>
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-3
              gap-3
            "
          >
            <AmountCard
              label="Invoice Amount"
              value={invoice.amount}
            />

            <AmountCard
              label="GST"
              value={invoice.gst}
            />

            <AmountCard
              label="Total Amount"
              value={invoice.amount}
              highlighted
            />
          </div>
        </section>

        {/* =================================================
            INVOICE ITEMS
        ================================================= */}

        <section
          className="
            mt-4
            overflow-hidden
            rounded-[20px]
            border
            border-slate-200
            bg-white
          "
        >
          <div
            className="
              border-b
              border-slate-200
              px-5
              py-4
            "
          >
            <h2
              className="
                text-sm
                font-semibold
                text-slate-900
              "
            >
              Invoice Items
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              Extracted line items from the
              invoice.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[700px]
              "
            >
              <thead>
                <tr
                  className="
                    border-b
                    border-slate-100
                    bg-slate-50/60
                  "
                >
                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Item
                  </th>

                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Description
                  </th>

                  <th
                    className="
                      px-5
                      py-3
                      text-center
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Qty
                  </th>

                  <th
                    className="
                      px-5
                      py-3
                      text-right
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Rate
                  </th>

                  <th
                    className="
                      px-5
                      py-3
                      text-right
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    GST
                  </th>

                  <th
                    className="
                      px-5
                      py-3
                      text-right
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  className="
                    border-b
                    border-slate-100
                  "
                >
                  <td
                    className="
                      px-5
                      py-4
                      text-sm
                      font-medium
                      text-slate-900
                    "
                  >
                    01
                  </td>

                  <td
                    className="
                      px-5
                      py-4
                      text-sm
                      text-slate-600
                    "
                  >
                    Hardware / Computer Equipment
                  </td>

                  <td
                    className="
                      px-5
                      py-4
                      text-center
                      text-sm
                      text-slate-600
                    "
                  >
                    1
                  </td>

                  <td
                    className="
                      px-5
                      py-4
                      text-right
                      text-sm
                      text-slate-700
                    "
                  >
                    {invoice.amount}
                  </td>

                  <td
                    className="
                      px-5
                      py-4
                      text-right
                      text-sm
                      text-slate-600
                    "
                  >
                    {invoice.gst}
                  </td>

                  <td
                    className="
                      px-5
                      py-4
                      text-right
                      text-sm
                      font-semibold
                      text-slate-900
                    "
                  >
                    {invoice.amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
          "
        >
          <button
            type="button"
            onClick={() =>
              setShowDeleteModal(true)
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-200
              bg-white
              px-4
              py-2.5
              text-xs
              font-semibold
              text-red-600
              transition
              hover:bg-red-50
            "
          >
            <Trash2 size={15} />
            Delete Invoice
          </button>

          <button
            type="button"
            onClick={() =>
              handleDownload(invoice)
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
            "
          >
            <Download size={15} />
            Download CSV
          </button>
        </div>
      </div>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {showDeleteModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-900/30
            p-4
            backdrop-blur-[2px]
          "
          onMouseDown={() =>
            setShowDeleteModal(false)
          }
        >
          <div
            className="
              w-full
              max-w-[400px]
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-[0_20px_60px_rgba(15,23,42,0.18)]
            "
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-50
                "
              >
                <Trash2
                  size={18}
                  className="text-red-600"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="
                  rounded-lg
                  p-1.5
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <X size={18} />
              </button>
            </div>

            <h3
              className="
                mt-4
                text-base
                font-semibold
                text-slate-900
              "
            >
              Delete invoice?
            </h3>

            <p
              className="
                mt-1.5
                text-sm
                leading-6
                text-slate-500
              "
            >
              Are you sure you want to delete{" "}
              <span
                className="
                  font-semibold
                  text-slate-700
                "
              >
                {invoice.id}
              </span>
              ? This action cannot be undone.
            </p>

            <div
              className="
                mt-6
                flex
                justify-end
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                "
              >
                Delete Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        border-b
        border-slate-100
        py-3
        last:border-b-0
      "
    >
      <div
        className="
          flex
          items-center
          gap-2.5
        "
      >
        <span className="text-slate-400">
          {icon}
        </span>

        <span
          className="
            text-xs
            text-slate-500
          "
        >
          {label}
        </span>
      </div>

      <span
        className="
          max-w-[55%]
          truncate
          text-right
          text-xs
          font-semibold
          text-slate-800
        "
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   AMOUNT CARD
========================================================= */

function AmountCard({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`
        rounded-[14px]
        border
        p-4
        ${
          highlighted
            ? "border-blue-100 bg-blue-50/50"
            : "border-slate-200 bg-white"
        }
      `}
    >
      <p
        className="
          text-[11px]
          font-medium
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-2
          text-lg
          font-semibold
          tracking-[-0.02em]
          ${
            highlighted
              ? "text-blue-700"
              : "text-slate-900"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}