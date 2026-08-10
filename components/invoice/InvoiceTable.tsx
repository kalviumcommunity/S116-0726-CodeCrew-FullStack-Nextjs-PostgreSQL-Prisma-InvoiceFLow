"use client";

import {
  FileText,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Invoice } from "@/app/(dashboard)/invoices/page";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  invoices: Invoice[];

  onDeleteInvoice: (
    invoice: Invoice
  ) => void;
};

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles: Record<
  Invoice["status"],
  string
> = {
  Matched:
    "bg-emerald-50 text-emerald-700",

  Pending:
    "bg-amber-50 text-amber-700",

  Error:
    "bg-red-50 text-red-700",
};

/* =========================================================
   TABLE
========================================================= */

export default function InvoiceTable({
  invoices,
  onDeleteInvoice,
}: Props) {
  const router = useRouter();

  const [menuId, setMenuId] =
    useState<string | null>(null);

  /* =======================================================
     OPEN INVOICE PAGE
  ======================================================= */

  function openInvoice(
    invoice: Invoice
  ) {
    router.push(
      `/invoices/${invoice.id}`
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        mt-3
        overflow-visible
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-[0_2px_8px_rgba(15,23,42,0.04)]
      "
    >
      {/* HEADER */}

      <div
        className="
          grid
          grid-cols-12
          items-center
          rounded-t-[24px]
          border-b
          border-slate-200
          bg-slate-50/60
          px-6
          py-3
        "
      >
        <TableHeader className="col-span-2">
          Invoice
        </TableHeader>

        <TableHeader className="col-span-2">
          Vendor
        </TableHeader>

        <TableHeader className="col-span-2">
          GSTIN
        </TableHeader>

        <TableHeader className="col-span-1">
          Date
        </TableHeader>

        <TableHeader
          className="col-span-1"
          align="right"
        >
          Amount
        </TableHeader>

        <TableHeader
          className="col-span-1"
          align="right"
        >
          GST
        </TableHeader>

        <TableHeader
          className="col-span-1"
          align="center"
        >
          Status
        </TableHeader>

        <TableHeader className="col-span-1">
          Source
        </TableHeader>

        <TableHeader
          className="col-span-1"
          align="right"
        >
          Actions
        </TableHeader>
      </div>

      {/* EMPTY */}

      {invoices.length === 0 && (
        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
              "
            >
              <FileText
                size={22}
                strokeWidth={1.8}
                className="text-slate-400"
              />
            </div>

            <h3
              className="
                mt-3
                text-sm
                font-semibold
                text-slate-900
              "
            >
              No invoices found
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Try changing your
              search or filters.
            </p>
          </div>
        </div>
      )}

      {/* ROWS */}

      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          role="button"
          tabIndex={0}
          onClick={() =>
            openInvoice(invoice)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              openInvoice(invoice);
            }
          }}
          className="
            group
            grid
            min-h-[62px]
            grid-cols-12
            cursor-pointer
            items-center
            border-b
            border-slate-100
            px-6
            py-2
            transition
            last:border-b-0
            hover:bg-slate-50/70
          "
        >
          {/* INVOICE */}

          <div
            className="
              col-span-2
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[10px]
                bg-blue-50
              "
            >
              <FileText
                size={17}
                strokeWidth={1.8}
                className="text-blue-600"
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-slate-900
                  transition
                  group-hover:text-blue-600
                "
                title={invoice.id}
              >
                {invoice.id}
              </p>
            </div>
          </div>

          {/* VENDOR */}

          <div
            className="
              col-span-2
              truncate
              pr-4
              text-sm
              text-slate-700
            "
            title={invoice.vendor}
          >
            {invoice.vendor}
          </div>

          {/* GSTIN */}

          <div
            className="
              col-span-2
              truncate
              pr-4
              text-sm
              text-slate-500
            "
            title={invoice.gstin}
          >
            {invoice.gstin}
          </div>

          {/* DATE */}

          <div
            className="
              col-span-1
              truncate
              text-sm
              text-slate-600
            "
          >
            {invoice.date}
          </div>

          {/* AMOUNT */}

          <div
            className="
              col-span-1
              text-right
              text-sm
              font-semibold
              text-slate-900
            "
          >
            {invoice.amount}
          </div>

          {/* GST */}

          <div
            className="
              col-span-1
              text-right
              text-sm
              text-slate-600
            "
          >
            {invoice.gst}
          </div>

          {/* STATUS */}

          <div
            className="
              col-span-1
              flex
              justify-center
            "
          >
            <span
              className={`
                rounded-full
                px-3
                py-1
                text-[11px]
                font-semibold
                ${statusStyles[
                  invoice.status
                ]}
              `}
            >
              {invoice.status}
            </span>
          </div>

          {/* SOURCE */}

          <div
            className="
              col-span-1
              truncate
              pr-2
              text-sm
              text-slate-500
            "
            title={invoice.source}
          >
            {invoice.source}
          </div>

          {/* ACTIONS */}

          <div
            className="
              relative
              col-span-1
              flex
              justify-end
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() =>
                setMenuId(
                  menuId === invoice.id
                    ? null
                    : invoice.id
                )
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-900
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/30
              "
              title="More options"
              aria-label={`More options for ${invoice.id}`}
            >
              <MoreHorizontal
                size={18}
                strokeWidth={1.8}
              />
            </button>

            {/* DROPDOWN */}

            {menuId === invoice.id && (
              <div
                className="
                  absolute
                  right-0
                  top-9
                  z-50
                  w-44
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-1.5
                  shadow-[0_12px_30px_rgba(15,23,42,0.12)]
                "
              >
                {/* VIEW */}

                <MenuButton
                  icon={
                    <Eye
                      size={15}
                      strokeWidth={1.8}
                    />
                  }
                  label="View details"
                  onClick={() => {
                    setMenuId(null);
                    openInvoice(
                      invoice
                    );
                  }}
                />

                {/* DOWNLOAD */}

                <MenuButton
                  icon={
                    <Download
                      size={15}
                      strokeWidth={1.8}
                    />
                  }
                  label="Download"
                  onClick={() => {
                    downloadInvoice(
                      invoice
                    );
                    setMenuId(null);
                  }}
                />

                <div
                  className="
                    my-1
                    border-t
                    border-slate-100
                  "
                />

                {/* DELETE */}

                <button
                  type="button"
                  onClick={() => {
                    onDeleteInvoice(
                      invoice
                    );
                    setMenuId(null);
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2
                    text-left
                    text-sm
                    text-red-600
                    transition
                    hover:bg-red-50
                  "
                >
                  <Trash2
                    size={15}
                    strokeWidth={1.8}
                  />

                  Delete invoice
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* FOOTER */}

      <div
        className="
          flex
          h-[60px]
          items-center
          justify-between
          rounded-b-[24px]
          border-t
          border-slate-200
          px-6
        "
      >
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {invoices.length}
          </span>{" "}
          invoices
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DOWNLOAD
========================================================= */

function downloadInvoice(
  invoice: Invoice
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
    invoice.id,
    invoice.vendor,
    invoice.gstin,
    invoice.date,
    invoice.amount,
    invoice.gst,
    invoice.status,
    invoice.gstType ?? "",
    invoice.source,
  ];

  const csv = [
    headers,
    row,
  ]
    .map((line) =>
      line
        .map(
          (value) =>
            `"${String(
              value
            ).replace(
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
  link.download =
    `${invoice.id}.csv`;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(url);
}

/* =========================================================
   MENU BUTTON
========================================================= */

function MenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        gap-2
        rounded-lg
        px-3
        py-2
        text-left
        text-sm
        text-slate-700
        transition
        hover:bg-slate-50
      "
    >
      {icon}
      {label}
    </button>
  );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
  children,
  className = "",
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  return (
    <div
      className={`
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-500

        ${
          align === "center"
            ? "text-center"
            : align === "right"
              ? "text-right"
              : "text-left"
        }

        ${className}
      `}
    >
      {children}
    </div>
  );
}