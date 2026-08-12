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

    const result = await processUpload(buffer, file.name, session.user.id);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Upload processing error:", err);
    
    const message = err.message || "Failed to process CSV upload";
    const isClientError =
      message.includes("empty") ||
      message.includes("contains no data rows") ||
      message.includes("only a header line") ||
      message.includes("could not be parsed");

    return NextResponse.json(
      { error: message },
      { status: isClientError ? 400 : 500 }
    );
  }
}
