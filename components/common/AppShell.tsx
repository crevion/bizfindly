"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { MobileNav } from "@/components/common/MobileNav";
import { Footer } from "@/components/common/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDiscover = pathname === "/ai-discover";
  const isAbout = pathname === "/about";
  const isListingBusiness = pathname === "/list-business";
  const isFullscreen = pathname.startsWith("/claim-business") || isDiscover;

  return (
    <div
      className={`flex min-h-screen flex-col ${isDiscover ? "bg-background [--background:#f9f6f2]" : ""} ${isAbout ? "pb-24 md:pb-0" : ""} ${isListingBusiness ? "pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0" : ""}`}
    >
      {(!isFullscreen || isDiscover) && <Header />}
      <main className={isFullscreen || isAbout || isListingBusiness ? "flex-1" : "flex-1 pb-24 md:pb-0"}>{children}</main>
      {!isFullscreen && <Footer />}
      {!isFullscreen && !isListingBusiness && <MobileNav />}
    </div>
  );
}
