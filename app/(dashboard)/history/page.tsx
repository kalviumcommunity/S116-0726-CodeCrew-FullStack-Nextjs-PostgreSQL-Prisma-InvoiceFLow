"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import HistoryToolbar from "@/components/history/HistoryToolbar";
import HistoryTable from "@/components/history/HistoryTable";

/* =========================================================
   TYPES
========================================================= */

export type UploadStatus =
  | "Completed"
  | "Processing"
  | "Queued"
  | "Failed";

export type Upload = {
  id: number;
  file: string;
  uploaded: string;
  uploadedAt: string;
  rows: string;
  success: string;
  failed: string;
  status: UploadStatus;
  size: string;
};

export type StatusFilter =
  | "All Status"
  | UploadStatus;

export type DateFilter =
  | "All Dates"
  | "Last 7 Days"
  | "Last 30 Days"
  | "Custom Range";

export type SortFilter =
  | "Newest First"
  | "Oldest First";

/* =========================================================
   DATA
========================================================= */

export const initialUploads: Upload[] = [
  {
    id: 1,
    file: "invoices_jun_2025.csv",
    uploaded: "05 Aug 2025, 10:30 AM",
    uploadedAt: "2025-08-05T10:30:00",
    rows: "24,580",
    success: "23,870",
    failed: "710",
    status: "Completed",
    size: "24.8 MB",
  },
  {
    id: 2,
    file: "invoices_may_2025.csv",
    uploaded: "04 Aug 2025, 4:45 PM",
    uploadedAt: "2025-08-04T16:45:00",
    rows: "18,240",
    success: "17,802",
    failed: "438",
    status: "Completed",
    size: "18.2 MB",
  },
  {
    id: 3,
    file: "invoices_apr_2025.csv",
    uploaded: "04 Aug 2025",
    uploadedAt: "2025-08-04T12:00:00",
    rows: "22,310",
    success: "21,645",
    failed: "665",
    status: "Processing",
    size: "22.1 MB",
  },
  {
    id: 4,
    file: "invoices_mar_2025.csv",
    uploaded: "03 Aug 2025",
    uploadedAt: "2025-08-03T12:00:00",
    rows: "31,680",
    success: "--",
    failed: "--",
    status: "Queued",
    size: "31.6 MB",
  },
  {
    id: 5,
    file: "invoices_feb_2025.csv",
    uploaded: "02 Aug 2025",
    uploadedAt: "2025-08-02T12:00:00",
    rows: "15,320",
    success: "0",
    failed: "15,320",
    status: "Failed",
    size: "15.3 MB",
  },
  {
    id: 6,
    file: "invoices_jan_2025.csv",
    uploaded: "01 Aug 2025",
    uploadedAt: "2025-08-01T12:00:00",
    rows: "19,860",
    success: "19,120",
    failed: "740",
    status: "Completed",
    size: "19.7 MB",
  },
  {
    id: 7,
    file: "invoices_dec_2024.csv",
    uploaded: "31 Jul 2025",
    uploadedAt: "2025-07-31T12:00:00",
    rows: "28,910",
    success: "28,100",
    failed: "810",
    status: "Completed",
    size: "28.4 MB",
  },
  {
    id: 8,
    file: "invoices_nov_2024.csv",
    uploaded: "30 Jul 2025",
    uploadedAt: "2025-07-30T12:00:00",
    rows: "20,140",
    success: "19,610",
    failed: "530",
    status: "Completed",
    size: "20.5 MB",
  },
  {
    id: 9,
    file: "invoices_oct_2024.csv",
    uploaded: "29 Jul 2025",
    uploadedAt: "2025-07-29T12:00:00",
    rows: "17,450",
    success: "17,110",
    failed: "340",
    status: "Completed",
    size: "17.8 MB",
  },
  {
    id: 10,
    file: "invoices_sep_2024.csv",
    uploaded: "28 Jul 2025",
    uploadedAt: "2025-07-28T12:00:00",
    rows: "16,020",
    success: "15,730",
    failed: "290",
    status: "Completed",
    size: "16.6 MB",
  },
  {
    id: 11,
    file: "invoices_aug_2024.csv",
    uploaded: "27 Jul 2025",
    uploadedAt: "2025-07-27T12:00:00",
    rows: "21,360",
    success: "20,980",
    failed: "360",
    status: "Completed",
    size: "21.9 MB",
  },
  {
    id: 12,
    file: "invoices_jul_2024.csv",
    uploaded: "26 Jul 2025",
    uploadedAt: "2025-07-26T12:00:00",
    rows: "23,880",
    success: "23,210",
    failed: "670",
    status: "Completed",
    size: "23.7 MB",
  },
  {
    id: 13,
    file: "invoices_jun_2024.csv",
    uploaded: "25 Jul 2025",
    uploadedAt: "2025-07-25T12:00:00",
    rows: "18,560",
    success: "18,120",
    failed: "440",
    status: "Completed",
    size: "18.0 MB",
  },
  {
    id: 14,
    file: "invoices_may_2024.csv",
    uploaded: "24 Jul 2025",
    uploadedAt: "2025-07-24T12:00:00",
    rows: "24,220",
    success: "23,550",
    failed: "670",
    status: "Completed",
    size: "24.1 MB",
  },
  {
    id: 15,
    file: "invoices_apr_2024.csv",
    uploaded: "23 Jul 2025",
    uploadedAt: "2025-07-23T12:00:00",
    rows: "20,410",
    success: "19,870",
    failed: "540",
    status: "Completed",
    size: "20.7 MB",
  },
  {
    id: 16,
    file: "invoices_mar_2024.csv",
    uploaded: "22 Jul 2025",
    uploadedAt: "2025-07-22T12:00:00",
    rows: "19,040",
    success: "18,450",
    failed: "590",
    status: "Completed",
    size: "19.1 MB",
  },
  {
    id: 17,
    file: "invoices_feb_2024.csv",
    uploaded: "21 Jul 2025",
    uploadedAt: "2025-07-21T12:00:00",
    rows: "16,780",
    success: "15,990",
    failed: "790",
    status: "Completed",
    size: "16.3 MB",
  },
  {
    id: 18,
    file: "invoices_jan_2024.csv",
    uploaded: "20 Jul 2025",
    uploadedAt: "2025-07-20T12:00:00",
    rows: "15,920",
    success: "15,410",
    failed: "510",
    status: "Completed",
    size: "15.8 MB",
  },
  {
    id: 19,
    file: "invoices_dec_2023.csv",
    uploaded: "19 Jul 2025",
    uploadedAt: "2025-07-19T12:00:00",
    rows: "15,330",
    success: "0",
    failed: "15,330",
    status: "Failed",
    size: "15.9 MB",
  },
  {
    id: 20,
    file: "invoices_nov_2023.csv",
    uploaded: "18 Jul 2025",
    uploadedAt: "2025-07-18T12:00:00",
    rows: "14,620",
    success: "14,120",
    failed: "500",
    status: "Completed",
    size: "14.8 MB",
  },
  {
    id: 21,
    file: "invoices_oct_2023.csv",
    uploaded: "17 Jul 2025",
    uploadedAt: "2025-07-17T12:00:00",
    rows: "18,220",
    success: "17,880",
    failed: "340",
    status: "Completed",
    size: "18.5 MB",
  },
  {
    id: 22,
    file: "invoices_sep_2023.csv",
    uploaded: "16 Jul 2025",
    uploadedAt: "2025-07-16T12:00:00",
    rows: "21,450",
    success: "20,930",
    failed: "520",
    status: "Completed",
    size: "21.2 MB",
  },
  {
    id: 23,
    file: "invoices_aug_2023.csv",
    uploaded: "15 Jul 2025",
    uploadedAt: "2025-07-15T12:00:00",
    rows: "12,840",
    success: "12,510",
    failed: "330",
    status: "Completed",
    size: "13.1 MB",
  },
  {
    id: 24,
    file: "invoices_jul_2023.csv",
    uploaded: "14 Jul 2025",
    uploadedAt: "2025-07-14T12:00:00",
    rows: "17,620",
    success: "16,980",
    failed: "640",
    status: "Completed",
    size: "17.9 MB",
  },
  {
    id: 25,
    file: "invoices_jun_2023.csv",
    uploaded: "13 Jul 2025",
    uploadedAt: "2025-07-13T12:00:00",
    rows: "14,230",
    success: "13,890",
    failed: "340",
    status: "Completed",
    size: "14.4 MB",
  },
  {
    id: 26,
    file: "invoices_may_2023.csv",
    uploaded: "12 Jul 2025",
    uploadedAt: "2025-07-12T12:00:00",
    rows: "19,780",
    success: "19,100",
    failed: "680",
    status: "Completed",
    size: "20.1 MB",
  },
  {
    id: 27,
    file: "invoices_apr_2023.csv",
    uploaded: "11 Jul 2025",
    uploadedAt: "2025-07-11T12:00:00",
    rows: "13,560",
    success: "0",
    failed: "13,560",
    status: "Failed",
    size: "13.8 MB",
  },
  {
    id: 28,
    file: "invoices_mar_2023.csv",
    uploaded: "10 Jul 2025",
    uploadedAt: "2025-07-10T12:00:00",
    rows: "16,430",
    success: "--",
    failed: "--",
    status: "Queued",
    size: "16.7 MB",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function HistoryPage() {
  const router = useRouter();

  const [uploads, setUploads] =
    useState<Upload[]>(initialUploads);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<StatusFilter>("All Status");

  const [dateRange, setDateRange] =
    useState<DateFilter>("All Dates");

  const [sort, setSort] =
    useState<SortFilter>("Newest First");

  const [customFrom, setCustomFrom] =
    useState("");

  const [customTo, setCustomTo] =
    useState("");

  const [page, setPage] =
    useState(1);

  const ITEMS_PER_PAGE = 20;

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredUploads = useMemo(() => {
    let result = [...uploads];

    /* SEARCH */

    const query =
      search.trim().toLowerCase();

    if (query) {
      result = result.filter((upload) => {
        return (
          upload.file
            .toLowerCase()
            .includes(query) ||
          upload.uploaded
            .toLowerCase()
            .includes(query) ||
          upload.status
            .toLowerCase()
            .includes(query)
        );
      });
    }

    /* STATUS */

    if (status !== "All Status") {
      result = result.filter(
        (upload) =>
          upload.status === status
      );
    }

    /* DATE FILTER */

    if (dateRange !== "All Dates") {
      let startDate: Date | null = null;
      let endDate: Date | null = null;

      /*
       * The demo data is from August 2025.
       * So relative filters are based on the
       * newest upload in the dataset.
       */

      const newestUpload = uploads.reduce<
        Upload | null
      >((latest, upload) => {
        if (!latest) {
          return upload;
        }

        return new Date(
          upload.uploadedAt
        ).getTime() >
          new Date(
            latest.uploadedAt
          ).getTime()
          ? upload
          : latest;
      }, null);

      if (newestUpload) {
        const newestDate =
          new Date(
            newestUpload.uploadedAt
          );

        const referenceDay =
          new Date(
            newestDate.getFullYear(),
            newestDate.getMonth(),
            newestDate.getDate()
          );

        /* LAST 7 DAYS */

        if (
          dateRange === "Last 7 Days"
        ) {
          startDate =
            new Date(referenceDay);

          startDate.setDate(
            startDate.getDate() - 6
          );

          endDate =
            new Date(referenceDay);

          endDate.setHours(
            23,
            59,
            59,
            999
          );
        }

        /* LAST 30 DAYS */

        if (
          dateRange === "Last 30 Days"
        ) {
          startDate =
            new Date(referenceDay);

          startDate.setDate(
            startDate.getDate() - 29
          );

          endDate =
            new Date(referenceDay);

          endDate.setHours(
            23,
            59,
            59,
            999
          );
        }
      }

      /* CUSTOM RANGE */

      if (
        dateRange === "Custom Range" &&
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

        if (
          !Number.isNaN(
            from.getTime()
          ) &&
          !Number.isNaN(
            to.getTime()
          ) &&
          from <= to
        ) {
          startDate = from;
          endDate = to;
        }
      }

      /* APPLY DATE FILTER */

      if (startDate && endDate) {
        result = result.filter(
          (upload) => {
            const uploadDate =
              new Date(
                upload.uploadedAt
              );

            return (
              uploadDate >=
                startDate! &&
              uploadDate <=
                endDate!
            );
          }
        );
      }
    }

    /* SORT */

    result.sort((a, b) => {
      const dateA =
        new Date(
          a.uploadedAt
        ).getTime();

      const dateB =
        new Date(
          b.uploadedAt
        ).getTime();

      if (
        sort === "Oldest First"
      ) {
        return dateA - dateB;
      }

      return dateB - dateA;
    });

    return result;
  }, [
    uploads,
    search,
    status,
    dateRange,
    sort,
    customFrom,
    customTo,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredUploads.length /
          ITEMS_PER_PAGE
      )
    );

  const safePage =
    Math.min(
      Math.max(page, 1),
      totalPages
    );

  const visibleUploads =
    filteredUploads.slice(
      (safePage - 1) *
        ITEMS_PER_PAGE,
      safePage *
        ITEMS_PER_PAGE
    );

  /* =======================================================
     HANDLERS
  ======================================================= */

  function handleSearch(
    value: string
  ) {
    setSearch(value);
    setPage(1);
  }

  function handleStatus(
    value: string
  ) {
    const validStatuses: StatusFilter[] =
      [
        "All Status",
        "Completed",
        "Processing",
        "Queued",
        "Failed",
      ];

    if (
      !validStatuses.includes(
        value as StatusFilter
      )
    ) {
      return;
    }

    setStatus(
      value as StatusFilter
    );

    setPage(1);
  }

  function handleDateRange(
    value: string
  ) {
    const validDateFilters: DateFilter[] =
      [
        "All Dates",
        "Last 7 Days",
        "Last 30 Days",
        "Custom Range",
      ];

    if (
      !validDateFilters.includes(
        value as DateFilter
      )
    ) {
      return;
    }

    const nextDate =
      value as DateFilter;

    setDateRange(nextDate);
    setPage(1);

    if (
      nextDate !==
      "Custom Range"
    ) {
      setCustomFrom("");
      setCustomTo("");
    }
  }

  function handleCustomRange(
    from: string,
    to: string
  ) {
    setCustomFrom(from);
    setCustomTo(to);
    setDateRange("Custom Range");
    setPage(1);
  }

  function handleSort(
    value: string
  ) {
    if (
      value !== "Newest First" &&
      value !== "Oldest First"
    ) {
      return;
    }

    setSort(
      value as SortFilter
    );

    setPage(1);
  }

  /* =======================================================
     VIEW
  ======================================================= */

  function handleView(
    upload: Upload
  ) {
    router.push(
      `/history/${upload.id}`
    );
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function handleDelete(
    upload: Upload
  ) {
    setUploads((current) =>
      current.filter(
        (item) =>
          item.id !== upload.id
      )
    );

    /*
     * Reset to page 1 after deletion
     * so pagination never points to
     * an invalid page.
     */

    setPage(1);
  }

  /* =======================================================
     RETRY
  ======================================================= */

  function handleRetry(
    upload: Upload
  ) {
    setUploads((current) =>
      current.map((item) =>
        item.id === upload.id
          ? {
              ...item,
              status:
                "Processing",
            }
          : item
      )
    );
  }

  /* =======================================================
     CSV HELPERS
  ======================================================= */

  function createCSV(
    rows: string[][]
  ) {
    return rows
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
  }

  function downloadCSV(
    csv: string,
    filename: string
  ) {
    const blob =
      new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

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
     DOWNLOAD SINGLE UPLOAD
  ======================================================= */

  function downloadUpload(
    upload: Upload
  ) {
    const rows = [
      [
        "File",
        "Uploaded",
        "Rows",
        "Success",
        "Failed",
        "Status",
        "Size",
      ],
      [
        upload.file,
        upload.uploaded,
        upload.rows,
        upload.success,
        upload.failed,
        upload.status,
        upload.size,
      ],
    ];

    downloadCSV(
      createCSV(rows),
      upload.file
    );
  }

  /* =======================================================
     EXPORT FILTERED HISTORY
  ======================================================= */

  function exportCSV() {
    if (
      filteredUploads.length ===
      0
    ) {
      return;
    }

    const header = [
      "File",
      "Uploaded",
      "Rows",
      "Success",
      "Failed",
      "Status",
      "Size",
    ];

    const rows =
      filteredUploads.map(
        (upload) => [
          upload.file,
          upload.uploaded,
          upload.rows,
          upload.success,
          upload.failed,
          upload.status,
          upload.size,
        ]
      );

    downloadCSV(
      createCSV([
        header,
        ...rows,
      ]),
      "invoice-upload-history.csv"
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full">
      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <section className="mb-3">
        <h1
          className="
            text-2xl
            font-semibold
            tracking-[-0.025em]
            text-slate-900
          "
        >
          Upload History
        </h1>

        <p
          className="
            text-xs
            text-slate-500
          "
        >
          View and manage all CSV uploads.
        </p>
      </section>

      {/* ===================================================
          TOOLBAR
      =================================================== */}

      <HistoryToolbar
        search={search}
        status={status}
        dateRange={dateRange}
        sort={sort}
        customFrom={customFrom}
        customTo={customTo}
        onSearch={handleSearch}
        onStatusChange={handleStatus}
        onDateChange={handleDateRange}
        onCustomRange={
          handleCustomRange
        }
        onSortChange={handleSort}
        onExport={exportCSV}
      />

      {/* ===================================================
          TABLE
      =================================================== */}

      <HistoryTable
        uploads={visibleUploads}
        totalUploads={
          filteredUploads.length
        }
        page={safePage}
        totalPages={totalPages}
        onView={handleView}
        onDownload={downloadUpload}
        onDelete={handleDelete}
        onRetry={handleRetry}
        onPageChange={setPage}
      />
    </div>
  );
}