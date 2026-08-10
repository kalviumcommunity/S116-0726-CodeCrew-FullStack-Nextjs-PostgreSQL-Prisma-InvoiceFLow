"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Search,
  SlidersHorizontal,
  X,
  XCircle,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type RowStatus = "Success" | "Failed";

interface CSVRow {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerGSTIN: string;
  productName: string;
  quantity: string;
  unitPrice: string;
  taxAmount: string;
  totalAmount: string;
  status: RowStatus;
}

/* =========================================================
   DEMO CSV DATA
   Later this will come from your upload/backend/database.
========================================================= */

const csvRows: CSVRow[] = [
  {
    invoiceNumber: "INV-1001",
    invoiceDate: "09-08-2026",
    customerName: "ABC Technologies",
    customerGSTIN: "27AABCA1234F1Z5",
    productName: "Dell Latitude 5440",
    quantity: "5",
    unitPrice: "₹48,000",
    taxAmount: "₹43,200",
    totalAmount: "₹2,83,200",
    status: "Success",
  },
  {
    invoiceNumber: "INV-1002",
    invoiceDate: "09-08-2026",
    customerName: "XYZ Solutions Pvt Ltd",
    customerGSTIN: "27AAXYZ5678G1Z2",
    productName: "HP ProBook 440",
    quantity: "3",
    unitPrice: "₹42,000",
    taxAmount: "₹22,680",
    totalAmount: "₹1,48,680",
    status: "Success",
  },
  {
    invoiceNumber: "INV-1003",
    invoiceDate: "08-08-2026",
    customerName: "TechVision India",
    customerGSTIN: "29AABCT9012H1Z8",
    productName: "Lenovo ThinkPad E14",
    quantity: "4",
    unitPrice: "₹45,500",
    taxAmount: "₹32,760",
    totalAmount: "₹2,14,760",
    status: "Success",
  },
  {
    invoiceNumber: "INV-1004",
    invoiceDate: "08-08-2026",
    customerName: "Nova Systems",
    customerGSTIN: "27AABCN3456K1Z6",
    productName: "Samsung Monitor 24",
    quantity: "10",
    unitPrice: "₹11,500",
    taxAmount: "₹20,700",
    totalAmount: "₹1,35,700",
    status: "Success",
  },
  {
    invoiceNumber: "INV-1005",
    invoiceDate: "07-08-2026",
    customerName: "Future Networks",
    customerGSTIN: "29AABCF7890L1Z4",
    productName: "Cisco Switch 24 Port",
    quantity: "2",
    unitPrice: "₹38,000",
    taxAmount: "₹13,680",
    totalAmount: "₹89,680",
    status: "Success",
  },
  {
    invoiceNumber: "INV-1006",
    invoiceDate: "07-08-2026",
    customerName: "Digital Works",
    customerGSTIN: "27AABCD1122M1Z9",
    productName: "TP-Link Router",
    quantity: "8",
    unitPrice: "₹4,500",
    taxAmount: "₹6,480",
    totalAmount: "₹42,480",
    status: "Success",
  },
  {
    invoiceNumber: "INV-1007",
    invoiceDate: "06-08-2026",
    customerName: "Smart Office India",
    customerGSTIN: "27AABCS3344N1Z7",
    productName: "Logitech Keyboard",
    quantity: "15",
    unitPrice: "₹1,200",
    taxAmount: "₹3,240",
    totalAmount: "₹21,240",
    status: "Failed",
  },
  {
    invoiceNumber: "INV-1008",
    invoiceDate: "06-08-2026",
    customerName: "Prime Infotech",
    customerGSTIN: "29AABCP5566Q1Z3",
    productName: "Dell OptiPlex 7010",
    quantity: "6",
    unitPrice: "₹52,000",
    taxAmount: "₹56,160",
    totalAmount: "₹3,68,160",
    status: "Success",
  },
  {
    invoiceNumber: "INV-1009",
    invoiceDate: "05-08-2026",
    customerName: "Orbit Computers",
    customerGSTIN: "27AABCO7788R1Z1",
    productName: "HP LaserJet Printer",
    quantity: "3",
    unitPrice: "₹18,500",
    taxAmount: "₹9,990",
    totalAmount: "₹65,490",
    status: "Success",
  },
  {
    invoiceNumber: "INV-1010",
    invoiceDate: "05-08-2026",
    customerName: "Vertex Technologies",
    customerGSTIN: "27AABCV9900S1Z5",
    productName: "APC UPS 1100VA",
    quantity: "5",
    unitPrice: "₹7,800",
    taxAmount: "₹7,020",
    totalAmount: "₹46,020",
    status: "Failed",
  },
];

/* =========================================================
   UPLOAD INFORMATION
========================================================= */

const uploadInfo = {
  fileName: "invoices_jun_2025.csv",
  fileSize: "24.8 MB",
  format: "CSV",
  encoding: "UTF-8",
  uploaded: "05 Aug 2025, 10:30 AM",
  uploadId: "#1",

  totalRows: "24,580",
  successfulRows: "23,870",
  failedRows: "710",
  successRate: "97.1%",
};

/* =========================================================
   PAGE
========================================================= */

export default function UploadDetailsPage() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Success" | "Failed"
  >("All");

  const [page, setPage] = useState(1);

  const rowsPerPage = 8;

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return csvRows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        row.invoiceNumber.toLowerCase().includes(query) ||
        row.customerName.toLowerCase().includes(query) ||
        row.customerGSTIN.toLowerCase().includes(query) ||
        row.productName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / rowsPerPage)
  );

  const safePage = Math.min(
    Math.max(page, 1),
    totalPages
  );

  const visibleRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  /* =======================================================
     SEARCH
  ======================================================= */

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  /* =======================================================
     STATUS FILTER
  ======================================================= */

  function handleStatusChange(
    value: "All" | "Success" | "Failed"
  ) {
    setStatusFilter(value);
    setPage(1);
  }

  /* =======================================================
     DOWNLOAD CSV
  ======================================================= */

  function downloadCSV() {
    const header = [
      "Invoice Number",
      "Invoice Date",
      "Customer Name",
      "Customer GSTIN",
      "Product Name",
      "Quantity",
      "Unit Price",
      "Tax Amount",
      "Total Amount",
      "Status",
    ];

    const rows = csvRows.map((row) => [
      row.invoiceNumber,
      row.invoiceDate,
      row.customerName,
      row.customerGSTIN,
      row.productName,
      row.quantity,
      row.unitPrice,
      row.taxAmount,
      row.totalAmount,
      row.status,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = uploadInfo.fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <div className="mx-auto w-full max-w-[1500px] px-6 py-6">

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <div className="flex items-center justify-between gap-6">

          <div className="min-w-0">

            <Link
              href="/history"
              className="
                inline-flex
                items-center
                gap-1.5
                text-[12px]
                font-medium
                text-slate-500
                transition
                hover:text-blue-600
              "
            >
              <ArrowLeft size={14} />
              Back to Upload History
            </Link>

            <div className="mt-4 flex items-center gap-3.5">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[12px]
                  bg-emerald-50
                  text-emerald-600
                "
              >
                <FileSpreadsheet
                  size={21}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">

                <h1
                  className="
                    truncate
                    text-[22px]
                    font-semibold
                    tracking-[-0.03em]
                    text-slate-900
                  "
                >
                  {uploadInfo.fileName}
                </h1>

                <p className="mt-1 text-[12px] text-slate-500">
                  {uploadInfo.fileSize} · Uploaded{" "}
                  {uploadInfo.uploaded}
                </p>

              </div>

              <span
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-full
                  bg-emerald-50
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-emerald-700
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Completed
              </span>

            </div>
          </div>

          <button
            type="button"
            onClick={downloadCSV}
            className="
              flex
              h-9
              shrink-0
              items-center
              gap-2
              rounded-[9px]
              bg-blue-600
              px-4
              text-[12px]
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              active:scale-[0.98]
            "
          >
            <Download size={14} />
            Download CSV
          </button>

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="mt-6 grid grid-cols-4 gap-4">

          <SummaryCard
            label="Total Rows"
            value={uploadInfo.totalRows}
          />

          <SummaryCard
            label="Successful"
            value={uploadInfo.successfulRows}
            valueClassName="text-emerald-600"
          />

          <SummaryCard
            label="Failed"
            value={uploadInfo.failedRows}
            valueClassName="text-red-500"
          />

          <SummaryCard
            label="Success Rate"
            value={uploadInfo.successRate}
            valueClassName="text-blue-600"
          />

        </section>

        {/* =================================================
            FILE INFORMATION
        ================================================= */}

        <section
          className="
            mt-5
            rounded-[18px]
            border
            border-slate-200
            bg-white
            shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          "
        >

          <div className="border-b border-slate-100 px-5 py-4">

            <h2 className="text-[14px] font-semibold text-slate-900">
              File Information
            </h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Details about this upload.
            </p>

          </div>

          <div className="grid grid-cols-3 divide-x divide-slate-100">

            <InfoItem
              label="File Name"
              value={uploadInfo.fileName}
            />

            <InfoItem
              label="File Size"
              value={uploadInfo.fileSize}
            />

            <InfoItem
              label="Format"
              value={uploadInfo.format}
            />

            <InfoItem
              label="Encoding"
              value={uploadInfo.encoding}
            />

            <InfoItem
              label="Uploaded"
              value={uploadInfo.uploaded}
            />

            <InfoItem
              label="Upload ID"
              value={uploadInfo.uploadId}
            />

          </div>

        </section>

        {/* =================================================
            CSV PREVIEW
        ================================================= */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-[18px]
            border
            border-slate-200
            bg-white
            shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          "
        >

          {/* HEADER */}

          <div className="flex items-center justify-between gap-5 border-b border-slate-100 px-5 py-4">

            <div>

              <h2 className="text-[14px] font-semibold text-slate-900">
                CSV Preview
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                View the invoice rows included in this upload.
              </p>

            </div>

            <div className="flex items-center gap-2">

              {/* SEARCH */}

              <div
                className="
                  flex
                  h-9
                  w-[230px]
                  items-center
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  px-3
                "
              >

                <Search
                  size={14}
                  className="shrink-0 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    handleSearch(event.target.value)
                  }
                  placeholder="Search rows..."
                  className="
                    ml-2
                    min-w-0
                    flex-1
                    bg-transparent
                    text-[12px]
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearch("")}
                    className="text-slate-400 transition hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}

              </div>

              {/* STATUS FILTER */}

              <div className="relative">

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    handleStatusChange(
                      event.target.value as
                        | "All"
                        | "Success"
                        | "Failed"
                    )
                  }
                  className="
                    h-9
                    appearance-none
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    pl-3
                    pr-9
                    text-[12px]
                    font-medium
                    text-slate-600
                    outline-none
                    transition
                    hover:bg-slate-50
                    focus:border-blue-300
                  "
                >
                  <option value="All">
                    All Rows
                  </option>

                  <option value="Success">
                    Successful
                  </option>

                  <option value="Failed">
                    Failed
                  </option>
                </select>

                <SlidersHorizontal
                  size={13}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

              </div>

            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px] border-collapse">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50/60">

                  <TableHeader>
                    #
                  </TableHeader>

                  <TableHeader>
                    Invoice Number
                  </TableHeader>

                  <TableHeader>
                    Invoice Date
                  </TableHeader>

                  <TableHeader>
                    Customer
                  </TableHeader>

                  <TableHeader>
                    GSTIN
                  </TableHeader>

                  <TableHeader>
                    Product
                  </TableHeader>

                  <TableHeader align="center">
                    Qty
                  </TableHeader>

                  <TableHeader align="right">
                    Unit Price
                  </TableHeader>

                  <TableHeader align="right">
                    Tax
                  </TableHeader>

                  <TableHeader align="right">
                    Total
                  </TableHeader>

                  <TableHeader align="center">
                    Status
                  </TableHeader>

                </tr>

              </thead>

              <tbody>

                {visibleRows.length === 0 ? (

                  <tr>

                    <td
                      colSpan={11}
                      className="py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <Search
                          size={22}
                          className="text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          No rows found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Try changing your search or filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  visibleRows.map((row, index) => {

                    const rowNumber =
                      (safePage - 1) *
                        rowsPerPage +
                      index +
                      1;

                    const failed =
                      row.status === "Failed";

                    return (
                      <tr
                        key={row.invoiceNumber}
                        className={`
                          border-b
                          border-slate-100
                          transition
                          last:border-b-0
                          ${
                            failed
                              ? "bg-red-50/30"
                              : "hover:bg-slate-50/60"
                          }
                        `}
                      >

                        <td className="px-4 py-3 text-[11px] text-slate-400">
                          {rowNumber}
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-[12px] font-semibold text-slate-800">
                            {row.invoiceNumber}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-[12px] text-slate-600">
                          {row.invoiceDate}
                        </td>

                        <td className="max-w-[180px] px-4 py-3">

                          <span
                            className="
                              block
                              truncate
                              text-[12px]
                              font-medium
                              text-slate-700
                            "
                            title={row.customerName}
                          >
                            {row.customerName}
                          </span>

                        </td>

                        <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-slate-500">
                          {row.customerGSTIN}
                        </td>

                        <td className="max-w-[190px] px-4 py-3">

                          <span
                            className="
                              block
                              truncate
                              text-[12px]
                              text-slate-600
                            "
                            title={row.productName}
                          >
                            {row.productName}
                          </span>

                        </td>

                        <td className="px-4 py-3 text-center text-[12px] font-medium text-slate-700">
                          {row.quantity}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-[12px] text-slate-600">
                          {row.unitPrice}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-[12px] text-slate-600">
                          {row.taxAmount}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-[12px] font-semibold text-slate-800">
                          {row.totalAmount}
                        </td>

                        <td className="px-4 py-3 text-center">

                          {failed ? (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-red-50
                                px-2.5
                                py-1
                                text-[10px]
                                font-semibold
                                text-red-600
                              "
                            >
                              <XCircle size={12} />
                              Failed
                            </span>

                          ) : (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-emerald-50
                                px-2.5
                                py-1
                                text-[10px]
                                font-semibold
                                text-emerald-600
                              "
                            >
                              <CheckCircle2 size={12} />
                              Success
                            </span>

                          )}

                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}

          <div
            className="
              flex
              min-h-[58px]
              items-center
              justify-between
              gap-4
              border-t
              border-slate-200
              px-5
            "
          >

            <p className="text-[11px] text-slate-500">

              Showing{" "}

              <span className="font-semibold text-slate-700">

                {filteredRows.length === 0
                  ? 0
                  : (safePage - 1) *
                      rowsPerPage +
                    1}

                –
                
                {Math.min(
                  safePage * rowsPerPage,
                  filteredRows.length
                )}

              </span>{" "}

              of{" "}

              <span className="font-semibold text-slate-700">
                {filteredRows.length}
              </span>{" "}

              rows

            </p>

            <div className="flex items-center gap-1.5">

              <button
                type="button"
                disabled={safePage === 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                className="
                  flex
                  h-8
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-slate-200
                  px-2.5
                  text-[11px]
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronLeft size={13} />
                Previous
              </button>

              <span className="px-2 text-[11px] text-slate-400">
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                  )
                }
                className="
                  flex
                  h-8
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-slate-200
                  px-2.5
                  text-[11px]
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Next
                <ChevronRight size={13} />
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            FAILED ROWS
        ================================================= */}

        <section
          className="
            mt-5
            rounded-[18px]
            border
            border-red-100
            bg-white
            shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          "
        >

          <div className="flex items-center justify-between gap-4 border-b border-red-100 px-5 py-4">

            <div>

              <h2 className="text-[14px] font-semibold text-slate-900">
                Failed Rows
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                Rows that could not be validated during processing.
              </p>

            </div>

            <span
              className="
                rounded-full
                bg-red-50
                px-3
                py-1.5
                text-[11px]
                font-semibold
                text-red-600
              "
            >
              {uploadInfo.failedRows} failed
            </span>

          </div>

          <div className="divide-y divide-slate-100">

            <FailedRow
              row="7"
              invoice="INV-1007"
              reason="GSTIN mismatch"
            />

            <FailedRow
              row="10"
              invoice="INV-1010"
              reason="Invalid customer GSTIN"
            />

            <FailedRow
              row="124"
              invoice="INV-1124"
              reason="Invalid invoice date"
            />

          </div>

          <div className="px-5 py-3.5">

            <button
              type="button"
              className="
                text-[11px]
                font-semibold
                text-blue-600
                transition
                hover:text-blue-700
              "
            >
              View all failed rows
            </button>

          </div>

        </section>

        <div className="h-8" />

      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div
      className="
        rounded-[16px]
        border
        border-slate-200
        bg-white
        px-5
        py-4
        shadow-[0_2px_8px_rgba(15,23,42,0.025)]
      "
    >
      <p className="text-[11px] font-medium text-slate-400">
        {label}
      </p>

      <p
        className={`
          mt-2
          text-[22px]
          font-semibold
          tracking-[-0.03em]
          ${valueClassName}
        `}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-5 py-4">

      <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-slate-400">
        {label}
      </p>

      <p
        className="
          mt-1.5
          truncate
          text-[12px]
          font-semibold
          text-slate-800
        "
        title={value}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      className={`
        whitespace-nowrap
        px-4
        py-3
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.05em]
        text-slate-500
        ${
          align === "center"
            ? "text-center"
            : align === "right"
              ? "text-right"
              : "text-left"
        }
      `}
    >
      {children}
    </th>
  );
}

/* =========================================================
   FAILED ROW
========================================================= */

function FailedRow({
  row,
  invoice,
  reason,
}: {
  row: string;
  invoice: string;
  reason: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 px-5 py-3.5">

      <div className="flex min-w-0 items-center gap-3">

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-red-50
            text-red-500
          "
        >
          <XCircle size={15} />
        </div>

        <div className="min-w-0">

          <p className="text-[12px] font-semibold text-slate-800">
            Row {row} · {invoice}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {reason}
          </p>

        </div>

      </div>

      <button
        type="button"
        className="
          shrink-0
          text-[11px]
          font-semibold
          text-blue-600
          transition
          hover:text-blue-700
        "
      >
        View row
      </button>

    </div>
  );
}