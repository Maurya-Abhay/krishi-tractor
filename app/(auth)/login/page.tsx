import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Tractor, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/shared/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-slate-100 p-0 sm:p-4 lg:p-6">
      <div className="mx-auto flex min-h-screen max-w-7xl overflow-hidden bg-white shadow-2xl sm:min-h-[calc(100vh-2rem)] sm:rounded-[28px] lg:min-h-[calc(100vh-3rem)]">
        
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 lg:flex">
          
          {/* Decorative circles */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10" />
          <div className="absolute right-16 top-20 h-20 w-20 rounded-full bg-white/5" />

          {/* Soft wave */}
          <div className="absolute -right-1 top-0 h-full w-24">
            <svg
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path
                d="M0 0 C85 80 15 160 65 240 C105 305 15 385 60 465 C105 545 15 625 65 700 C85 740 45 775 0 800 L100 800 L100 0 Z"
                fill="white"
              />
            </svg>
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between px-10 py-12 xl:px-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
                <Tractor className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  Krishi Tractor
                </p>
                <p className="text-xs text-blue-100">
                  Fleet Management System
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="max-w-md pb-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4" />
                Secure Management Portal
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Manage your
                <br />
                tractor fleet
                <br />
                <span className="text-blue-100">with confidence.</span>
              </h1>

              <p className="mt-6 max-w-sm text-sm leading-6 text-blue-100">
                Keep your tractor records, maintenance details, work history,
                payments and fleet information organized in one place.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Centralized tractor records",
                  "Work and maintenance tracking",
                  "Secure management dashboard",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-100" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-blue-100/80">
              © {new Date().getFullYear()} Krishi Tractor
            </p>
          </div>
        </section>

        {/* MOBILE BRAND HEADER */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center gap-3 bg-gradient-to-r from-blue-700 to-sky-500 px-5 py-5 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md">
            <Tractor className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <p className="font-bold text-white">Krishi Tractor</p>
            <p className="text-[11px] text-blue-100">
              Fleet Management System
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN AREA */}
        <section className="flex min-w-0 flex-1 items-center justify-center px-5 pb-10 pt-28 sm:px-10 lg:px-14 lg:py-12">
          <div className="w-full max-w-md">
            
            {/* Heading */}
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Welcome back
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your phone number and password to access your Krishi
                Tractor management dashboard.
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Terms */}
            <div className="mt-7 text-center text-xs leading-5 text-slate-400">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-slate-600 underline underline-offset-4 transition-colors hover:text-blue-600"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-slate-600 underline underline-offset-4 transition-colors hover:text-blue-600"
              >
                Privacy Policy
              </Link>
              .
            </div>

            {/* Support */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Need help accessing your account?{" "}
              <Link
                href="/support"
                className="font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}