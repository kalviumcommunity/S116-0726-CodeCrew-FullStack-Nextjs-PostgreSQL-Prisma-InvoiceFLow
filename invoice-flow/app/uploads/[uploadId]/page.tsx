import { redirect } from "next/navigation";

interface UploadDetailPageProps {
    params: Promise<{ uploadId: string }>;
}

// This page used to import from "@/data/invoices" and "@/data/uploads",
// which don't exist anywhere in the project — it would fail to build.
// Rather than maintain two near-duplicate result screens under a tight
// deadline, this just forwards to the real, working results page.
export default async function UploadDetailPage({ params }: UploadDetailPageProps) {
    const { uploadId } = await params;
    redirect(`/invoices_results?uploadId=${uploadId}`);
}
