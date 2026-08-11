import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const { uploadId } = await params;

    const upload = await prisma.upload.findUnique({
      where: { id: uploadId },
    });

    if (!upload) {
      return NextResponse.json(
        { error: "Upload not found" },
        { status: 404 }
      );
    }

    const matchCount = await prisma.invoice.count({
      where: { uploadId, status: "MATCH" },
    });

    const mismatchCount = await prisma.invoice.count({
      where: { uploadId, status: "MISMATCH" },
    });

    const failedCount = await prisma.invoice.count({
      where: { uploadId, status: "FAILED" },
    });

    const processingCount = await prisma.invoice.count({
      where: { uploadId, status: "PROCESSING" },
    });

    const totalRows = upload.totalRows > 0 ? upload.totalRows : 1;
    const processedCount = matchCount + mismatchCount + failedCount;
    const progressPercent =
      upload.status === "COMPLETED"
        ? 100
        : Math.min(100, Math.round((processedCount / totalRows) * 100));

    return NextResponse.json({
      upload,
      progressPercent,
      counts: {
        match: matchCount,
        mismatch: mismatchCount,
        failed: failedCount,
        processing: processingCount,
        total: upload.totalRows,
      },
    });
  } catch (err: any) {
    console.error("GET /api/uploads/[uploadId] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch upload details" },
      { status: 500 }
    );
  }
}
