"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "ktm-theme";

/**
 * Runs before first paint to avoid a light-mode flash on a dark-mode device.
 * Kept as a raw string so it can be injected with `dangerouslySetInnerHTML`
 * in <head>, ahead of React hydration. Must stay dependency-free and tiny.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}")||"system";var d=s==="dark"||(s==="system"&&matchMedia("(prefers-color-scheme:dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light"}catch(_){}})()`;

type ThemeContextValue = {
  theme: Theme;
  /** The theme actually applied right now — `system` resolved to light/dark. */
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function apply(theme: Theme): "light" | "dark" {
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
  return isDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolved, setResolved] = React.useState<"light" | "dark">("light");

  // Read the stored preference after mount. The inline script already applied
  // the correct class, so this only syncs React state — it never repaints.
  React.useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setThemeState(stored);
    setResolved(apply(stored));
  }, []);

  // Follow the OS only while the user hasn't picked an explicit theme.
  React.useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(apply("system"));
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = React.useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
    setResolved(apply(next));
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolved, setTheme }),
    [theme, resolved, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
