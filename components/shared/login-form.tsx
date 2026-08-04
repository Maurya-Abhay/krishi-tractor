"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
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
      className="space-y-7"
    >
      {/* Phone */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-sm font-semibold text-slate-800"
        >
          Phone Number
        </Label>

        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="Enter your phone number"
          {...register("phone")}
          className="
            h-10
            rounded-none
            border-0
            border-b-2
            border-slate-200
            bg-transparent
            px-0
            text-sm
            text-slate-900
            shadow-none
            outline-none
            transition-colors
            placeholder:text-slate-300
            hover:border-slate-300
            focus:border-blue-500
            focus:ring-0
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        />

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
          className="text-sm font-semibold text-slate-800"
        >
          Password
        </Label>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          className="
            h-10
            rounded-none
            border-0
            border-b-2
            border-slate-200
            bg-transparent
            px-0
            text-sm
            text-slate-900
            shadow-none
            outline-none
            transition-colors
            placeholder:text-slate-300
            hover:border-slate-300
            focus:border-blue-500
            focus:ring-0
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        />

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
        className="
          mt-3
          h-11
          w-full
          rounded-full
          bg-blue-600
          text-sm
          font-semibold
          shadow-md
          shadow-blue-600/20
          transition-all
          hover:bg-blue-700
          disabled:opacity-70
        "
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
    </form>
  );
}