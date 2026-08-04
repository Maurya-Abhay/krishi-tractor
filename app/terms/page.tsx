import { Metadata } from 'next';
import BackToLogin from '@/components/shared/back-to-login';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Krishi Tractor Management',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <BackToLogin />
      <article className="prose">
        <h1>Terms of Service</h1>
        <p>
          These are the Terms of Service for Krishi Tractor Management. This page
          contains the legal terms that govern use of this application. Replace
          this placeholder text with your full terms before publishing.
        </p>
        <h2>Usage</h2>
        <p>By using this application you agree to comply with the rules and policies described here.</p>
      </article>
    </main>
  );
}
