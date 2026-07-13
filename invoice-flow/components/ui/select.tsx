import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => {
    return (
        <select
            ref={ref}
            className={cn(
                "flex h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-2 transition focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200",
                className,
            )}
            {...props}
        />
    );
});
Select.displayName = "Select";

export { Select };
