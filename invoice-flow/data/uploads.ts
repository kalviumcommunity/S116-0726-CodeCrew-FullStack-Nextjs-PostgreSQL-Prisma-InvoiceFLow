export interface UploadRecord {
    id: string;
    fileName: string;
    uploadDate: string;
    fileSize: string;
    totalRows: number;
    success: number;
    failed: number;
    status: "PROCESSING" | "COMPLETED" | "FAILED";
    summary: string;
}

export const uploads: UploadRecord[] = [
    {
        id: "gst-april",
        fileName: "GST_April.csv",
        uploadDate: "2026-07-14",
        fileSize: "2.4 MB",
        totalRows: 248,
        success: 242,
        failed: 6,
        status: "COMPLETED",
        summary: "Quarterly GST invoices imported successfully.",
    },
    {
        id: "july-invoices",
        fileName: "July_Invoices.csv",
        uploadDate: "2026-07-12",
        fileSize: "1.8 MB",
        totalRows: 184,
        success: 180,
        failed: 4,
        status: "PROCESSING",
        summary: "Invoice validation is currently in progress.",
    },
    {
        id: "vendor-bills",
        fileName: "Vendor_Bills.csv",
        uploadDate: "2026-07-09",
        fileSize: "3.1 MB",
        totalRows: 312,
        success: 298,
        failed: 14,
        status: "FAILED",
        summary: "Several rows were rejected during parsing.",
    },
    {
        id: "sales-register",
        fileName: "Sales_Register.csv",
        uploadDate: "2026-07-07",
        fileSize: "4.2 MB",
        totalRows: 610,
        success: 602,
        failed: 8,
        status: "COMPLETED",
        summary: "Sales register file processed without issues.",
    },
];
