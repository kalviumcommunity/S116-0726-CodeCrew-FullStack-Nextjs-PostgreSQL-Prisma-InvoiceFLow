import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";
    const sort = searchParams.get("sort") || "Newest First";
    
    const skip = (page - 1) * limit;

    const where: any = {
      upload: {
        userId: session.user.id,
      },
    };

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== "All") {
      where.status = status;
    }

    const orderBy: any = {};
    if (sort === "Oldest First") {
      orderBy.invoiceDate = "asc";
    } else {
      orderBy.invoiceDate = "desc";
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: { upload: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    const mappedInvoices = invoices.map((inv: any) => {
      // FIX: Prisma Decimal serialization safely
      const numAmount = inv.amount ? Number(inv.amount.toString()) : 0;
      const formattedAmount = formatCurrency(numAmount);
      const formattedDate = formatDateString(inv.invoiceDate);

      const uiStatus = inv.status || "PROCESSING";

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
        source: inv.upload?.fileName || "upload.csv",
      };
    });

    return NextResponse.json({
      invoices: mappedInvoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("GET /api/invoices error:", err);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
