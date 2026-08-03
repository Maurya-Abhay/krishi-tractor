import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon rendered inside the field, left-aligned. */
  icon?: React.ReactNode;
  /** Content pinned to the right edge (spinner, unit, clear button). */
  suffix?: React.ReactNode;
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, suffix, invalid, ...props }, ref) => {
    const field = (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          // 16px text on mobile: anything smaller makes iOS Safari zoom the
          // viewport on focus, which feels broken on a phone.
          "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-base sm:text-sm",
          "text-foreground shadow-elev-1 transition-ui",
          "placeholder:text-muted-foreground/70",
          "hover:border-border-strong",
          "focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring/25",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20",
          // The UA calendar icon is black and invisible against a dark field
          "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 dark:[&::-webkit-calendar-picker-indicator]:invert",
          icon && "pl-10",
          suffix && "pr-10",
          className
        )}
        {...props}
      />
    );

    if (!icon && !suffix) return field;

    return (
      <div className="relative w-full">
        {icon && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:size-4"
          >
            {icon}
          </span>
        )}
        {field}
        {suffix && (
          <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:size-4">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/** Inline validation message. Renders nothing when there's no error. */
export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-[0.8125rem] font-medium text-destructive">
      {children}
    </p>
  );
}

export { Input };
