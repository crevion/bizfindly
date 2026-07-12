import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import logoAsset from "@/assets/bizfindly-logo.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/ai", label: "AI Search" },
  { to: "/list-business", label: "List Business" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/90 to-transparent" />
      <div className="relative mx-auto mt-2 flex h-16 max-w-7xl items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/80 px-3 shadow-soft backdrop-blur-xl md:mx-4 md:gap-4 md:px-4 lg:mx-auto">
        <Link to="/" className="flex shrink-0 items-center gap-2 transition hover:opacity-90">
          <img src={logoAsset.url} alt="BizFindly" className="h-8 w-auto md:h-9" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = l.to === pathname;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Global search */}
        {!isHome && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) nav({ to: "/ai", search: { q: q.trim() } as never });
              else nav({ to: "/ai" });
            }}
            className="hidden min-w-0 flex-1 md:block"
          >
            <div className="mx-auto flex max-w-md items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-soft transition focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/20">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search anywhere — try “rooftop in Gulshan”"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <span className="hidden items-center gap-1 rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold text-brand sm:inline-flex">
                <Sparkles className="h-3 w-3" /> AI
              </span>
            </div>
          </form>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/list-business"
            className="hidden rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-soft transition hover:-translate-y-0.5 hover:border-foreground/30 md:inline-flex"
          >
            List Business
          </Link>
          <Link
            to="/ai"
            className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Discover</span>
            <span className="sm:hidden">AI</span>
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-muted"
              title={user.name}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
