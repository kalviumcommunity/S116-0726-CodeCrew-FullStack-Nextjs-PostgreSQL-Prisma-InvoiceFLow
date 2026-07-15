import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/components/invoices/data";

interface InvoiceStatusBadgeProps {
    status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
    if (status === "MATCH") {
        return <Badge variant="success">MATCH</Badge>;
    }

    if (status === "MISMATCH") {
        return <Badge variant="warning">MISMATCH</Badge>;
    }

    return <Badge variant="destructive">FAILED</Badge>;
}
