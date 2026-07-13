import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg";
    asChild?: boolean;
}

const buttonVariants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

const buttonSizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-6",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
        if (asChild && React.isValidElement(children)) {
            const child = children as React.ReactElement<{ className?: string }>;

            return React.cloneElement(child, {
                className: cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50",
                    buttonVariants[variant],
                    buttonSizes[size],
                    className,
                    child.props.className,
                ),
            });
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50",
                    buttonVariants[variant],
                    buttonSizes[size],
                    className,
                )}
                {...props}
            >
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";

export { Button };
