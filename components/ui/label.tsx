"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { optional?: boolean }
>(({ className, optional, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 text-[0.8125rem] font-semibold leading-none text-foreground/90",
      "peer-disabled:opacity-70",
      className
    )}
    {...props}
  >
    {children}
    {optional && (
      <span className="text-[0.6875rem] font-normal text-muted-foreground">(optional)</span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

/** Label + control + error, with the vertical rhythm applied once. */
export function Field({
  label,
  htmlFor,
  error,
  optional,
  hint,
  children,
  className,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} optional={optional}>
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-[0.75rem] text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-[0.8125rem] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export { Label };
