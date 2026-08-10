"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import HistoryTable from "./HistoryTable";
import type { Upload } from "@/app/(dashboard)/history/page";

const uploads: Upload[] = [
  {
    id: 1,
    file: "invoices_jun_2025.csv",
    uploaded: "Today, 10:30 AM",
    uploadedAt: "Today, 10:30 AM",
    rows: "24,580",
    success: "23,870",
    failed: "710",
    status: "Completed",
    size: "24.8 MB",
  },
  {
    id: 2,
    file: "invoices_may_2025.csv",
    uploaded: "Yesterday, 4:45 PM",
    uploadedAt: "Yesterday, 4:45 PM",
    rows: "18,240",
    success: "17,802",
    failed: "438",
    status: "Completed",
    size: "18.2 MB",
  },
  {
    id: 3,
    file: "invoices_apr_2025.csv",
    uploaded: "4 Aug 2025, 9:20 AM",
    uploadedAt: "4 Aug 2025, 9:20 AM",
    rows: "22,310",
    success: "21,645",
    failed: "665",
    status: "Processing",
    size: "22.1 MB",
  },
  {
    id: 4,
    file: "invoices_mar_2025.csv",
    uploaded: "3 Aug 2025, 2:15 PM",
    uploadedAt: "3 Aug 2025, 2:15 PM",
    rows: "31,680",
    success: "—",
    failed: "—",
    status: "Queued",
    size: "31.6 MB",
  },
  {
    id: 5,
    file: "invoices_feb_2025.csv",
    uploaded: "2 Aug 2025, 11:30 AM",
    uploadedAt: "2 Aug 2025, 11:30 AM",
    rows: "15,320",
    success: "0",
    failed: "15,320",
    status: "Failed",
    size: "15.3 MB",
  },
];