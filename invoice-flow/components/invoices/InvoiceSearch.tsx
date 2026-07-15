import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InvoiceSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterActive: boolean;
    onFilterToggle: () => void;
}

export function InvoiceSearch({ searchTerm, onSearchChange, filterActive, onFilterToggle }: InvoiceSearchProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search invoice number, customer..."
                    className="w-full pl-9"
                />
            </div>
            <Button
                type="button"
                variant={filterActive ? "default" : "outline"}
                onClick={onFilterToggle}
                className="sm:w-auto"
            >
                <Filter className="mr-2 h-4 w-4" />
                Filter
            </Button>
        </div>
    );
}
