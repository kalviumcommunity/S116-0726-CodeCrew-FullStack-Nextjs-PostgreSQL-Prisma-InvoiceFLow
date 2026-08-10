"use client";

import { useMemo, useState } from "react";

import InvoiceToolbar from "@/components/invoice/InvoiceToolbar";
import InvoiceTable from "@/components/invoice/InvoiceTable";

/* =========================================================
   TYPES
========================================================= */

export type InvoiceStatus =
  | "Matched"
  | "Pending"
  | "Error";

export type StatusFilter =
  | "All"
  | "Matched"
  | "Pending"
  | "Error";

export type DateFilter =
  | "All Dates"
  | "Last 7 Days"
  | "Last 30 Days"
  | "Custom Range";

export type SortFilter =
  | "Newest First"
  | "Oldest First";

export interface Invoice {
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
   SAMPLE DATA
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

const initialInvoices: Invoice[] = Array.from(
  { length: 248 },
  (_, index) => {
    const template =
      baseInvoices[index % baseInvoices.length];

    return {
      ...template,
      id: `INV-2025-${String(index + 1).padStart(
        3,
        "0"
      )}`,
    };
  }
);

/* =========================================================
   DATE HELPERS
========================================================= */

function parseInvoiceDate(
  dateString: string
): Date {
  const [day, month, year] =
    dateString.split(" ");

  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  return new Date(
    Number(year),
    monthMap[month] ?? 0,
    Number(day)
  );
}

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
}

function endOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function InvoicesPage() {
  const [invoices, setInvoices] =
    useState<Invoice[]>(initialInvoices);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<StatusFilter>("All");

  const [dateRange, setDateRange] =
    useState<DateFilter>("All Dates");

  const [customFrom, setCustomFrom] =
    useState("");

  const [customTo, setCustomTo] =
    useState("");

  const [sort, setSort] =
    useState<SortFilter>("Newest First");

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredInvoices = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    /*
     * Demo data is from August 2025.
     * Use the newest invoice as the reference
     * date so Last 7 / Last 30 work correctly
     * with the demo data.
     */

    const newestInvoice =
      invoices.reduce<Invoice | null>(
        (latest, invoice) => {
          if (!latest) {
            return invoice;
          }

          const currentTime =
            parseInvoiceDate(
              invoice.date
            ).getTime();

          const latestTime =
            parseInvoiceDate(
              latest.date
            ).getTime();

          return currentTime > latestTime
            ? invoice
            : latest;
        },
        null
      );

    const referenceDate =
      newestInvoice
        ? parseInvoiceDate(
            newestInvoice.date
          )
        : new Date();

    const referenceDay =
      startOfDay(referenceDate);

    const referenceEnd =
      endOfDay(referenceDate);

    /* Last 7 Days */

    const sevenDaysAgo =
      new Date(referenceDay);

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 6
    );

    /* Last 30 Days */

    const thirtyDaysAgo =
      new Date(referenceDay);

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 29
    );

    const result = invoices.filter(
      (invoice) => {
        /* SEARCH */

        const matchesSearch =
          query === "" ||
          invoice.id
            .toLowerCase()
            .includes(query) ||
          invoice.vendor
            .toLowerCase()
            .includes(query) ||
          invoice.gstin
            .toLowerCase()
            .includes(query) ||
          invoice.source
            .toLowerCase()
            .includes(query);

        /* STATUS */

        const matchesStatus =
          status === "All" ||
          invoice.status === status;

        /* DATE */

        const invoiceDate =
          parseInvoiceDate(
            invoice.date
          );

        let matchesDate = true;

        if (
          dateRange ===
          "Last 7 Days"
        ) {
          matchesDate =
            invoiceDate >=
              sevenDaysAgo &&
            invoiceDate <=
              referenceEnd;
        }

        if (
          dateRange ===
          "Last 30 Days"
        ) {
          matchesDate =
            invoiceDate >=
              thirtyDaysAgo &&
            invoiceDate <=
              referenceEnd;
        }

        if (
          dateRange ===
          "Custom Range"
        ) {
          if (
            customFrom &&
            customTo
          ) {
            const from =
              new Date(
                `${customFrom}T00:00:00`
              );

            const to =
              new Date(
                `${customTo}T23:59:59.999`
              );

            matchesDate =
              invoiceDate >= from &&
              invoiceDate <= to;
          }
        }

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDate
        );
      }
    );

    /* SORT */

    result.sort((a, b) => {
      const dateA =
        parseInvoiceDate(
          a.date
        ).getTime();

      const dateB =
        parseInvoiceDate(
          b.date
        ).getTime();

      return sort ===
        "Newest First"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [
    invoices,
    search,
    status,
    dateRange,
    customFrom,
    customTo,
    sort,
  ]);

  /* =======================================================
     CUSTOM DATE RANGE
  ======================================================= */

  function handleCustomRange(
    from: string,
    to: string
  ) {
    setCustomFrom(from);
    setCustomTo(to);
    setDateRange("Custom Range");
  }

  /* =======================================================
     DELETE INVOICE
  ======================================================= */

  function handleDeleteInvoice(
    invoice: Invoice
  ) {
    /*
     * Local/demo delete for now.
     * Backend deletion will be added later.
     */

    setInvoices((current) =>
      current.filter(
        (item) =>
          item.id !== invoice.id
      )
    );
  }

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  function handleExport() {
    if (
      filteredInvoices.length === 0
    ) {
      return;
    }

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

    const rows =
      filteredInvoices.map(
        (invoice) => [
          invoice.id,
          invoice.vendor,
          invoice.gstin,
          invoice.date,
          invoice.amount,
          invoice.gst,
          invoice.status,
          invoice.gstType ?? "",
          invoice.source,
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
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
      "invoices.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div>
      {/* PAGE HEADER */}

      <section className="mb-3">
        <h1
          className="
            text-2xl
            font-semibold
            tracking-[-0.025em]
            text-slate-900
          "
        >
          Invoices
        </h1>

        <p className="text-xs text-slate-500">
          View, search and manage all
          extracted invoices.
        </p>
      </section>

      {/* TOOLBAR */}

      <InvoiceToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        dateRange={dateRange}
        onDateRangeChange={(value) => {
          setDateRange(value);

          if (
            value !==
            "Custom Range"
          ) {
            setCustomFrom("");
            setCustomTo("");
          }
        }}
        customFrom={customFrom}
        customTo={customTo}
        onCustomRange={
          handleCustomRange
        }
        sort={sort}
        onSortChange={setSort}
        onExport={handleExport}
      />

      {/* TABLE */}

      <InvoiceTable
        invoices={filteredInvoices}
        onDeleteInvoice={
          handleDeleteInvoice
        }
      />
    </div>
  );
}