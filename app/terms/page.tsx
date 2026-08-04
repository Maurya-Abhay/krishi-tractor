import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Tractor } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Krishi Tractor",
  description: "Terms of Service for Krishi Tractor Management.",
};

export default function TermsPage() {
  return (
    <main className="bg-slate-50 px-3 py-6 sm:px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
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

        <article className="rounded border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="border-b border-slate-100 pb-4">
            <p className="mb-1 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Krishi Tractor Management
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Terms of Service
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Last updated: August 4, 2026
            </p>
          </div>

          <div className="mt-5 space-y-5 text-sm leading-6 text-slate-600">
            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                1. Acceptance
              </h2>
              <p>
                By using Krishi Tractor Management, you agree to these Terms.
                If you do not agree, please do not use the application.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                2. Use of Service
              </h2>
              <p>
                The application is provided for managing tractors, work,
                maintenance, payments, and related records. Use the service
                only for lawful and authorized purposes.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                3. Account Security
              </h2>
              <p>
                Keep your login credentials secure. You are responsible for
                activity performed through your account.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                4. User Information
              </h2>
              <p>
                You are responsible for ensuring that the information and
                records entered into the application are accurate and lawful.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                5. Service Availability
              </h2>
              <p>
                We aim to provide a reliable service, but temporary downtime
                may occur due to maintenance, technical problems, or other
                circumstances.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                6. Prohibited Use
              </h2>
              <p>
                Do not attempt unauthorized access, damage the system, misuse
                the service, or use it for fraudulent or illegal activities.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                7. Changes
              </h2>
              <p>
                These Terms may be updated from time to time. Continued use of
                the application after changes means you accept the updated
                Terms.
              </p>
            </section>

            <section className="rounded bg-slate-50 p-4">
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                Need Help?
              </h2>
              <p>
                For questions or support, visit our{" "}
                <Link
                  href="/support"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Support page
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}