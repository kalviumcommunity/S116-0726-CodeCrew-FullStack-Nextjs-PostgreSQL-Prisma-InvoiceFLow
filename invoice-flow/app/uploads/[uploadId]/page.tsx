import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, BadgeCheck, AlertCircle, Clock3 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { invoices } from "@/data/invoices";
import { uploads } from "@/data/uploads";

interface UploadDetailPageProps {
    params: Promise<{ uploadId: string }>;
}

function getStatusBadge(status: string) {
    switch (status) {
        case "COMPLETED":
            return <Badge className="bg-emerald-50 text-emerald-700">COMPLETED</Badge>;
        case "FAILED":
            return <Badge variant="destructive">FAILED</Badge>;
        default:
            return <Badge className="bg-amber-50 text-amber-700">PROCESSING</Badge>;
    }
}

export default async function UploadDetailPage({ params }: UploadDetailPageProps) {
    const { uploadId } = await params;
    const upload = uploads.find((item) => item.id === uploadId);

    if (!upload) {
        return (
            <AppShell title="Upload Details" subtitle="The requested upload could not be found.">
                <div className="space-y-6">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/history">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Upload History
                        </Link>
                    </Button>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                                    <FileSpreadsheet className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Upload Not Found</CardTitle>
                                    <p className="mt-1 text-sm text-slate-500">The requested upload does not exist.</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">
                                The upload ID you requested is not available in the current mock dataset.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </AppShell>
        );
    }

    const uploadInvoices = invoices.filter((invoice) => invoice.uploadId === upload.id);

    return (
        <AppShell title="Upload Details" subtitle={`Viewing ${upload.fileName}`}>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/history">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to history
                        </Link>
                    </Button>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                                <FileSpreadsheet className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{upload.fileName}</CardTitle>
                                <p className="mt-1 text-sm text-slate-500">Uploaded on {upload.uploadDate}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">File size</p>
                                <p className="mt-2 text-xl font-semibold text-slate-900">{upload.fileSize}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Total invoices</p>
                                <p className="mt-2 text-xl font-semibold text-slate-900">{upload.totalRows}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Status</p>
                                <div className="mt-2">{getStatusBadge(upload.status)}</div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Summary</p>
                                <p className="mt-2 text-sm font-medium text-slate-900">{upload.summary}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <BadgeCheck className="h-4 w-4" />
                                    <p className="text-sm font-medium">Completed</p>
                                </div>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{upload.success}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-center gap-2 text-amber-600">
                                    <Clock3 className="h-4 w-4" />
                                    <p className="text-sm font-medium">Pending</p>
                                </div>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{upload.totalRows - upload.success - upload.failed}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-center gap-2 text-rose-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <p className="text-sm font-medium">Failed</p>
                                </div>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{upload.failed}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {['Invoice #', 'Vendor', 'Amount', 'Status'].map((heading) => (
                                            <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {uploadInvoices.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-900">{invoice.invoiceNumber}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{invoice.vendor}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">${invoice.amount.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{invoice.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
