import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface RouteContext {
    params: Promise<{ uploadId: string }>;
}

// GET /api/uploads/:uploadId
// Returns the upload record plus a live breakdown of invoice statuses.
// The frontend polls this while status === "PROCESSING" to drive the
// progress bar, then stops polling once status === "COMPLETED"/"FAILED".
export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const { uploadId } = await context.params;

        const upload = await prisma.upload.findUnique({ where: { id: uploadId } });

        if (!upload) {
            return NextResponse.json({ success: false, error: "Upload not found" }, { status: 404 });
        }

        const [matchCount, mismatchCount, failedCount, processingCount] = await Promise.all([
            prisma.invoice.count({ where: { uploadId, status: "MATCH" } }),
            prisma.invoice.count({ where: { uploadId, status: "MISMATCH" } }),
            prisma.invoice.count({ where: { uploadId, status: "FAILED" } }),
            prisma.invoice.count({ where: { uploadId, status: "PROCESSING" } }),
        ]);

        const processedRows = matchCount + mismatchCount + failedCount;

        return NextResponse.json({
            success: true,
            upload: {
                id: upload.id,
                fileName: upload.fileName,
                uploadDate: upload.uploadDate,
                status: upload.status,
                totalRows: upload.totalRows,
                processedRows,
                matchCount,
                mismatchCount,
                failedCount,
                processingCount,
                progressPercent:
                    upload.totalRows > 0 ? Math.round((processedRows / upload.totalRows) * 100) : 0,
            },
        });
    } catch (error) {
        console.error("Failed to fetch upload status", error);
        return NextResponse.json({ success: false, error: "Failed to fetch upload status" }, { status: 500 });
    }
}
