"use client";

import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!('serviceWorker' in navigator)) return;
    // In development, unregister any previously installed service workers
    // and clear the app cache so stale service workers don't serve assets
    // from another port (common source of MIME/404 errors during dev).
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister().catch(() => {}));
      }).catch(() => {});

      if (caches && caches.keys) {
        caches.keys().then((keys) => {
          keys.forEach((k) => {
            // Only attempt to delete known app cache names
            if (k.includes('krishi')) caches.delete(k).catch(() => {});
          });
        }).catch(() => {});
      }
      return;
    }

    // Register in production, but swallow errors (production may still fail in some setups)
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  return null;
}
