import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import csv from "csv-parser";

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

        // TODO: Save Upload record using Prisma
        // TODO: Save Invoice records using Prisma

        return NextResponse.json(
            {
                success: true,
                totalRows: validatedRows.length,
                validRows,
                failedRows,
                errors,
                data: validatedRows,
            },
            { status: 200 }
        );
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
