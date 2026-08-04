import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Tractor } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Krishi Tractor",
  description: "Privacy Policy for Krishi Tractor Management.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Last updated: August 4, 2026
            </p>
          </div>

          <div className="mt-5 space-y-5 text-sm leading-6 text-slate-600">
            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                1. Introduction
              </h2>
              <p>
                Krishi Tractor Management respects your privacy. This Privacy
                Policy explains what information we collect, why we use it, and
                how we protect it when you use our management platform.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                2. Information We Collect
              </h2>
              <p>
                We may collect account information such as your phone number and
                login credentials. The application may also store tractor
                details, work records, maintenance information, payment records,
                and other information entered by authorized users.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                3. How We Use Information
              </h2>
              <p>
                Information is used to authenticate users, provide tractor and
                fleet management features, maintain records, improve system
                reliability, provide support, and protect the application from
                unauthorized access or misuse.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                4. Data Security
              </h2>
              <p>
                We take reasonable measures to protect stored information from
                unauthorized access, alteration, or disclosure. However, no
                internet-based system can guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                5. Information Sharing
              </h2>
              <p>
                We do not sell your personal information. Information may be
                processed by trusted service providers when necessary to host,
                secure, maintain, or operate the application, or when disclosure
                is required by law.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                6. Data Retention
              </h2>
              <p>
                Information may be retained as long as necessary to provide the
                service, maintain business records, resolve issues, and comply
                with applicable legal requirements.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                7. Your Rights
              </h2>
              <p>
                Where applicable, you may request access to, correction of, or
                deletion of your personal information. We may verify your
                identity before processing such requests.
              </p>
            </section>

            <section>
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy when our services or
                information practices change. Any updated version will be
                published on this page.
              </p>
            </section>

            <section className="rounded bg-slate-50 p-4">
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                Contact
              </h2>
              <p>
                If you have questions about privacy or your information, please
                contact us through our{" "}
                <Link
                  href="/support"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Support
                </Link>{" "}
                page.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}