"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2, LockKeyhole, Phone } from "lucide-react";
import { toast } from "sonner";

import {
  loginSchema,
  type LoginInput,
} from "@/lib/validations/report";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    setIsSubmitting(false);

    console.log("signIn result", result);

    if (result?.error) {
      toast.error(`Login failed: ${result.error}`);
      return;
    }

    toast.success("Signed in successfully");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      method="post"
      className="space-y-5"
    >
      {/* Phone */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-sm font-semibold text-slate-700"
        >
          Phone Number
        </Label>

        <div className="relative">
          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="Enter your phone number"
            {...register("phone")}
            className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm shadow-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {errors.phone && (
          <p className="text-xs font-medium text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-semibold text-slate-700"
        >
          Password
        </Label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm shadow-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {errors.password && (
          <p className="text-xs font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Sign In */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-2 h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400">
        <LockKeyhole className="h-3.5 w-3.5" />
        <span>Your account information is securely protected</span>
      </div>
    </form>
  );
}