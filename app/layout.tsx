import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/components/shared/auth-provider";
import { QueryProvider } from "@/components/shared/query-provider";
import { ThemeProvider, themeScript } from "@/components/shared/theme-provider";
import { RouteProgress } from "@/components/ui/route-progress";
import SwRegister from "@/components/shared/sw-register";
import AppToaster from "@/components/shared/app-toaster";
import "./globals.css";

// Dynamic font loading optimized with display: swap
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Krishi Tractor — Work, Payments & Reports",
    template: "%s · Krishi Tractor",
  },
  description:
    "Digital records for customers, work history, payments and reports. कृषि ट्रैक्टर का पूरा हिसाब।",
  applicationName: "Krishi Tractor",
  formatDetection: { telephone: false },
  appleWebApp: { 
    capable: true, 
    title: "Krishi Tractor", 
    statusBarStyle: "black-translucent" 
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Avoid unwanted zooming on mobile inputs
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f9ff" }, // Light Sky tint (#f0f9ff)
    { media: "(prefers-color-scheme: dark)", color: "#020617" },  // Deep Dark Slate (#020617)
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`${jakarta.variable} scroll-smooth antialiased`} 
      suppressHydrationWarning
    >
      <head>
        {/* Anti-Flicker theme script */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* PWA manifest and theme color */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f0f9ff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#020617" />
        <link rel="icon" href="/icons/icon-192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-dvh bg-slate-50/60 text-slate-900 font-sans selection:bg-sky-500/20 selection:text-sky-600 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-sky-500/30 dark:selection:text-sky-300 subpixel-antialiased overflow-x-hidden">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <RouteProgress />
              <SwRegister />
              
              {/* Main App Layout Container */}
              <div className="relative flex min-h-dvh flex-col">
                {children}
              </div>

              <AppToaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}