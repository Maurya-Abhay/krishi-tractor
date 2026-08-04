import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Tractor } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support | Krishi Tractor",
  description: "Get help with Krishi Tractor Management.",
};

export default function SupportPage() {
  return (
    <main className="bg-slate-50 px-3 py-6 sm:px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          <div className="flex items-center gap-2 font-bold text-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <Tractor className="h-4 w-4 text-white" />
            </div>
            Krishi Tractor
          </div>
        </div>

        {/* Support Card */}
        <section className="rounded border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="border-b border-slate-100 pb-4">
            <p className="mb-1 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Krishi Tractor Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Contact Support
            </h1>

            <p className="mt-1 text-xs sm:text-sm leading-6 text-slate-500">
              Need help accessing your account or using the application?
              Contact us and we’ll help you get back on track.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {/* Email */}
            <a
              href="mailto:support@example.com"
              className="group rounded border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-100">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>

              <h2 className="mt-3 font-semibold text-slate-900 text-sm">
                Email Support
              </h2>

              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                support@example.com
              </p>
            </a>

            {/* Phone */}
            <a
              href="tel:+911234567890"
              className="group rounded border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-100">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>

              <h2 className="mt-3 font-semibold text-slate-900 text-sm">
                Call Support
              </h2>

              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                +91 12345 67890
              </p>
            </a>
          </div>

          <div className="mt-4 rounded bg-slate-50 p-4 text-xs sm:text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">
              Account access issue?
            </span>{" "}
            Please contact your administrator or support team for assistance
            with your account.
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Return to Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}