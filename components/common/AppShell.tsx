"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { MobileNav } from "@/components/common/MobileNav";
import { Footer } from "@/components/common/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = pathname.startsWith("/claim-business");

  return (
    <div className="flex min-h-screen flex-col">
      {!isFullscreen && <Header />}
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      {!isFullscreen && <Footer />}
      {!isFullscreen && <MobileNav />}
    </div>
  );
}
