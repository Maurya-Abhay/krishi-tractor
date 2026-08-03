"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/components/shared/theme-provider";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light theme" },
  { value: "dark", icon: Moon, label: "Dark theme" },
  { value: "system", icon: Monitor, label: "Match system theme" },
];

/**
 * A three-way segmented control rather than a two-way toggle — "system" is a
 * real preference, and hiding it behind a long-press is how you get users
 * stuck in the wrong theme after sunset.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // The server can't know the stored theme, so rendering the selected state
  // before mount would hydrate-mismatch. Reserve the space, fill it after.
  React.useEffect(() => setMounted(true), []);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 rounded-lg border border-border bg-secondary p-0.5"
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const selected = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-ui",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-card text-foreground shadow-elev-1"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
