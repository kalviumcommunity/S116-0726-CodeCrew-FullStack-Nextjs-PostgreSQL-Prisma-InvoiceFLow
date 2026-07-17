import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import type { InvoiceRecord } from "@/components/invoices/data";

interface InvoiceRowProps {
    invoice: InvoiceRecord;
}

export function InvoiceRow({ invoice }: InvoiceRowProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md lg:hidden">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-semibold text-slate-900">{invoice.invoiceNumber}</p>
                    <p className="mt-1 text-sm text-slate-500">{invoice.customerName}</p>
                </div>
                <InvoiceStatusBadge status={invoice.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div>
                    <p className="text-slate-400">Invoice Date</p>
                    <p className="font-medium text-slate-900">{invoice.invoiceDate}</p>
                </div>
                <div>
                    <p className="text-slate-400">Amount</p>
                    <p className="font-medium text-slate-900">₹{invoice.amount.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-slate-400">Remarks</p>
                    <p className="font-medium text-slate-900">{invoice.remarks}</p>
                </div>
            </div>
        </div>
    );
}
