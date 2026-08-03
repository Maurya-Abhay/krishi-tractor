"use client";

import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!('serviceWorker' in navigator)) return;
    // Register only in production to avoid dev reload issues
    if (process.env.NODE_ENV !== 'production') return;

    // Register, but swallow errors (production may still fail in some setups)
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  return null;
}
