import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uploadId: string }> }
) {
    try {
        const { uploadId } = await params;
        const searchParams = request.nextUrl.searchParams;

        const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
        const pageSize = Math.max(1, Number.parseInt(searchParams.get("pageSize") ?? "20", 10) || 20);

        const [totalCount, invoices] = await Promise.all([
            prisma.invoice.count({ where: { uploadId } }),
            prisma.invoice.findMany({
                where: { uploadId },
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { invoiceDate: "asc" },
                select: {
                    id: true,
                    invoiceNumber: true,
                    customerName: true,
                    invoiceDate: true,
                    amount: true,
                    status: true,
                    errorMessage: true,
                },
            }),
        ]);

        return NextResponse.json({
            invoices: invoices.map((invoice) => ({
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                customerName: invoice.customerName,
                invoiceDate: invoice.invoiceDate,
                amount: Number(invoice.amount),
                status: invoice.status,
                errorMessage: invoice.errorMessage,
            })),
            page,
            pageSize,
            totalCount,
        });
    } catch (error) {
        console.error("Failed to fetch invoices for upload", error);
        return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
    }
}
