"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Replaces the old full-screen blocking spinner.
 *
 * A modal overlay during navigation is the single worst thing you can do for
 * *perceived* speed: it hides content the user can already read and blocks
 * input. This is a 2.5px top bar instead — non-blocking, GPU-only (transform
 * + opacity), and it never covers the page.
 *
 * Next 15.1 has no public navigation-state hook (`useLinkStatus` landed in
 * 15.3), so we detect intent from the click and completion from the pathname
 * changing.
 */

let start: (() => void) | null = null;

/** Call before a programmatic `router.push()` so the bar shows for those too. */
export function startRouteProgress() {
  start?.();
}

export function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = React.useState(false);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const begin = React.useCallback(() => {
    clearTimers();
    setActive(true);
    // Hard stop so a cancelled or same-page navigation can't strand the bar.
    timers.current.push(setTimeout(() => setActive(false), 8000));
  }, [clearTimers]);

  React.useEffect(() => {
    start = begin;
    return () => {
      start = null;
    };
  }, [begin]);

  // Any completed render at a new pathname means the navigation resolved.
  React.useEffect(() => {
    clearTimers();
    setActive(false);
  }, [pathname, clearTimers]);

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      // Let the browser handle modified clicks (new tab, download, etc.)
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, or a pure hash jump — nothing to load.
      if (url.pathname === window.location.pathname) return;

      begin();
    }

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", begin);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", begin);
    };
  }, [begin]);

  React.useEffect(() => clearTimers, [clearTimers]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2.5px] overflow-hidden"
      style={{ opacity: active ? 1 : 0, transition: "opacity 200ms var(--ease-out)" }}
    >
      {active && (
        <div className="h-full w-full origin-left animate-progress bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_10px_hsl(var(--accent)/0.7)]" />
      )}
    </div>
  );
}
