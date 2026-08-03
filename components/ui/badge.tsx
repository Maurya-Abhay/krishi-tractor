import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight tabular-nums [&_svg]:size-3",
  {
    variants: {
      variant: {
        // Soft fills with a matching border read as deliberate at any size,
        // and the border is what keeps them visible in dark mode.
        default: "border-border bg-secondary text-secondary-foreground",
        primary: "border-primary/20 bg-primary-soft text-primary-soft-foreground",
        success: "border-success/25 bg-success-soft text-success",
        warning: "border-warning/25 bg-warning-soft text-accent-strong",
        destructive: "border-destructive/25 bg-destructive-soft text-destructive",
        accent: "border-accent/30 bg-accent-soft text-accent-strong",
        outline: "border-border-strong bg-transparent text-muted-foreground",
        solid: "border-transparent brand-gradient text-primary-foreground",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-[0.8125rem]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
