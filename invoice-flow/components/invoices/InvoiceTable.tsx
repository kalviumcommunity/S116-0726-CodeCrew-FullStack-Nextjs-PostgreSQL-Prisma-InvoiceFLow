import { FileText } from "lucide-react";
import { InvoiceRow } from "@/components/invoices/InvoiceRow";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import type { InvoiceRecord } from "@/components/invoices/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoiceTableProps {
    invoices: InvoiceRecord[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
    if (invoices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <div className="rounded-full bg-white p-4 text-slate-600 shadow-sm">
                    <FileText className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">No invoices found.</h3>
            </div>
        );
    }

    return (
        <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                <div className="max-h-[620px] overflow-auto">
                    <Table className="min-w-[900px]">
                        <TableHeader className="sticky top-0 z-10 bg-slate-50">
                            <TableRow>
                                <TableHead>Invoice Number</TableHead>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>Invoice Date</TableHead>
                                <TableHead>Amount (₹)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice, index) => (
                                <TableRow key={invoice.id} className={index % 2 === 1 ? "bg-slate-50/70" : "bg-white"}>
                                    <TableCell className="font-medium text-slate-900">{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.customerName}</TableCell>
                                    <TableCell>{invoice.invoiceDate}</TableCell>
                                    <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <InvoiceStatusBadge status={invoice.status} />
                                    </TableCell>
                                    <TableCell>{invoice.remarks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="space-y-4 lg:hidden">
                {invoices.map((invoice) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                ))}
            </div>
        </>
    );
}
