import Link from "next/link";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadDetailPageProps {
    params: Promise<{ uploadId: string }>;
}

export default async function UploadDetailPage({ params }: UploadDetailPageProps) {
    const { uploadId } = await params;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm">
                    <Link href="/uploads">
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
                            <CardTitle className="text-xl">Upload Details</CardTitle>
                            <p className="mt-1 text-sm text-slate-500">Viewing {uploadId}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600">
                        This placeholder detail page is ready for future invoice-level insights and processing breakdowns.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
