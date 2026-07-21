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
        id: "gst-july-2026",
        fileName: "GST_July_2026.csv",
        uploadDate: "2026-07-18",
        fileSize: "2.6 MB",
        totalRows: 276,
        success: 276,
        failed: 0,
        status: "COMPLETED",
        summary: "Monthly GST invoice batch for July 2026.",
    },
    {
        id: "vendor-bills-june",
        fileName: "Vendor_Bills_June.csv",
        uploadDate: "2026-07-16",
        fileSize: "3.2 MB",
        totalRows: 328,
        success: 314,
        failed: 14,
        status: "FAILED",
        summary: "Vendor bills had several malformed rows.",
    },
    {
        id: "sales-q2",
        fileName: "Sales_Invoices_Q2.csv",
        uploadDate: "2026-07-14",
        fileSize: "4.1 MB",
        totalRows: 612,
        success: 612,
        failed: 0,
        status: "COMPLETED",
        summary: "Quarterly sales invoices for Q2 processed.",
    },
    {
        id: "customer-invoices-july",
        fileName: "Customer_Invoices_July.csv",
        uploadDate: "2026-07-12",
        fileSize: "1.9 MB",
        totalRows: 198,
        success: 196,
        failed: 2,
        status: "COMPLETED",
        summary: "Customer invoices for July.",
    },
    {
        id: "purchase-register",
        fileName: "Purchase_Register.csv",
        uploadDate: "2026-07-10",
        fileSize: "2.8 MB",
        totalRows: 284,
        success: 280,
        failed: 4,
        status: "COMPLETED",
        summary: "Purchase register import.",
    },
    {
        id: "tax-filing-data",
        fileName: "Tax_Filing_Data.csv",
        uploadDate: "2026-07-08",
        fileSize: "1.4 MB",
        totalRows: 142,
        success: 142,
        failed: 0,
        status: "COMPLETED",
        summary: "Tax filing dataset for accounting team.",
    },
    {
        id: "supplier-payments",
        fileName: "Supplier_Payments.csv",
        uploadDate: "2026-07-06",
        fileSize: "3.6 MB",
        totalRows: 362,
        success: 345,
        failed: 17,
        status: "FAILED",
        summary: "Supplier payments contained currency format errors.",
    },
    {
        id: "export-invoices",
        fileName: "Export_Invoices.csv",
        uploadDate: "2026-06-30",
        fileSize: "2.2 MB",
        totalRows: 224,
        success: 224,
        failed: 0,
        status: "COMPLETED",
        summary: "Invoices for exports processed.",
    },
    {
        id: "accounts-receivable",
        fileName: "Accounts_Receivable.csv",
        uploadDate: "2026-06-25",
        fileSize: "2.9 MB",
        totalRows: 296,
        success: 296,
        failed: 0,
        status: "COMPLETED",
        summary: "AR aging import.",
    },
    {
        id: "accounts-payable",
        fileName: "Accounts_Payable.csv",
        uploadDate: "2026-06-20",
        fileSize: "3.0 MB",
        totalRows: 310,
        success: 308,
        failed: 2,
        status: "COMPLETED",
        summary: "AP ledger file.",
    },
];
