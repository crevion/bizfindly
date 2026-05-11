import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/discover?cat=restaurant", label: "Restaurants" },
  { to: "/discover?cat=cafe", label: "Cafes" },
  { to: "/discover?cat=resort", label: "Resorts" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-glow">
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
            className="hidden rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted md:inline-flex"
          >
            List your business
          </Link>
          <Link
            to="/discover"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-foreground/10 md:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            to="/ai"
            className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-glow transition hover:opacity-95"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Discover</span>
            <span className="sm:hidden">AI</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
