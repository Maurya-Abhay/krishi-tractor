import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Tractor } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/shared/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-white/5 p-3 shadow-lg ring-1 ring-white/6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600">
                <Tractor className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="mx-auto w-full rounded-2xl bg-card/80 p-6 shadow-elev-4 backdrop-blur-sm sm:p-8">
            <div className="mb-4 text-center">
              <h1 className="text-2xl font-semibold">Krishi Tractor Management</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your records securely</p>
            </div>

            <LoginForm />

            <div className="mt-4 text-center text-xs text-muted-foreground">
              By signing in you agree to our terms and privacy policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
