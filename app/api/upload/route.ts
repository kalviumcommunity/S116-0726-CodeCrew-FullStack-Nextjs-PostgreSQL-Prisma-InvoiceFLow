import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { processUpload } from "@/services/upload.service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No CSV file provided under field 'file'" },
        { status: 400 }
      );
    }

    if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json(
        { error: "Invalid file type. Only CSV files are allowed." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "The uploaded CSV file is empty (0 bytes)." },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) { // 25MB limit (matches UI)
      return NextResponse.json(
        { error: "File size exceeds 25MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadId = (formData.get("uploadId") as string) || undefined;
    const isFirstChunk = formData.has("isFirstChunk") ? formData.get("isFirstChunk") === "true" : true;
    const isLastChunk = formData.has("isLastChunk") ? formData.get("isLastChunk") === "true" : true;
    const totalRows = formData.has("totalRows") ? parseInt(formData.get("totalRows") as string, 10) : undefined;

    const result = await processUpload(buffer, file.name, session.user.id, {
      uploadId,
      isFirstChunk,
      isLastChunk,
      totalRows: isNaN(totalRows as number) ? undefined : totalRows,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Upload processing error:", err);
    
    let message = err.message || "Failed to process CSV upload";
    
    // Map internal error messages to cleaner user-facing ones
    if (message.includes("0 bytes") || message.includes("empty")) {
      message = "CSV file is empty. Please upload a CSV containing invoice rows.";
    } else if (message.includes("no data rows") || message.includes("header line")) {
      message = "CSV file contains no invoice rows. Please add invoice data and try again.";
    } else if (message.includes("Missing required invoice columns")) {
      message = "Missing required invoice columns. Please check the CSV format.";
    } else if (message.includes("could not be parsed") || message.includes("Invalid CSV format")) {
      message = "Invalid CSV format. Please check the file and try again.";
    }

    const isClientError =
      message.includes("CSV file is empty") ||
      message.includes("CSV file contains no invoice rows") ||
      message.includes("Missing required invoice columns") ||
      message.includes("Invalid CSV format");

    return NextResponse.json(
      { error: message },
      { status: isClientError ? 400 : 500 }
    );
  }
}
