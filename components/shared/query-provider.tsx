"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 1 minute: long enough to make back/forward navigation instant,
            // short enough that a second device's edits show up quickly.
            staleTime: 60_000,
            // `cacheTime` was the v4 name — under v5 it was silently ignored,
            // so cached data was being garbage-collected on the 5m default.
            gcTime: 10 * 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: (failureCount, error) => {
              // Auth and validation failures never succeed on retry; retrying
              // them just delays the error the user needs to see.
              const message = error instanceof Error ? error.message : "";
              if (/unauthor|forbidden|not found|validation/i.test(message)) return false;
              return failureCount < 2;
            },
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
