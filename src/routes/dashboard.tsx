import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  Heart,
  ImagePlus,
  MessageSquare,
  Plus,
  Star,
  Tag,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { CATEGORIES, loadListings, type ListingDraft } from "@/lib/listingCategories";
import { useAuth } from "@/lib/auth";
import { AuthGate } from "@/components/auth/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Owner dashboard — BizFindly" }] }),
});

function Dashboard() {
  const { user, hydrated } = useAuth();
  const [listings, setListings] = useState<ListingDraft[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const list = loadListings();
    setListings(list);
    if (list[0]?.id) setActiveId(list[0].id);
  }, [user]);

  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!user) {
    return (
      <AuthGate
        title="Sign in to access your dashboard"
        subtitle="Manage your listings, view analytics and respond to reviews."
      />
    );
  }

  const active = listings.find((l) => l.id === activeId) || listings[0];

  if (listings.length === 0) {
    return (
      <DashboardShell variant="owner">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand shadow-glow">
            <BarChart3 className="h-7 w-7 text-brand-foreground" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold md:text-4xl">No listings yet</h1>
          <p className="mt-3 text-muted-foreground">
            List your first restaurant, resort or gym to unlock the owner dashboard.
          </p>
          <Link
            to="/list-business"
            className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> List your business
          </Link>
        </div>
      </DashboardShell>
    );
  }

  if (!active) return null;
  const cfg = active.category ? CATEGORIES[active.category] : null;
  const hero = Object.values(active.images).flat()[0] || cfg?.image;

  // Mock analytics
  const views = 1240 + (active.id ? active.id.length * 7 : 0);
  const saves = Math.round(views * 0.18);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">Owner dashboard</div>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">Welcome back 👋</h1>
        </div>
        <Link
          to="/list-business"
          className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add new listing
        </Link>
      </div>

      {/* Listing switcher */}
      {listings.length > 1 && (
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {listings.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveId(l.id!)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                l.id === active.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-foreground"
              }`}
            >
              {l.name || "Untitled"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main */}
        <div className="space-y-6">
          {/* Hero card */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="relative h-48">
              {hero && <img src={hero} alt="" className="h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="text-xs font-semibold uppercase opacity-80">{cfg?.label}</div>
                <div className="font-display text-2xl font-bold">{active.name}</div>
                <div className="text-sm opacity-90">{active.location}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              <Stat icon={Eye} label="Views" value={views.toLocaleString()} trend="+12%" />
              <Stat icon={Heart} label="Saves" value={saves.toString()} trend="+8%" />
              <Stat icon={Star} label="Rating" value="—" trend="New" />
            </div>
          </div>

          {/* Analytics chart (mock) */}
          <Section title="Views this week" icon={TrendingUp}>
            <div className="flex h-40 items-end gap-2">
              {[40, 65, 50, 80, 72, 95, 88].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg gradient-brand"
                    style={{ height: `${h}%` }}
                  />
                  <div className="text-[10px] font-semibold text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Reviews (mock) */}
          <Section title="Recent reviews" icon={MessageSquare}>
            <div className="space-y-3">
              {[
                { name: "Rumi A.", text: "Loved the rooftop vibe and the food. Will be back!", rating: 5 },
                { name: "Tasnim K.", text: "Great service. Pricing is fair for the quality.", rating: 4 },
              ].map((r, i) => (
                <div key={i} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{r.name}</div>
                    <div className="flex items-center gap-0.5 text-brand">
                      {Array.from({ length: r.rating }).map((_, k) => (
                        <Star key={k} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
                  <button className="mt-2 text-xs font-semibold text-brand hover:underline">
                    Reply
                  </button>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Section title="Quick actions">
            <div className="space-y-2">
              {active.category === "restaurant" && (
                <Link
                  to="/dashboard/menu"
                  className="flex w-full items-center gap-3 rounded-2xl border border-brand/40 bg-gradient-to-r from-brand/10 to-transparent p-3 text-left text-sm font-semibold transition hover:border-brand"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-brand-foreground">
                    <UtensilsCrossed className="h-4 w-4" />
                  </span>
                  Menu management
                  <span className="ml-auto rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase text-brand">
                    New
                  </span>
                </Link>
              )}
              {[
                { icon: ImagePlus, label: "Edit photos" },
                { icon: Tag, label: "Create coupon" },
                { icon: TrendingUp, label: "Boost listing" },
                { icon: MessageSquare, label: "Manage reviews" },
              ].map((a) => (
                <button
                  key={a.label}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left text-sm font-semibold transition hover:border-foreground/30"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                    <a.icon className="h-4 w-4" />
                  </span>
                  {a.label}
                </button>
              ))}
            </div>
          </Section>


          <Section title="Active offers">
            <div className="rounded-2xl border border-dashed border-border p-5 text-center">
              <Tag className="mx-auto h-5 w-5 text-muted-foreground" />
              <div className="mt-2 text-sm font-semibold">No offers yet</div>
              <div className="text-xs text-muted-foreground">Run a coupon to attract new guests.</div>
              <button className="mt-3 inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 py-2 text-xs font-semibold text-brand-foreground">
                <Plus className="h-3.5 w-3.5" /> New offer
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-6">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-brand" />}
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="p-4 text-center">
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-[10px] font-semibold text-brand">{trend}</div>
    </div>
  );
}
