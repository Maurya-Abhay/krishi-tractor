import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative rounded-xl border bg-card text-card-foreground transition-ui",
  {
    variants: {
      variant: {
        default: "border-border shadow-elev-1",
        raised: "border-border shadow-elev-2",
        /** For content nested *inside* another Card — flat, no shadow. */
        inset: "border-border/70 bg-surface shadow-none",
        outline: "border-border-strong shadow-none bg-transparent",
        dashed: "border-dashed border-border-strong shadow-none bg-transparent",
      },
      interactive: {
        true: "lift cursor-pointer hover:border-primary/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, interactive, className }))} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { action?: React.ReactNode }
>(({ className, action, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5 sm:pt-5",
      className
    )}
    {...props}
  >
    <div className="flex min-w-0 flex-col gap-1">{children}</div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-[0.9375rem] font-semibold leading-tight tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm leading-snug text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 pb-4 sm:px-5 sm:pb-5", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 border-t border-border/70 px-4 py-3 sm:px-5",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
