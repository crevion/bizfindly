import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Heart,
  LogOut,
  Menu,
  Plus,
  Settings,
  Shield,
  Sparkles,
  Store,
  User as UserIcon,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import logoAsset from "@/assets/bizfindly-logo.png.asset.json";

type Variant = "owner" | "admin" | "user";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV: Record<Variant, { title: string; kicker: string; items: NavItem[] }> = {
  owner: {
    kicker: "Owner",
    title: "Business hub",
    items: [
      { to: "/dashboard", label: "Overview", icon: BarChart3, exact: true },
      { to: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
      { to: "/list-business", label: "Add listing", icon: Plus },
      { to: "/claim-business", label: "Claim & verify", icon: BadgeCheck },
    ],
  },
  admin: {
    kicker: "Admin",
    title: "Moderation",
    items: [
      { to: "/admin/verifications", label: "Verifications", icon: Shield },
    ],
  },
  user: {
    kicker: "Account",
    title: "Your BizFindly",
    items: [
      { to: "/account", label: "Overview", icon: Sparkles, exact: true },
      { to: "/saved", label: "Saved places", icon: Heart },
      { to: "/profile", label: "Profile & settings", icon: Settings },
      { to: "/list-business", label: "List a business", icon: Store },
    ],
  },
};

export function DashboardShell({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const detected: Variant =
    variant ??
    (pathname.startsWith("/admin")
      ? "admin"
      : pathname.startsWith("/dashboard")
      ? "owner"
      : "user");

  const cfg = NAV[detected];
  const initial = (user?.name || "G").charAt(0).toUpperCase();

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-5 pt-5 pb-4">
        <img src={logoAsset.url} alt="BizFindly" className="h-8 w-auto" />
      </Link>

      <div className="px-5 pb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {cfg.kicker}
        </div>
        <div className="mt-0.5 font-display text-lg font-bold text-foreground">{cfg.title}</div>
      </div>

      <nav className="flex-1 space-y-1 px-3 pb-4">
        {cfg.items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          to="/"
          className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to site
        </Link>
        <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-sm font-bold text-background">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{user?.name || "Guest"}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {user?.email || user?.phone || "Not signed in"}
            </div>
          </div>
          {user && (
            <button
              onClick={signOut}
              title="Sign out"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-border bg-background md:block">
        {SidebarBody}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoAsset.url} alt="BizFindly" className="h-7 w-auto" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-semibold"
        >
          <Menu className="h-4 w-4" /> {cfg.kicker}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[260px] bg-background shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
            {SidebarBody}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="md:pl-[260px]">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}

export const DASHBOARD_ROUTE_PREFIXES = ["/dashboard", "/admin", "/account", "/profile", "/saved"];

export function isDashboardRoute(pathname: string) {
  return DASHBOARD_ROUTE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}
