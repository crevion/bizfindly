"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/backend/auth";
import { HEADER_LINKS } from "@/content/navigation";

function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat");

  const isActive = (to: string) => {
    const [path, query] = to.split("?");
    if (path !== pathname) return false;
    if (!query) return !activeCat;
    return new URLSearchParams(query).get("cat") === activeCat;
  };

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {HEADER_LINKS.map((l) => {
        const active = isActive(l.to);
        return (
          <Link
            key={l.to}
            href={l.to}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40">
      <div className="from-background/80 pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent" />
      <div className="border-border/60 bg-background/60 shadow-soft relative mx-auto mt-2 flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border px-3 pl-4 backdrop-blur-2xl md:mx-4 md:gap-6 md:px-4 md:pl-6 lg:mx-auto">
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
          <span className="gradient-brand shadow-glow ring-brand/20 flex h-9 w-9 items-center justify-center rounded-xl ring-1">
            <Sparkles className="text-brand-foreground h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Biz<span className="text-gradient-brand">Findly</span>
          </span>
        </Link>

        <Suspense fallback={<nav className="hidden items-center gap-1 md:flex" />}>
          <HeaderNav />
        </Suspense>

        <div className="flex items-center gap-2">
          <Link
            href="/list-business"
            className="border-border/80 bg-card/80 text-foreground shadow-soft hover:border-foreground/40 hover:bg-card hidden rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 md:inline-flex"
          >
            List your business
          </Link>
          <Link
            href="/discover"
            className="border-border/80 bg-card/60 text-foreground hover:bg-card hidden h-10 w-10 items-center justify-center rounded-full border transition hover:-translate-y-0.5 md:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/ai"
            className="gradient-brand text-brand-foreground shadow-glow ring-brand/30 relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition hover:-translate-y-0.5 hover:opacity-95"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Discover</span>
            <span className="sm:hidden">AI</span>
          </Link>
          {user ? (
            <Link
              href="/profile"
              className="border-border bg-muted ml-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border"
              title={user.name}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </Link>
          ) : (
            <Link
              href="/join"
              className="border-border bg-background text-foreground hover:bg-muted ml-1 hidden rounded-full border px-3 py-2 text-sm font-semibold transition sm:inline-flex"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
