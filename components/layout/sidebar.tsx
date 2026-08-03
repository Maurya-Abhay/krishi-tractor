"use client";

import { usePathname } from "next/navigation";
import { Tractor } from "lucide-react";
import PrefetchLink from "@/components/ui/prefetch-link";
import { NAV_ITEMS, isActiveRoute } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-48 shrink-0 flex-col border-r border-sky-100 bg-sky-50/40 backdrop-blur-md dark:border-sky-950/40 dark:bg-slate-950/60 md:flex lg:w-52">
      {/* App Branding Section */}
      <div className="flex h-12 items-center gap-2 border-b border-sky-100/60 px-3.5 dark:border-sky-950/30">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm shadow-sky-500/20 transition-transform active:scale-95">
          <Tractor className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-xs font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Krishi Tractor
          </p>
          <p aria-hidden className="truncate text-[0.6rem] font-medium text-sky-600 dark:text-sky-400">
            कृषि ट्रैक्टर हिसाब
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav aria-label="Main" className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2.5">
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          return (
            <PrefetchLink
              key={item.href}
              href={item.href}
              prefetchKeys={item.prefetch ? [item.prefetch] : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.78rem] font-medium transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                active
                  ? "bg-sky-500/10 text-sky-700 font-semibold dark:bg-sky-500/20 dark:text-sky-300"
                  : "text-slate-600 hover:bg-sky-100/50 hover:text-sky-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
              )}
            >
              {/* Active Route Pill Bar */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sky-600 transition-all duration-200 dark:bg-sky-400",
                  active ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                )}
              />

              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 ease-out",
                  active
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-400 group-hover:scale-105 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                )}
                strokeWidth={active ? 2.3 : 1.8}
                aria-hidden
              />

              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[0.78rem]">{item.label.en}</span>
                <span aria-hidden className="truncate text-[0.58rem] font-normal opacity-70">
                  {item.label.hi}
                </span>
              </span>
            </PrefetchLink>
          );
        })}
      </nav>

      {/* Footer Info Box removed per request */}
    </aside>
  );
}