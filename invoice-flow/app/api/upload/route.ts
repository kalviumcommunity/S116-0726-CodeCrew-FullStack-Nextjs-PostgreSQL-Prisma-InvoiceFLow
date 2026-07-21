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

type ParsedInvoiceRowResult = {
    row: number;
    data: ParsedInvoiceRow;
    valid: boolean;
    errors: ValidationError[];
};

function isCsvFile(file: File): boolean {
    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();

    return fileName.endsWith(".csv") || mimeType.includes("csv");
}

function validateUploadedFile(file: File | null) {
    if (!file) {
        return {
            ok: false as const,
            status: 400,
            error: "No file uploaded",
        };
    }

    if (!isCsvFile(file)) {
        return {
            ok: false as const,
            status: 415,
            error: "Only CSV files are supported",
        };
    }

    return {
        ok: true as const,
    };
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
            .on("data", (row: Record<string, unknown>) => {
                rows.push(normalizeRow(row));
            })
            .on("end", () => resolve(rows))
            .on("error", (error: Error) => reject(error));
    });
}

function validateRow(row: ParsedInvoiceRow, rowNumber: number): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!row.invoiceNumber) {
        errors.push({ row: rowNumber, message: "Invoice Number is missing" });
    }

    if (!row.customerName) {
        errors.push({ row: rowNumber, message: "Customer Name is missing" });
    }

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

// Save upload record and its invoices to the database.
// Returns summary counts and the upload id.
async function saveUploadAndInvoices(fileName: string, validatedRows: ParsedInvoiceRowResult[]) {
    // Create Upload record first
    const upload = await prisma.upload.create({
        data: {
            fileName,
            uploadDate: new Date(),
            status: "PROCESSING",
            totalRows: validatedRows.length,
            successfulRows: 0,
            failedRows: 0,
        },
    });

    const invoicesToCreate = validatedRows
        .filter((r) => r.valid)
        .map((r) => ({
            invoiceNumber: r.data.invoiceNumber,
            customerName: r.data.customerName,
            invoiceDate: new Date(r.data.invoiceDate),
            amount: r.data.amount,
            status: "PROCESSING",
            errorMessage: null,
            uploadId: upload.id,
        }));

    let savedRows = 0;
    try {
        if (invoicesToCreate.length > 0) {
            await prisma.invoice.createMany({ data: invoicesToCreate });
            savedRows = invoicesToCreate.length;
        }

        const failedCount = validatedRows.length - savedRows;
        await prisma.upload.update({
            where: { id: upload.id },
            data: {
                successfulRows: savedRows,
                failedRows: failedCount,
                status: "COMPLETED",
            },
        });
    } catch (err) {
        // Mark upload as failed on DB error
        await prisma.upload.update({
            where: { id: upload.id },
            data: { status: "FAILED", failedRows: validatedRows.length },
        });
        throw err;
    }

    return { uploadId: upload.id, savedRows, failedRows: validatedRows.length - savedRows };
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No file uploaded",
                },
                { status: 400 }
            );
        }

        const fileValidation = validateUploadedFile(file);

        if (!fileValidation.ok) {
            return NextResponse.json(
                {
                    success: false,
                    error: fileValidation.error,
                },
                { status: fileValidation.status }
            );
        }

        const parsedRows = await parseCsv(file);

        const validatedRows: ParsedInvoiceRowResult[] = parsedRows.map((row, index) => {
            const errors = validateRow(row, index + 2);

            return {
                row: index + 2,
                data: row,
                valid: errors.length === 0,
                errors,
            };
        });

        const validRows = validatedRows.filter((row) => row.valid).length;
        const failedRows = validatedRows.length - validRows;
        const errors = validatedRows.flatMap((row) => row.errors);

        // Save upload and invoices using helper
        try {
            const result = await saveUploadAndInvoices(file.name, validatedRows);

            return NextResponse.json(
                {
                    success: true,
                    uploadId: result.uploadId,
                    totalRows: validatedRows.length,
                    savedRows: result.savedRows,
                    failedRows: result.failedRows,
                    errors,
                },
                { status: 200 }
            );
        } catch (dbErr) {
            console.error("Database error during upload save", dbErr);
            return NextResponse.json(
                {
                    success: false,
                    error: "Database error while saving upload/invoices",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("CSV upload processing failed", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to process the uploaded CSV file",
            },
            { status: 500 }
        );
    }
}
