import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/discover?cat=restaurant", label: "Restaurants" },
  { to: "/discover?cat=resort", label: "Resorts" },
  { to: "/discover?cat=gym", label: "Gyms" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/80 to-transparent" />
      <div className="relative mx-auto mt-2 flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border border-border/60 bg-background/60 px-3 pl-4 shadow-soft backdrop-blur-2xl md:mx-4 md:gap-6 md:px-4 md:pl-6 lg:mx-auto">
        <Link to="/" className="flex items-center gap-2 transition hover:opacity-90">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-glow ring-1 ring-brand/20">
            <Sparkles className="h-5 w-5 text-brand-foreground" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Biz<span className="text-gradient-brand">Findly</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.to === pathname;
            return (
              <Link
                key={l.to}
                to={l.to.split("?")[0]}
                search={l.to.includes("?") ? Object.fromEntries(new URLSearchParams(l.to.split("?")[1])) : undefined}
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

        <div className="flex items-center gap-2">
          <Link
            to="/list-business"
            className="hidden rounded-full border border-border/80 bg-card/80 px-4 py-2 text-sm font-semibold text-foreground shadow-soft transition hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-card md:inline-flex"
          >
            List your business
          </Link>
          <Link
            to="/discover"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/60 text-foreground transition hover:-translate-y-0.5 hover:bg-card md:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            to="/ai"
            className="relative inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-glow ring-1 ring-brand/30 transition hover:-translate-y-0.5 hover:opacity-95"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Discover</span>
            <span className="sm:hidden">AI</span>
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="ml-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted"
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
              to="/list-business"
              className="ml-1 hidden rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted sm:inline-flex"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
