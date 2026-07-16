export interface InvoiceRecord {
    id: string;
    uploadId: string;
    invoiceNumber: string;
    vendor: string;
    amount: number;
    status: "Matched" | "Pending" | "Flagged";
}

export const invoices: InvoiceRecord[] = [
    {
        id: "inv-001",
        uploadId: "gst-april",
        invoiceNumber: "INV-1001",
        vendor: "Northwind Supplies",
        amount: 1280.5,
        status: "Matched",
    },
    {
        id: "inv-002",
        uploadId: "gst-april",
        invoiceNumber: "INV-1002",
        vendor: "Blue Harbor Ltd",
        amount: 940.0,
        status: "Pending",
    },
    {
        id: "inv-003",
        uploadId: "gst-april",
        invoiceNumber: "INV-1003",
        vendor: "Harbor Tech",
        amount: 1625.25,
        status: "Flagged",
    },
    {
        id: "inv-004",
        uploadId: "july-invoices",
        invoiceNumber: "INV-2001",
        vendor: "Apex Logistics",
        amount: 890.0,
        status: "Matched",
    },
    {
        id: "inv-005",
        uploadId: "july-invoices",
        invoiceNumber: "INV-2002",
        vendor: "Summit Retail",
        amount: 1110.75,
        status: "Pending",
    },
    {
        id: "inv-006",
        uploadId: "vendor-bills",
        invoiceNumber: "INV-3001",
        vendor: "Lumen Group",
        amount: 760.4,
        status: "Flagged",
    },
    {
        id: "inv-007",
        uploadId: "sales-register",
        invoiceNumber: "INV-4001",
        vendor: "Cedar Foods",
        amount: 2330.8,
        status: "Matched",
    },
    {
        id: "inv-008",
        uploadId: "sales-register",
        invoiceNumber: "INV-4002",
        vendor: "Northwind Supplies",
        amount: 1540.2,
        status: "Matched",
    },
];
