import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg",
    "text-sm font-semibold tracking-tight transition-ui press",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:size-[1.125em] [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-elev-2 hover:bg-blue-700 hover:shadow-elev-3",
        accent:
          "accent-gradient text-accent-foreground shadow-elev-2 hover:shadow-elev-3 hover:brightness-105",
        secondary:
          "border border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100",
        outline:
          "border border-border-strong bg-card text-foreground shadow-elev-1 hover:border-primary/40 hover:bg-primary-soft hover:text-primary-soft-foreground",
        ghost: "text-foreground/80 hover:bg-secondary hover:text-foreground",
        subtle: "bg-primary-soft text-primary-soft-foreground hover:brightness-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-elev-2 hover:brightness-110",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // 44px+ on the default size: comfortably above the 44×44 touch target
        // minimum, which matters far more here than on a desktop-only tool.
        default: "h-11 px-4",
        sm: "h-9 gap-1.5 rounded-md px-3 text-[0.8125rem]",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-md",
      },
      full: {
        true: "w-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Swaps content for a spinner and disables the button. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, full, asChild = false, loading = false, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // `asChild` forwards to a single child (e.g. a Link) — injecting a spinner
    // would give Slot two children and crash, so loading UI is button-only.
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, full, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, full, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
