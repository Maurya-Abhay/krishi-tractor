"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Tractor, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NAV_ITEMS, isActiveRoute } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";
import { SignOutDialog } from "@/components/shared/sign-out-dialog";

function greeting(hour: number): { en: string; hi: string } {
  if (hour < 12) return { en: "Good morning", hi: "सुप्रभात" };
  if (hour < 17) return { en: "Good afternoon", hi: "नमस्कार" };
  return { en: "Good evening", hi: "शुभ संध्या" };
}

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [hour, setHour] = React.useState<number | null>(null);

  React.useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  const current = NAV_ITEMS.find((item) => isActiveRoute(pathname, item.href));
  const hello = hour === null ? null : greeting(hour);
  const name = session?.user?.name ?? "Admin";
  const userImage = session?.user?.image;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-colors">
      <div className="flex h-12 items-center justify-between gap-2 px-3 sm:px-5">
        {/* Left Section: Mobile Icon & User Greeting */}
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Mobile Brand Badge */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-sky-600 md:hidden">
            <Tractor className="h-4 w-4 text-white" strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            {/* Time Greeting */}
            <div className="flex items-center gap-1 text-[0.7rem] text-sky-800/70 dark:text-sky-300/70">
              {hello ? (
                <p className="truncate font-medium">
                  {hello.en},{" "}
                  <span aria-hidden className="opacity-80">
                    {hello.hi}
                  </span>
                </p>
              ) : (
                <div className="h-2.5 w-16 animate-pulse rounded bg-sky-200/50 dark:bg-sky-900/40" />
              )}
            </div>

            {/* User Name & Current Page Tag */}
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xs sm:text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                {name}
              </h1>
              {current && (
                <span className="hidden items-center gap-1 text-[0.68rem] font-medium text-slate-500 sm:inline-flex">
                  <span className="text-slate-400">•</span>
                  <span className="rounded px-2 py-0.5 text-[0.68rem] bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                    {current.label.en}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Theme Toggle, Profile Badge & Logout */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          {/* User Avatar Badge (Desktop) */}
          <div className="hidden items-center gap-2 rounded-md p-0.5 pr-2 sm:flex">
            {userImage ? (
              <Image
                src={userImage}
                alt={name}
                width={24}
                height={24}
                unoptimized
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-200 text-sky-600 dark:bg-slate-800 dark:text-sky-400">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="max-w-[90px] truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
              {name}
            </span>
          </div>

          {/* Logout Button with confirmation */}
          <SignOutDialog
            onConfirm={() => signOut({ callbackUrl: "/login" })}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 px-2.5 text-xs font-medium text-slate-600 dark:text-slate-300")}
              >
                <LogOut className="h-3.5 w-3.5 sm:mr-1.5" aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
                <span className="sr-only sm:hidden">Sign out</span>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  );
}