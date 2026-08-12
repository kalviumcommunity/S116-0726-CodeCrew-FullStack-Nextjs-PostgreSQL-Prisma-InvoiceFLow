import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function formatDate(d: Date): string {
  try {
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d.toISOString();
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const [uploads, total] = await Promise.all([
      prisma.upload.findMany({
        where: { userId: session.user.id },
        orderBy: { uploadDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.upload.count({
        where: { userId: session.user.id },
      }),
    ]);

    const mappedUploads = uploads.map((up: any) => {
      let uiStatus: "Completed" | "Processing" | "Queued" | "Failed" = "Completed";
      if (up.status === "PROCESSING") uiStatus = "Processing";
      else if (up.status === "PENDING") uiStatus = "Queued";
      else if (up.status === "FAILED") uiStatus = "Failed";
      else uiStatus = "Completed";

      return {
        id: up.id,
        file: up.fileName,
        uploaded: formatDate(up.uploadDate),
        uploadedAt: up.uploadDate.toISOString(),
        rows: up.totalRows.toLocaleString("en-IN"),
        rawRows: up.totalRows,
        success: up.successfulRows.toLocaleString("en-IN"),
        rawSuccess: up.successfulRows,
        failed: up.failedRows.toLocaleString("en-IN"),
        rawFailed: up.failedRows,
        status: uiStatus,
        dbStatus: up.status,
        size: "CSV",
      };
    });

    return NextResponse.json({
      uploads: mappedUploads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("GET /api/upload error:", err);
    return NextResponse.json(
      { error: "Failed to fetch uploads" },
      { status: 500 }
    );
  }
}
