"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileSpreadsheet, FileUp, Sparkles, Upload } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type UploadError = {
    row: number;
    message: string;
};

type UploadResponse = {
    success: boolean;
    uploadId?: string;
    totalRows?: number;
    savedRows?: number;
    failedRows?: number;
    errors?: UploadError[];
    error?: string;
};

export default function UploadPage() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadErrors, setUploadErrors] = useState<UploadError[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const guidelines = useMemo(
        () => [
            {
                title: "Structured invoices",
                description: "Import row-based invoice data with clear validation.",
                icon: FileSpreadsheet,
            },
            {
                title: "Fast processing",
                description: "Runs automatically and surfaces issues as they appear.",
                icon: Sparkles,
            },
            {
                title: "Reliable results",
                description: "Review status and mistakes from one simple dashboard.",
                icon: CheckCircle2,
            },
        ],
        []
    );

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage("");
            setErrorMessage("Please select a CSV file before uploading.");
            return;
        }

        setIsUploading(true);
        setUploadMessage("");
        setUploadErrors([]);
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = (await response.json()) as UploadResponse;

            if (!response.ok || !data.success) {
                setErrorMessage(data.error ?? "Upload failed. Please try again.");
                return;
            }

            const totalRows = data.totalRows ?? 0;
            let savedRows = data.savedRows;
            let failedRows = data.failedRows;

            if (data.uploadId && (savedRows === undefined || failedRows === undefined)) {
                const statusResponse = await fetch(`/api/uploads/${data.uploadId}/status`);
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    savedRows = savedRows ?? statusData.successfulRows ?? 0;
                    failedRows = failedRows ?? statusData.failedRows ?? 0;
                }
            }

            setUploadMessage(
                `Processed ${totalRows} row${totalRows === 1 ? "" : "s"}: ${savedRows ?? 0} saved, ${failedRows ?? 0} failed. Redirecting...`
            );

            if (data.errors && data.errors.length > 0) {
                setUploadErrors(data.errors);
            }

            if (data.uploadId) {
                router.push(`/uploads/${data.uploadId}`);
            }
        } catch (err) {
            console.error("Upload request failed", err);
            setErrorMessage(err instanceof Error ? err.message : "Something went wrong while uploading. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AppShell title="Upload" subtitle="Import invoice data from a CSV file and begin processing it instantly.">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Upload New CSV</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Drag and drop a CSV file or browse from your device to start the upload.
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
                            <p className="mt-2 text-sm text-slate-500">Supports invoice files in CSV format up to 25MB.</p>

                            <label
                                htmlFor="csv-upload"
                                className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                Choose file
                            </label>
                            <Input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                className="sr-only"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;
                                    setSelectedFile(file);
                                    setUploadMessage("");
                                    setUploadErrors([]);
                                    setErrorMessage("");
                                }}
                            />

                            {selectedFile ? (
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>{selectedFile.name}</span>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Button onClick={handleUpload} disabled={isUploading} className="bg-violet-600 hover:bg-violet-700">
                                <Upload className="mr-2 h-4 w-4" />
                                {isUploading ? "Uploading..." : "Upload CSV"}
                            </Button>
                            {uploadMessage ? <p className="text-sm text-emerald-600">{uploadMessage}</p> : null}
                            {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
                        </div>

                        {uploadErrors.length > 0 ? (
                            <ul className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                {uploadErrors.map((entry) => (
                                    <li key={`${entry.row}-${entry.message}`}>
                                        Row {entry.row}: {entry.message}
                                    </li>
                                ))}
                            </ul>
                        ) : null}

                        <div className="grid gap-4 md:grid-cols-3">
                            {guidelines.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="rounded-xl border border-slate-200 p-4">
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-medium text-slate-900">{item.title}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
