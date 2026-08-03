import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "success" | "destructive" | "accent";
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden relative transform-gpu transition-transform duration-300",
        "hover:-translate-y-2 hover:scale-[1.02] rounded-none",
        "shadow-2xl",
        "bg-card",
        "dark:bg-card"
      )}
    >
      <div
        className={cn(
          "absolute -right-4 -top-4 h-20 w-20 rounded-none blur-[6px]",
          "opacity-10 dark:opacity-20",
          accent === "success" && "bg-success",
          accent === "destructive" && "bg-destructive",
          accent === "accent" && "bg-accent",
          !accent && "bg-primary"
        )}
      />

      <CardContent className="relative flex items-center justify-between gap-2 p-2">
        <div className="min-w-0">
          <p className="truncate text-[0.68rem] text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="mt-1 truncate text-base font-bold tracking-tight">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-none backdrop-blur",
            "shadow-md bg-card/60 dark:bg-card/40",
            accent === "success" && "text-success",
            accent === "destructive" && "text-destructive",
            accent === "accent" && "text-accent-foreground"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2.25} />
        </div>
      </CardContent>
    </Card>
  );
}

