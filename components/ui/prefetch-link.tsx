"use client";

import * as React from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

type PrefetchEntry = { key: readonly unknown[]; url: string };

export type PrefetchLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  /** React Query entries to warm on hover/focus, before the click lands. */
  prefetchKeys?: PrefetchEntry[];
};

/**
 * Next already prefetches the RSC payload for links in view; this additionally
 * warms the *client* query cache on intent (hover/focus/touch-start), so the
 * destination renders with data instead of a spinner.
 *
 * Fixes on the previous version: `children` was missing from the prop type
 * (a compile error), and `prefetchKeys` was an unmemoised array literal at
 * every call site, so the `useCallback` never actually memoised anything.
 */
const PrefetchLink = React.forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  ({ prefetchKeys, children, onMouseEnter, onFocus, onTouchStart, ...props }, ref) => {
    const queryClient = useQueryClient();
    const done = React.useRef(false);

    const warm = React.useCallback(() => {
      if (done.current || !prefetchKeys?.length) return;
      done.current = true; // once per mount — repeated hovers shouldn't refetch

      for (const entry of prefetchKeys) {
        void queryClient.prefetchQuery({
          queryKey: entry.key as unknown[],
          queryFn: async () => {
            const res = await fetch(entry.url);
            if (!res.ok) throw new Error(`Prefetch failed: ${entry.url}`);
            return res.json();
          },
          staleTime: 30_000,
        });
      }
    }, [queryClient, prefetchKeys]);

    return (
      <Link
        ref={ref}
        {...props}
        onMouseEnter={(e) => {
          warm();
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          warm();
          onFocus?.(e);
        }}
        // Touch devices never fire mouseenter; touchstart buys ~80ms before tap.
        onTouchStart={(e) => {
          warm();
          onTouchStart?.(e);
        }}
      >
        {children}
      </Link>
    );
  }
);
PrefetchLink.displayName = "PrefetchLink";

export default PrefetchLink;
