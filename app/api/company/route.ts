import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const companySchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  gstin: z.string().optional().nullable(),
  pan: z.string().optional().nullable(),
  contactEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .nullable()
    .or(z.literal("")),
  contactNumber: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const company = await prisma.company.findUnique({
      where: { userId },
    });

    return NextResponse.json({ company });
  } catch (error: any) {
    console.error("GET /api/company error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    const validated = companySchema.safeParse(body);
    if (!validated.success) {
      const issue = validated.error.issues[0];
      return NextResponse.json(
        { error: issue.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = validated.data;

    const company = await prisma.company.upsert({
      where: { userId },
      create: {
        userId,
        companyName: data.companyName,
        gstin: data.gstin || null,
        pan: data.pan || null,
        contactEmail: data.contactEmail || null,
        contactNumber: data.contactNumber || null,
        website: data.website || null,
        address: data.address || null,
      },
      update: {
        companyName: data.companyName,
        gstin: data.gstin || null,
        pan: data.pan || null,
        contactEmail: data.contactEmail || null,
        contactNumber: data.contactNumber || null,
        website: data.website || null,
        address: data.address || null,
      },
    });

    return NextResponse.json({
      message: "Company details saved successfully",
      company,
    });
  } catch (error: any) {
    console.error("PATCH /api/company error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
