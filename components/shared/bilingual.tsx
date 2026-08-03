import { cn } from "@/lib/utils";
import type { Label } from "@/lib/labels";

/**
 * Renders an English label with its Hindi gloss beneath. The Hindi line is
 * `aria-hidden` because screen readers announcing both languages back-to-back
 * is noise — the English text already carries the accessible name.
 */
export function Bilingual({
  label,
  className,
  hiClassName,
  inline = false,
}: {
  label: Label;
  className?: string;
  hiClassName?: string;
  /** Renders as "English · हिन्दी" on one line instead of stacked. */
  inline?: boolean;
}) {
  if (inline) {
    return (
      <span className={className}>
        {label.en}
        <span aria-hidden className={cn("ml-1.5 text-muted-foreground/80", hiClassName)}>
          {label.hi}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("flex flex-col leading-tight", className)}>
      <span>{label.en}</span>
      <span aria-hidden className={cn("text-[0.6875rem] font-normal text-muted-foreground", hiClassName)}>
        {label.hi}
      </span>
    </span>
  );
}
