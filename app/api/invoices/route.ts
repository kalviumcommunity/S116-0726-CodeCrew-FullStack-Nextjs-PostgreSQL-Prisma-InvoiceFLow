import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const invoices = await prisma.invoice.findMany({
      include: {
        upload: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedInvoices = invoices.map((inv: any) => {
      const numAmount = Number(inv.amount);
      const formattedAmount = formatCurrency(numAmount);
      const formattedDate = formatDateString(inv.invoiceDate);

      let uiStatus: "Matched" | "Pending" | "Error" = "Pending";
      if (inv.status === "MATCH") uiStatus = "Matched";
      else if (inv.status === "MISMATCH" || inv.status === "FAILED") uiStatus = "Error";
      else if (inv.status === "PROCESSING") uiStatus = "Pending";

      return {
        id: inv.invoiceNumber || inv.id,
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
      total: mappedInvoices.length,
    });
  } catch (err: any) {
    console.error("GET /api/invoices error:", err);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
