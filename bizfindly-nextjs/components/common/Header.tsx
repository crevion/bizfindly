"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/backend/auth";
import { HEADER_LINKS } from "@/content/navigation";
import { UserDropdown } from "./UserDropdown";

export function Header() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/90 to-transparent" />
      <div className="relative mx-auto mt-2 flex h-16 max-w-7xl items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/80 px-3 shadow-soft backdrop-blur-xl md:mx-4 md:gap-4 md:px-4 lg:mx-auto">
        <Link href="/" className="flex shrink-0 items-center gap-2 transition hover:opacity-90">
          <img
            src="/images/logo/bizfindly-logo.png"
            alt="BizFindly"
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {HEADER_LINKS.map((link) => {
            const isActive = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                href={link.to}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/ai"
            className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Discover</span>
            <span className="sm:hidden">AI</span>
          </Link>
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link
              href="/join"
              aria-label="Sign in or join"
              title="Sign in or join"
              className="ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-foreground shadow-soft transition hover:border-foreground/30 hover:scale-105 hover:bg-muted"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
