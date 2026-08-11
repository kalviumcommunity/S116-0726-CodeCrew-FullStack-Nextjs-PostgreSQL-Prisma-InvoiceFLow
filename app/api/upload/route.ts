import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Readable } from "stream";
import csvParser from "csv-parser";

export const runtime = "nodejs";

function parseCSVBuffer(buffer: Buffer): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];
    const stream = Readable.from(buffer);
    stream
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const cleaned = dateStr.trim();
  
  let d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;

  const parts = cleaned.split(/[-/]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
}

function cleanAmount(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[^0-9.-]/g, "");
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No CSV file provided under field 'file'" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const rawRows = await parseCSVBuffer(buffer);

    if (!rawRows || rawRows.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty or could not be parsed" },
        { status: 400 }
      );
    }

    const upload = await prisma.upload.create({
      data: {
        fileName: file.name,
        status: "PROCESSING",
        totalRows: rawRows.length,
        successfulRows: 0,
        failedRows: 0,
      },
    });

    const seenInFile = new Set<string>();
    let failedCount = 0;

    for (let index = 0; index < rawRows.length; index++) {
      const raw = rawRows[index];

      const invoiceNumber = (
        raw["Invoice Number"] ||
        raw["invoiceNumber"] ||
        raw["invoice_number"] ||
        raw["Invoice"] ||
        raw["id"] ||
        ""
      ).trim();

      const customerName = (
        raw["Customer Name"] ||
        raw["customerName"] ||
        raw["customer_name"] ||
        raw["Vendor"] ||
        raw["vendor"] ||
        ""
      ).trim();

      const invoiceDateStr = (
        raw["Invoice Date"] ||
        raw["invoiceDate"] ||
        raw["invoice_date"] ||
        raw["Date"] ||
        raw["date"] ||
        ""
      ).trim();

      const rawAmountStr = (
        raw["Total Amount"] ||
        raw["Amount"] ||
        raw["amount"] ||
        raw["total_amount"] ||
        ""
      ).trim();

      let validationError: string | null = null;
      let parsedDate: Date | null = null;
      let numericAmount: number | null = null;

      if (!invoiceNumber || !customerName || !invoiceDateStr || !rawAmountStr) {
        validationError = "Missing required fields";
      } else {
        parsedDate = parseDate(invoiceDateStr);
        if (!parsedDate) {
          validationError = "Invalid invoice date format";
        }

        numericAmount = cleanAmount(rawAmountStr);
        if (numericAmount === null || numericAmount <= 0) {
          validationError = "Invalid or non-numeric amount";
        }

        if (!validationError) {
          if (seenInFile.has(invoiceNumber.toLowerCase())) {
            validationError = "Duplicate invoice number within same CSV file";
          } else {
            seenInFile.add(invoiceNumber.toLowerCase());
          }
        }
      }

      const isFailed = Boolean(validationError);
      if (isFailed) {
        failedCount++;
      }

      try {
        await prisma.invoice.create({
          data: {
            invoiceNumber: invoiceNumber || `UNKNOWN-ROW-${index + 1}`,
            customerName: customerName || "Unknown Customer",
            invoiceDate: parsedDate || new Date(),
            amount: numericAmount !== null ? numericAmount : 0,
            status: isFailed ? "FAILED" : "PROCESSING",
            errorMessage: validationError,
            uploadId: upload.id,
          },
        });
      } catch (err: any) {
        console.error(`Failed to insert row ${index + 1}:`, err);
        failedCount++;
      }
    }

    await prisma.upload.update({
      where: { id: upload.id },
      data: {
        failedRows: failedCount,
      },
    });

    processBackgroundMatching(upload.id).catch((err) => {
      console.error(`Background matching failed for upload ${upload.id}:`, err);
    });

    return NextResponse.json({
      uploadId: upload.id,
      totalRows: rawRows.length,
      status: "PROCESSING",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process CSV upload" },
      { status: 500 }
    );
  }
}

async function processBackgroundMatching(uploadId: string) {
  const processingInvoices = await prisma.invoice.findMany({
    where: {
      uploadId,
      status: "PROCESSING",
    },
  });

  let matchCount = 0;
  let mismatchCount = 0;

  for (const inv of processingInvoices) {
    const existingMatches = await prisma.invoice.findMany({
      where: {
        invoiceNumber: {
          equals: inv.invoiceNumber,
          mode: "insensitive",
        },
        id: {
          not: inv.id,
        },
        status: {
          not: "FAILED",
        },
      },
    });

    let newStatus: "MATCH" | "MISMATCH" = "MATCH";

    if (existingMatches.length > 0) {
      const invAmount = Number(inv.amount);
      const invDateStr = inv.invoiceDate.toISOString().split("T")[0];

      const conflict = existingMatches.some((other: any) => {
        const otherAmount = Number(other.amount);
        const otherDateStr = other.invoiceDate.toISOString().split("T")[0];
        const sameVendor =
          other.customerName.trim().toLowerCase() ===
          inv.customerName.trim().toLowerCase();
        const sameAmount = Math.abs(otherAmount - invAmount) < 0.01;
        const sameDate = otherDateStr === invDateStr;

        return !sameVendor || !sameAmount || !sameDate;
      });

      if (conflict) {
        newStatus = "MISMATCH";
      } else {
        newStatus = "MATCH";
      }
    }

    if (newStatus === "MATCH") matchCount++;
    else mismatchCount++;

    await prisma.invoice.update({
      where: { id: inv.id },
      data: { status: newStatus },
    });
  }

  const uploadInfo = await prisma.upload.findUnique({
    where: { id: uploadId },
  });

  if (uploadInfo) {
    const totalFailed = await prisma.invoice.count({
      where: { uploadId, status: "FAILED" },
    });
    const totalSuccess = await prisma.invoice.count({
      where: { uploadId, status: { in: ["MATCH", "MISMATCH"] } },
    });

    await prisma.upload.update({
      where: { id: uploadId },
      data: {
        status: "COMPLETED",
        successfulRows: totalSuccess,
        failedRows: totalFailed,
      },
    });
  }
}
