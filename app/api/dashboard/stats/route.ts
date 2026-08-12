import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [uploadsAgg, invoicesAgg] = await Promise.all([
      prisma.upload.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.invoice.groupBy({
        by: ["status"],
        where: { upload: { userId } },
        _count: { _all: true },
      }),
    ]);

    let totalUploads = 0;
    let runningJobs = 0;
    for (const group of uploadsAgg) {
      totalUploads += group._count._all;
      if (group.status === "PROCESSING" || group.status === "PENDING") {
        runningJobs += group._count._all;
      }
    }

    let totalInvoices = 0;
    let failedRows = 0;
    let successCount = 0;
    for (const group of invoicesAgg) {
      totalInvoices += group._count._all;
      if (group.status === "FAILED" || group.status === "MISMATCH") {
        failedRows += group._count._all;
      }
      if (group.status === "MATCH") {
        successCount += group._count._all;
      }
    }

    return NextResponse.json({
      totalUploads,
      runningJobs,
      totalInvoices,
      failedRows,
      successCount,
    });
  } catch (err: any) {
    console.error("GET /api/dashboard/stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
