import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  future: {
    // Smaller CSS: only emit hover styles on devices that actually hover,
    // which also kills sticky :hover states on touch screens.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", lg: "1.5rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      screens: {
        xs: "420px",
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          strong: "hsl(var(--border-strong))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          soft: "hsl(var(--primary-soft))",
          "soft-foreground": "hsl(var(--primary-soft-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          soft: "hsl(var(--accent-soft))",
          strong: "hsl(var(--accent-strong))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          soft: "hsl(var(--destructive-soft))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          soft: "hsl(var(--success-soft))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          soft: "hsl(var(--warning-soft))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        xs: "calc(var(--radius) - 8px)",
        sm: "calc(var(--radius) - 6px)",
        md: "calc(var(--radius) - 4px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 10px)",
        "3xl": "calc(var(--radius) + 18px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        // Slightly tighter tracking on display sizes reads as "designed"
        "display-lg": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        display: ["1.75rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-sm": ["1.375rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "650" }],
      },
      boxShadow: {
        "elev-1": "var(--elev-1)",
        "elev-2": "var(--elev-2)",
        "elev-3": "var(--elev-3)",
        "elev-4": "var(--elev-4)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        spring: "var(--ease-spring)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        enter: {
          from: { opacity: "0", transform: "translateY(6px) scale(0.985)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "sheet-down": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "zoom-out": {
          from: { opacity: "1", transform: "translateY(0) scale(1)" },
          to: { opacity: "0", transform: "translateY(4px) scale(0.985)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        progress: {
          "0%": { transform: "translateX(-100%) scaleX(0.4)" },
          "50%": { transform: "translateX(0%) scaleX(0.7)" },
          "100%": { transform: "translateX(100%) scaleX(0.4)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in var(--dur) var(--ease-out) both",
        enter: "enter var(--dur-slow) var(--ease-out) both",
        "slide-up": "slide-up var(--dur-slow) var(--ease-out) both",
        "slide-down": "slide-down var(--dur) var(--ease-out) both",
        "sheet-up": "sheet-up var(--dur-slow) var(--ease-out) both",
        "sheet-down": "sheet-down var(--dur-fast) var(--ease-out) both",
        "zoom-out": "zoom-out var(--dur-fast) var(--ease-out) both",
        shimmer: "shimmer 1.6s infinite",
        progress: "progress 1.1s var(--ease-out) infinite",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
