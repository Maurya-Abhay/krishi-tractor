"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BackToLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function goBack() {
    setLoading(true);
    // If browser history exists, go back; otherwise navigate to /login
    try {
      if (history.length > 1) {
        router.back();
      } else {
        router.push("/login");
      }
    } finally {
      // small delay to show loading state in case navigation is instant
      setTimeout(() => setLoading(false), 800);
    }
  }

  return (
    <div className="mb-6">
      <button
        onClick={goBack}
        className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200"
        disabled={loading}
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
            <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        ) : (
          <span>Back</span>
        )}
      </button>
    </div>
  );
}
