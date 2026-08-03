import { cn } from "@/lib/utils";
import type { Label } from "@/lib/labels";

/**
 * The single title block used at the top of every page, so heading size,
 * spacing and the action-button position never drift between routes.
 */
export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: Label | string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const en = typeof title === "string" ? title : title.en;
  const hi = typeof title === "string" ? null : title.hi;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h1 className="text-display-sm sm:text-display">{en}</h1>
          {hi && (
            <span aria-hidden className="text-base font-medium text-muted-foreground">
              {hi}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}
