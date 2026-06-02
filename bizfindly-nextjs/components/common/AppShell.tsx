"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { MobileNav } from "@/components/common/MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAi = pathname.startsWith("/ai");
  const isFullscreen =
    pathname.startsWith("/list-business") || pathname.startsWith("/claim-business");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAi && !isFullscreen && <Header />}
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      {!isAi && !isFullscreen && <MobileNav />}
    </div>
  );
}
