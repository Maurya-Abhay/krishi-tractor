"use client";

import { usePathname } from "next/navigation";
import PrefetchLink from "@/components/ui/prefetch-link";
import { NAV_ITEMS, isActiveRoute } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

const MOBILE_ITEMS = NAV_ITEMS.filter((item) => item.mobile);

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl md:hidden",
        // Sits above the iOS home indicator / Android gesture bar instead of
        // under it, which is what made the old 56px bar hard to tap.
        "pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-1px_0_hsl(var(--border)),0_-8px_24px_hsl(var(--shadow-hue)/0.06)]"
      )}
    >
      <ul className="flex h-16 items-stretch">
        {MOBILE_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          return (
            <li key={item.href} className="flex-1">
              <PrefetchLink
                href={item.href}
                prefetchKeys={item.prefetch ? [item.prefetch] : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full select-none flex-col items-center justify-center gap-1 px-1 transition-fast",
                  "active:scale-95",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {/* Pill behind the icon: the affordance that makes the active
                    tab obvious at a glance without shrinking the tap target. */}
                <span
                  aria-hidden
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-all duration-200 ease-out",
                    active ? "bg-primary-soft" : "bg-transparent"
                  )}
                >
                  <item.icon
                    className="h-[1.15rem] w-[1.15rem]"
                    strokeWidth={active ? 2.5 : 2}
                    aria-hidden
                  />
                </span>
                <span
                  className={cn(
                    "text-[0.6875rem] leading-none tracking-tight",
                    active ? "font-bold" : "font-medium"
                  )}
                >
                  {item.label.en}
                </span>
              </PrefetchLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
