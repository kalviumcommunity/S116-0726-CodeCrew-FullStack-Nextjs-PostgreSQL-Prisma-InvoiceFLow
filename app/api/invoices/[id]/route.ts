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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find invoice and verify ownership via the upload relation
    const inv = await prisma.invoice.findFirst({
      where: {
        id,
        upload: { userId: session.user.id },
      },
      include: { upload: true },
    });

    if (!inv) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const numAmount = Number(inv.amount);

    let uiStatus: "Matched" | "Pending" | "Error" = "Pending";
    if (inv.status === "MATCH") uiStatus = "Matched";
    else if (inv.status === "MISMATCH" || inv.status === "FAILED") uiStatus = "Error";

    return NextResponse.json({
      invoice: {
        id: inv.id,
        dbId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        vendor: inv.customerName,
        customerName: inv.customerName,
        gstin: "N/A",
        date: formatDateString(inv.invoiceDate),
        invoiceDate: inv.invoiceDate.toISOString(),
        amount: formatCurrency(numAmount),
        rawAmount: numAmount,
        gst: "₹0",
        status: uiStatus,
        dbStatus: inv.status,
        errorMessage: inv.errorMessage,
        source: inv.upload?.fileName || "upload.csv",
        uploadId: inv.uploadId,
      },
    });
  } catch (err: any) {
    console.error("GET /api/invoices/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
