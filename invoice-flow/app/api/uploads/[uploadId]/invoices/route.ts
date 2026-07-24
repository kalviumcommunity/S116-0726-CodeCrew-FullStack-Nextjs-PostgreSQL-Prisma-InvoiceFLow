import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface RouteContext {
    params: Promise<{ uploadId: string }>;
}

// GET /api/uploads/:uploadId/invoices
// Returns invoice rows already shaped to match the existing
// InvoiceRecord type used by InvoiceTable/InvoiceStatusBadge, so the
// frontend just swaps its mock array for this response.
export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const { uploadId } = await context.params;

        const invoices = await prisma.invoice.findMany({
            where: { uploadId },
            orderBy: { invoiceDate: "asc" },
        });

        const shaped = invoices.map((invoice) => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            customerName: invoice.customerName,
            invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
            amount: Number(invoice.amount),
            status: invoice.status === "PROCESSING" ? "MISMATCH" : invoice.status, // safety fallback, shouldn't normally show as PROCESSING once completed
            remarks: invoice.errorMessage ?? "-",
        }));

        return NextResponse.json({ success: true, invoices: shaped });
    } catch (error) {
        console.error("Failed to fetch invoices for upload", error);
        return NextResponse.json({ success: false, error: "Failed to fetch invoices" }, { status: 500 });
    }
}
