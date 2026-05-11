import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Heart, History, MapPin, Settings, Star, Store } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Profile — BizFindly" }] }),
});

const items = [
  { label: "Saved places", icon: Heart, to: "/saved" },
  { label: "My reviews", icon: Star, to: "/profile" },
  { label: "Recommendation history", icon: History, to: "/ai" },
  { label: "List your business", icon: Store, to: "/list-business" },
  { label: "Owner dashboard", icon: Settings, to: "/dashboard" },
] as const;

function Profile() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <div className="rounded-3xl gradient-brand p-6 text-brand-foreground shadow-glow md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-2xl font-bold text-background">
            G
          </div>
          <div>
            <div className="font-display text-2xl font-bold">Welcome, Guest</div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="h-3.5 w-3.5" /> Dhaka, Bangladesh
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button className="flex-1 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">
            Sign in
          </button>
          <button className="flex-1 rounded-full bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur">
            Create account
          </button>
        </div>
      </div>

      <div className="mt-6 divide-y divide-border overflow-hidden rounded-3xl bg-card shadow-soft">
        {items.map(({ label, icon: Icon, to }) => (
          <Link key={label} to={to} className="flex items-center gap-3 p-4 transition hover:bg-muted">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex-1 font-medium">{label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        BizFindly · AI-powered local discovery
      </p>
    </div>
  );
}
