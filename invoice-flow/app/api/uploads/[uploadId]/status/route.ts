import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ uploadId: string }> }
) {
    try {
        const { uploadId } = await params;

        const upload = await prisma.upload.findUnique({ where: { id: uploadId } });

        if (!upload) {
            return NextResponse.json({ error: "Upload not found" }, { status: 404 });
        }

        const processedRows = await prisma.invoice.count({
            where: { uploadId, status: { not: "PROCESSING" } },
        });

        return NextResponse.json({
            status: upload.status,
            totalRows: upload.totalRows,
            processedRows,
            successfulRows: upload.successfulRows,
            failedRows: upload.failedRows,
        });
    } catch (error) {
        console.error("Failed to fetch upload status", error);
        return NextResponse.json({ error: "Failed to fetch upload status" }, { status: 500 });
    }
}
