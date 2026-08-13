import { prisma } from "@/lib/prisma";
import { Readable } from "stream";
import csvParser from "csv-parser";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod schema for a single validated invoice row
// ---------------------------------------------------------------------------
const rowSchema = z.object({
  invoiceNumber: z.string().min(1),
  customerName: z.string().min(1),
  invoiceDate: z.date(),
  amount: z.number().positive(),
});

// ---------------------------------------------------------------------------
// Date parser — handles ISO, DD-MM-YYYY, DD/MM/YYYY, MM/DD/YYYY
// ---------------------------------------------------------------------------
function parseDate(dateStr: string): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const cleaned = dateStr.trim();

  // Try native parse first (handles ISO 8601, RFC 2822, etc.)
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;

  // Try DD-MM-YYYY or DD/MM/YYYY
  const parts = cleaned.split(/[-/]/);
  if (parts.length === 3) {
    const [a, b, c] = parts.map((p) => parseInt(p, 10));
    // DD/MM/YYYY
    const ddmmyyyy = new Date(c, b - 1, a);
    if (!isNaN(ddmmyyyy.getTime())) return ddmmyyyy;
    // MM/DD/YYYY
    const mmddyyyy = new Date(c, a - 1, b);
    if (!isNaN(mmddyyyy.getTime())) return mmddyyyy;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Amount parser — strips currency symbols, commas, whitespace
// ---------------------------------------------------------------------------
function cleanAmount(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[^0-9.-]/g, "");
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// ---------------------------------------------------------------------------
// Invoice row shape before DB insert
// ---------------------------------------------------------------------------
interface InvoiceRow {
  invoiceNumber: string;
  customerName: string;
  invoiceDate: Date;
  amount: number;
  status: "PROCESSING" | "MATCH" | "MISMATCH" | "FAILED";
  errorMessage?: string;
  uploadId: string;
}

// Helper function for flexible header extraction
function getRawValue(raw: Record<string, string>, candidateKeys: string[]): string {
  if (!raw) return "";

  // 1. Direct exact match check
  for (const key of candidateKeys) {
    if (raw[key] !== undefined && raw[key] !== null) {
      return String(raw[key]).trim();
    }
  }

  // 2. Normalized match (strip non-alphanumeric, case-insensitive)
  const entries = Object.entries(raw);
  for (const candidate of candidateKeys) {
    const target = candidate.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const [key, val] of entries) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (normalizedKey === target) {
        return (val || "").trim();
      }
    }
  }

  return "";
}

export interface ChunkMeta {
  uploadId?: string;
  isFirstChunk?: boolean;
  isLastChunk?: boolean;
  totalRows?: number;
}

// ---------------------------------------------------------------------------
// Main entry point — called from /api/upload route handler
// ---------------------------------------------------------------------------
export async function processUpload(
  buffer: Buffer,
  fileName: string,
  userId: string,
  chunkMeta?: ChunkMeta
) {
  const isFirstChunk = chunkMeta?.isFirstChunk ?? true;
  const isLastChunk = chunkMeta?.isLastChunk ?? true;

  if (!buffer || buffer.length === 0) {
    throw new Error("Uploaded CSV file is empty (0 bytes)");
  }

  // -------------------------------------------------------------------------
  // 1. Parse CSV with UTF-8 BOM stripping & header trimming
  // -------------------------------------------------------------------------
  const rawRows: Record<string, string>[] = await new Promise(
    (resolve, reject) => {
      const results: Record<string, string>[] = [];
      Readable.from(buffer)
        .pipe(
          csvParser({
            mapHeaders: ({ header }) =>
              header ? header.replace(/^\uFEFF/, "").trim() : "",
          })
        )
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    }
  );

  if (!rawRows || rawRows.length === 0) {
    throw new Error("CSV file contains no data rows or only a header line");
  }

  // Filter out completely blank rows (e.g. trailing empty lines in CSV)
  const validRawRows = rawRows.filter((raw) => {
    const values = Object.values(raw);
    return values.some((val) => val && String(val).trim().length > 0);
  });

  if (validRawRows.length === 0) {
    throw new Error("CSV file contains only empty rows");
  }

  // -------------------------------------------------------------------------
  // Verify that the CSV has the required column headers
  // -------------------------------------------------------------------------
  const headers = Object.keys(validRawRows[0]).map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const invoiceCandidates = ["invoicenumber", "invoice", "id", "invoiceid", "invoiceno"];
  const amountCandidates = ["totalamount", "amount", "total", "grandtotal"];

  const hasInvoiceHeader = headers.some(h => invoiceCandidates.includes(h));
  const hasAmountHeader = headers.some(h => amountCandidates.includes(h));

  if (!hasInvoiceHeader && !hasAmountHeader) {
    throw new Error("Invalid CSV format: Missing required invoice columns (e.g., Invoice Number, Amount). Please ensure you are uploading an invoice file.");
  }

  // -------------------------------------------------------------------------
  // 2. Create or Retrieve the Upload record
  // -------------------------------------------------------------------------
  let upload: { id: string; totalRows: number; successfulRows: number; failedRows: number };

  if (isFirstChunk) {
    upload = await prisma.upload.create({
      data: {
        fileName,
        status: "PROCESSING",
        totalRows: chunkMeta?.totalRows ?? validRawRows.length,
        successfulRows: 0,
        failedRows: 0,
        userId,
      },
    });
  } else {
    if (!chunkMeta?.uploadId) {
      throw new Error("Missing uploadId for subsequent chunk");
    }
    const existing = await prisma.upload.findUnique({
      where: { id: chunkMeta.uploadId },
    });
    if (!existing || existing.userId !== userId) {
      throw new Error("Upload record not found or unauthorized");
    }
    upload = existing;
  }

  try {
    // -----------------------------------------------------------------------
    // 3. Parse and validate every row
    // -----------------------------------------------------------------------
    const seenInFile = new Set<string>();
    const invoiceRows: InvoiceRow[] = [];
    let failedCount = 0;

    for (let index = 0; index < validRawRows.length; index++) {
      const raw = validRawRows[index];

      // Normalise column names — support multiple header conventions
      const invoiceNumber = getRawValue(raw, [
        "Invoice Number",
        "invoiceNumber",
        "invoice_number",
        "Invoice",
        "id",
        "Invoice ID",
        "InvoiceNo",
        "Invoice No",
      ]);

      const customerName = getRawValue(raw, [
        "Customer Name",
        "customerName",
        "customer_name",
        "Vendor",
        "vendor",
        "Customer",
        "Vendor Name",
        "Bill To",
      ]);

      const invoiceDateStr = getRawValue(raw, [
        "Invoice Date",
        "invoiceDate",
        "invoice_date",
        "Date",
        "date",
        "Billing Date",
      ]);

      const rawAmountStr = getRawValue(raw, [
        "Total Amount",
        "Amount",
        "amount",
        "total_amount",
        "Total",
        "Grand Total",
      ]);

      const parsedDate = parseDate(invoiceDateStr);
      const numericAmount = cleanAmount(rawAmountStr);

      // Determine validation error
      let validationError: string | null = null;
      if (!invoiceNumber || !customerName || !invoiceDateStr || !rawAmountStr) {
        validationError = "Missing required fields";
      } else if (!parsedDate) {
        validationError = "Invalid invoice date format";
      } else if (numericAmount === null || numericAmount <= 0) {
        validationError = "Invalid or non-numeric amount";
      } else if (seenInFile.has(invoiceNumber.toLowerCase())) {
        validationError = "Duplicate invoice number within same CSV file";
      } else {
        seenInFile.add(invoiceNumber.toLowerCase());
      }

      if (validationError) {
        failedCount++;
        invoiceRows.push({
          invoiceNumber: invoiceNumber || `UNKNOWN-ROW-${index + 1}`,
          customerName: customerName || "Unknown Customer",
          invoiceDate: parsedDate ?? new Date(),
          amount: numericAmount ?? 0,
          status: "FAILED",
          errorMessage: validationError,
          uploadId: upload.id,
        });
        continue;
      }

      // Run Zod schema check (belt-and-suspenders after manual validation)
      const zodResult = rowSchema.safeParse({
        invoiceNumber,
        customerName,
        invoiceDate: parsedDate,
        amount: numericAmount,
      });

      if (!zodResult.success) {
        failedCount++;
        invoiceRows.push({
          invoiceNumber,
          customerName,
          invoiceDate: parsedDate!,
          amount: numericAmount!,
          status: "FAILED",
          errorMessage: zodResult.error.issues[0]?.message ?? "Validation failed",
          uploadId: upload.id,
        });
        continue;
      }

      invoiceRows.push({
        invoiceNumber,
        customerName,
        invoiceDate: parsedDate!,
        amount: numericAmount!,
        status: "PROCESSING",
        uploadId: upload.id,
      });
    }

    // -----------------------------------------------------------------------
    // 4. Determine MATCH / MISMATCH for processable rows
    //    SECURITY FIX: scope to current user's invoices only
    // -----------------------------------------------------------------------
    const processable = invoiceRows.filter((i) => i.status === "PROCESSING");
    const invoiceNumbers = processable.map((i) => i.invoiceNumber);

    let matchCount = 0;
    let mismatchCount = 0;

    if (invoiceNumbers.length > 0) {
      const BATCH_SIZE = 5000;
      const existingInvoices = [];
      
      for (let i = 0; i < invoiceNumbers.length; i += BATCH_SIZE) {
        const batch = invoiceNumbers.slice(i, i + BATCH_SIZE);
        const batchResults = await prisma.invoice.findMany({
          where: {
            invoiceNumber: { in: batch },
            status: { not: "FAILED" },
            upload: { userId }, // <-- SECURITY: scoped to current user
          },
        });
        existingInvoices.push(...batchResults);
      }

      const existingMap = new Map<string, typeof existingInvoices>();
      for (const ex of existingInvoices) {
        const key = ex.invoiceNumber.toLowerCase();
        if (!existingMap.has(key)) existingMap.set(key, []);
        existingMap.get(key)!.push(ex);
      }

      for (const inv of processable) {
        const key = inv.invoiceNumber.toLowerCase();
        const existing = existingMap.get(key);

        if (existing && existing.length > 0) {
          // Check if any existing invoice conflicts on vendor, amount, or date
          let conflictMessage = "";
          const hasConflict = existing.some((other) => {
            const sameVendor =
              other.customerName.trim().toLowerCase() ===
              inv.customerName.trim().toLowerCase();
            const sameAmount =
              Math.abs(Number(other.amount) - inv.amount) < 0.01;
            const sameDate =
              other.invoiceDate.toISOString().split("T")[0] ===
              inv.invoiceDate.toISOString().split("T")[0];
            
            if (!sameVendor || !sameAmount || !sameDate) {
              const reasons = [];
              if (!sameAmount) reasons.push("amount");
              if (!sameVendor) reasons.push("customer");
              if (!sameDate) reasons.push("invoice date");
              
              conflictMessage = `${reasons.join(", ")} differs from existing invoice`;
              return true;
            }
            return false;
          });

          inv.status = hasConflict ? "MISMATCH" : "MATCH";
          if (hasConflict) {
            inv.errorMessage = conflictMessage.charAt(0).toUpperCase() + conflictMessage.slice(1);
          }
        } else {
          // No prior invoice with this number → new entry, counts as MATCH
          inv.status = "MATCH";
        }

        if (inv.status === "MATCH") matchCount++;
        else mismatchCount++;
      }
    }

    // -----------------------------------------------------------------------
    // 5. Write all invoice records + update Upload in a single transaction
    //    RELIABILITY FIX: prevents Upload stuck in PROCESSING on failure
    // -----------------------------------------------------------------------

    // successfulRows = MATCH only (not MISMATCH which needs attention)
    // failedRows = FAILED + MISMATCH (both need review)
    const successfulRows = matchCount;
    const finalFailedRows = failedCount + mismatchCount;

    const BATCH_SIZE = 5000;
    const transactionOperations = [];
    
    for (let i = 0; i < invoiceRows.length; i += BATCH_SIZE) {
      const batch = invoiceRows.slice(i, i + BATCH_SIZE);
      transactionOperations.push(prisma.invoice.createMany({ data: batch }));
    }

    if (isFirstChunk) {
      transactionOperations.push(
        prisma.upload.update({
          where: { id: upload.id },
          data: {
            status: isLastChunk ? "COMPLETED" : "PROCESSING",
            successfulRows,
            failedRows: finalFailedRows,
          },
        })
      );
    } else {
      transactionOperations.push(
        prisma.upload.update({
          where: { id: upload.id },
          data: {
            status: isLastChunk ? "COMPLETED" : "PROCESSING",
            successfulRows: { increment: successfulRows },
            failedRows: { increment: finalFailedRows },
          },
        })
      );
    }

    await prisma.$transaction(transactionOperations);

    // Fetch latest cumulative totals for response summary
    const updatedUpload = await prisma.upload.findUnique({
      where: { id: upload.id },
    });

    return {
      uploadId: upload.id,
      totalRows: updatedUpload?.totalRows ?? upload.totalRows,
      successfulRows: updatedUpload?.successfulRows ?? successfulRows,
      failedRows: updatedUpload?.failedRows ?? finalFailedRows,
      matchCount,
      mismatchCount,
      failedCount,
      status: isLastChunk ? "COMPLETED" : "PROCESSING",
    };
  } catch (processingError) {
    // -----------------------------------------------------------------------
    // 6. On any processing failure, mark Upload as FAILED — not stuck
    // -----------------------------------------------------------------------
    await prisma.upload.update({
      where: { id: upload.id },
      data: { status: "FAILED" },
    }).catch(() => {
      // Best-effort — don't throw if this update also fails
    });

    throw processingError;
  }
}
