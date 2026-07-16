"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileSpreadsheet, FileUp, Sparkles } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UploadsPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <AppShell title="Upload CSV" subtitle="Import invoice data from a CSV file and begin processing it instantly.">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Upload CSV
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Import invoice data from a CSV file and begin processing it instantly.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/history">
              View Upload History
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Select your invoice file</CardTitle>
            <CardDescription>
              Drag and drop a CSV file or browse from your device to start the upload.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                <FileUp className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">Drop your CSV here</h2>
              <p className="mt-2 text-sm text-slate-500">
                Supports invoice files in CSV format up to 25MB.
              </p>
              <label htmlFor="csv-upload" className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                Choose file
              </label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setSelectedFile(file?.name ?? null);
                }}
              />
              {selectedFile ? (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{selectedFile}</span>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-slate-900">Structured invoices</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Import row-based invoice data with clear validation.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-slate-900">Fast processing</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Runs automatically and surfaces issues as they appear.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-slate-900">Reliable results</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review status and mistakes from one simple dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
