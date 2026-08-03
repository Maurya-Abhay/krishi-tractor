import { cn } from "@/lib/utils";

/**
 * Sweeping shimmer rather than a pulsing block. A pulse reads as "something is
 * broken"; a directional sweep reads as "content is arriving". The sweep is a
 * pure transform, so it stays on the compositor and costs nothing to animate.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden rounded-lg bg-muted", className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
    </div>
  );
}

/** Skeleton rows shaped like the card lists used across the app. */
function SkeletonList({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-[4.5rem] w-full rounded-xl" />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonList };
