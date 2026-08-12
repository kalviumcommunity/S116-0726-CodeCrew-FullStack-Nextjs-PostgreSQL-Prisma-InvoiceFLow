import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function formatDateString(d: Date): string {
  try {
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d.toISOString().split("T")[0];
  }
}

function formatCurrency(val: number): string {
  try {
    return `₹${val.toLocaleString("en-IN")}`;
  } catch {
    return `₹${val}`;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uploadId } = await params;

    const upload = await prisma.upload.findUnique({
      where: { id: uploadId, userId: session.user.id },
    });

    if (!upload) {
      return NextResponse.json(
        { error: "Upload not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";
    
    const skip = (page - 1) * limit;

    const where: any = { uploadId };

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== "All") {
      if (status === "Success") where.status = "MATCH";
      if (status === "Failed") where.status = { in: ["FAILED", "MISMATCH"] };
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({
        where,
      }),
    ]);

    const mappedInvoices = invoices.map((inv: any) => {
      const numAmount = Number(inv.amount);
      const formattedAmount = formatCurrency(numAmount);
      const formattedDate = formatDateString(inv.invoiceDate);

      let uiStatus: "Matched" | "Pending" | "Error" = "Pending";
      if (inv.status === "MATCH") uiStatus = "Matched";
      else if (inv.status === "MISMATCH" || inv.status === "FAILED") uiStatus = "Error";
      else if (inv.status === "PROCESSING") uiStatus = "Pending";

      return {
        id: inv.id,
        dbId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        vendor: inv.customerName,
        customerName: inv.customerName,
        gstin: "N/A",
        date: formattedDate,
        invoiceDate: inv.invoiceDate.toISOString(),
        amount: formattedAmount,
        rawAmount: numAmount,
        gst: "₹0",
        status: uiStatus,
        dbStatus: inv.status,
        errorMessage: inv.errorMessage,
        source: upload.fileName,
      };
    });

    return NextResponse.json({
      invoices: mappedInvoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("GET /api/upload/[uploadId]/invoices error:", err);
    return NextResponse.json(
      { error: "Failed to fetch upload invoices" },
      { status: 500 }
    );
  }
}
