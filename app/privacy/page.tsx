import { Metadata } from 'next';
import BackToLogin from '@/components/shared/back-to-login';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Krishi Tractor Management',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <BackToLogin />
      <article className="prose">
        <h1>Privacy Policy</h1>
        <p>
          This is the Privacy Policy placeholder for Krishi Tractor Management.
          Describe how user data is collected, used, stored, and protected. Be
          sure to replace this placeholder with your complete privacy policy.
        </p>
        <h2>Data Collection</h2>
        <p>
          Explain what data you collect (e.g., phone number, usage data) and why
          it is required for the service.
        </p>
      </article>
    </main>
  );
}
