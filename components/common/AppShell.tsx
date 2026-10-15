"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { MobileNav } from "@/components/common/MobileNav";
import { Footer } from "@/components/common/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDiscover = pathname === "/ai-discover";
  const isFullscreen = pathname.startsWith("/claim-business") || isDiscover;

  return (
    <div
      className={`flex min-h-screen flex-col ${isDiscover ? "bg-background [--background:#f9f6f2]" : ""}`}
    >
      {(!isFullscreen || isDiscover) && <Header />}
      <main className={isFullscreen ? "flex-1" : "flex-1 pb-24 md:pb-0"}>{children}</main>
      {!isFullscreen && <Footer />}
      {!isFullscreen && <MobileNav />}
    </div>
  );
}
