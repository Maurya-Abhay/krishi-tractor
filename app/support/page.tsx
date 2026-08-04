import Link from "next/link";
import BackToLogin from "@/components/shared/back-to-login";

export default function SupportPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <BackToLogin />
      <section className="prose">
        <h1>Contact Support</h1>
        <p>If you're having trouble accessing your account, contact the administrator or call the support number.</p>
        <p>
          For quick help, email <a href="mailto:support@example.com">support@example.com</a> or call <a href="tel:+911234567890">+91 12345 67890</a>.
        </p>
        <p>
          Return to <Link href="/login" className="text-emerald-600">Login</Link>.
        </p>
      </section>
    </main>
  );
}
