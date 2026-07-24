import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import csv from "csv-parser";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ParsedInvoiceRow = {
    invoiceNumber: string;
    customerName: string;
    invoiceDate: string;
    amount: string;
};

type ValidationError = {
    row: number;
    message: string;
};

function isCsvFile(file: File): boolean {
    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();
    return fileName.endsWith(".csv") || mimeType.includes("csv");
}

function normalizeRow(row: Record<string, unknown>): ParsedInvoiceRow {
    return {
        invoiceNumber: String(row.invoiceNumber ?? "").trim(),
        customerName: String(row.customerName ?? "").trim(),
        invoiceDate: String(row.invoiceDate ?? "").trim(),
        amount: String(row.amount ?? "").trim(),
    };
}

async function parseCsv(file: File): Promise<ParsedInvoiceRow[]> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const csvText = buffer.toString("utf-8");

    return new Promise((resolve, reject) => {
        const rows: ParsedInvoiceRow[] = [];
        Readable.from([csvText])
            .pipe(csv())
            .on("data", (row: Record<string, unknown>) => rows.push(normalizeRow(row)))
            .on("end", () => resolve(rows))
            .on("error", (error: Error) => reject(error));
    });
}

function validateRow(row: ParsedInvoiceRow, rowNumber: number): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!row.invoiceNumber) errors.push({ row: rowNumber, message: "Invoice Number is missing" });
    if (!row.customerName) errors.push({ row: rowNumber, message: "Customer Name is missing" });

    if (!row.invoiceDate) {
        errors.push({ row: rowNumber, message: "Invoice Date is missing" });
    } else if (Number.isNaN(Date.parse(row.invoiceDate))) {
        errors.push({ row: rowNumber, message: "Invoice Date is invalid" });
    }

    if (!row.amount) {
        errors.push({ row: rowNumber, message: "Amount is missing" });
    } else if (Number.isNaN(Number(row.amount))) {
        errors.push({ row: rowNumber, message: "Amount must be numeric" });
    }

    return errors;
}

/**
 * Runs AFTER the response has already been sent to the client.
 * This is what gives us "background processing" without a real job
 * queue: each row is compared against existing invoices in the DB to
 * decide MATCH vs MISMATCH, and the Upload row's counters are updated
 * as we go so the frontend can poll and see progress move.
 *
 * A duplicate invoiceNumber (from ANY previous upload) with different
 * customerName / amount / invoiceDate is treated as a MISMATCH.
 * A duplicate with identical data, or no duplicate at all, is a MATCH.
 */
async function processInvoicesInBackground(uploadId: string) {
    const pendingInvoices = await prisma.invoice.findMany({
        where: { uploadId, status: "PROCESSING" },
    });

    let matchCount = 0;
    let mismatchCount = 0;

    for (const invoice of pendingInvoices) {
        const conflict = await prisma.invoice.findFirst({
            where: {
                invoiceNumber: invoice.invoiceNumber,
                id: { not: invoice.id },
                OR: [
                    { customerName: { not: invoice.customerName } },
                    { amount: { not: invoice.amount } },
                    { invoiceDate: { not: invoice.invoiceDate } },
                ],
            },
        });

        if (conflict) {
            mismatchCount += 1;
            await prisma.invoice.update({
                where: { id: invoice.id },
                data: {
                    status: "MISMATCH",
                    errorMessage: `Conflicts with an earlier invoice ${invoice.invoiceNumber} (different customer, amount, or date)`,
                },
            });
        } else {
            matchCount += 1;
            await prisma.invoice.update({
                where: { id: invoice.id },
                data: { status: "MATCH", errorMessage: null },
            });
        }

        // Small delay so progress is visibly incremental in a demo.
        // Safe to remove/shrink this for real production volumes.
        await new Promise((resolve) => setTimeout(resolve, 120));
    }

    const failedCount = await prisma.invoice.count({ where: { uploadId, status: "FAILED" } });

    await prisma.upload.update({
        where: { id: uploadId },
        data: {
            status: "COMPLETED",
            successfulRows: matchCount,
            failedRows: failedCount + mismatchCount,
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        if (!isCsvFile(file)) {
            return NextResponse.json({ success: false, error: "Only CSV files are supported" }, { status: 415 });
        }

        const parsedRows = await parseCsv(file);

        if (parsedRows.length === 0) {
            return NextResponse.json({ success: false, error: "CSV file has no rows" }, { status: 400 });
        }

        const upload = await prisma.upload.create({
            data: {
                fileName: file.name,
                uploadDate: new Date(),
                status: "PROCESSING",
                totalRows: parsedRows.length,
                successfulRows: 0,
                failedRows: 0,
            },
        });

        // Every CSV row becomes an Invoice row, valid or not, so the
        // results table always has one entry per input row.
        const rowsWithValidation = parsedRows.map((row, index) => {
            const rowNumber = index + 2; // +2: header row + 1-indexing
            const errors = validateRow(row, rowNumber);
            return { row, rowNumber, errors };
        });

        for (const { row, rowNumber, errors } of rowsWithValidation) {
            const isValid = errors.length === 0;

            try {
                await prisma.invoice.create({
                    data: {
                        invoiceNumber: row.invoiceNumber || `UNKNOWN-${Math.random().toString(36).slice(2, 8)}`,
                        customerName: row.customerName || "Unknown",
                        invoiceDate: isValid ? new Date(row.invoiceDate) : new Date(),
                        amount: isValid ? row.amount : "0",
                        status: isValid ? "PROCESSING" : "FAILED",
                        errorMessage: isValid ? null : errors.map((e) => e.message).join("; "),
                        uploadId: upload.id,
                    },
                });
            } catch (error) {
                console.error(`Failed to insert invoice row ${rowNumber}`, error);

                try {
                    await prisma.invoice.create({
                        data: {
                            invoiceNumber: `ROW-${rowNumber}-${Math.random().toString(36).slice(2, 8)}`,
                            customerName: row.customerName || "Unknown",
                            invoiceDate: new Date(),
                            amount: "0",
                            status: "FAILED",
                            errorMessage: `DB insert failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                            uploadId: upload.id,
                        },
                    });
                } catch (fallbackError) {
                    console.error(`Fallback insert also failed for invoice row ${rowNumber}`, fallbackError);
                }
            }
        }

        // Fire-and-forget: do NOT await this. The HTTP response returns
        // now; matching happens after, and the frontend polls for status.
        processInvoicesInBackground(upload.id).catch((err) => {
            console.error("Background invoice processing failed", err);
            prisma.upload
                .update({ where: { id: upload.id }, data: { status: "FAILED" } })
                .catch(() => { });
        });

        return NextResponse.json(
            { success: true, uploadId: upload.id, totalRows: parsedRows.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("CSV upload processing failed", error);
        return NextResponse.json(
            { success: false, error: "Failed to process the uploaded CSV file" },
            { status: 500 }
        );
    }
}
