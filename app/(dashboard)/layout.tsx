import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main
          id="main"
          className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] pt-5 md:px-6 md:pb-8"
        >
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
