import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border-strong bg-surface/60 px-6 text-center",
        compact ? "py-10" : "py-14 sm:py-20",
        className
      )}
    >
      <div className="relative">
        {/* Soft halo behind the glyph — stops the empty state reading as an error */}
        <div aria-hidden className="absolute inset-0 -m-3 rounded-full bg-primary/5 blur-lg" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-elev-1">
          <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden />
        </div>
      </div>
      <div className="max-w-xs space-y-1">
        <p className="font-semibold tracking-tight text-balance">{title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
      </div>
      {action}
    </div>
  );
}
