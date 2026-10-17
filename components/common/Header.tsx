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
  const isDiscover = pathname === "/ai-discover";
  const user = useAuthStore((s) => s.user);

  return (
    <header className={cn("site-container sticky top-0 z-40 py-2", isDiscover && "bg-background")}>
      {!isDiscover && (
        <div className="from-background/90 pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent" />
      )}
      <div
        className={cn(
          "border-border/70 bg-background/80 shadow-soft relative flex h-16 items-center justify-between gap-3 rounded-2xl border px-3 backdrop-blur-xl md:gap-4 md:px-4",
          "w-full",
        )}
      >
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
            href="/ai-discover"
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
              className="border-border bg-card text-foreground shadow-soft hover:border-foreground/30 hover:bg-muted ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition hover:scale-105"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
