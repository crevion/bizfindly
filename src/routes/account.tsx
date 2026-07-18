import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Compass, Heart, Settings, Sparkles, Star, Store } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AuthGate } from "@/components/auth/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Your account — BizFindly" }] }),
});

function AccountPage() {
  const { user, hydrated } = useAuth();
  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!user) {
    return (
      <AuthGate
        title="Sign in to access your account"
        subtitle="Save places, track reviews and manage your BizFindly experience."
      />
    );
  }

  const first = user.name.split(" ")[0];

  return (
    <DashboardShell variant="user">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand">Overview</div>
        <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">Welcome back, {first}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here's a quick look at your activity across BizFindly.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard icon={Heart} label="Saved places" value="3" />
          <StatCard icon={Star} label="Reviews written" value="0" />
          <StatCard icon={Sparkles} label="AI searches" value="12" />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <ActionCard
            to="/discover"
            icon={Compass}
            title="Discover more"
            desc="Browse trending restaurants, resorts and gyms near you."
          />
          <ActionCard
            to="/ai"
            icon={Sparkles}
            title="Ask the AI finder"
            desc="Get personalised picks by describing exactly what you want."
          />
          <ActionCard
            to="/list-business"
            icon={Store}
            title="List your business"
            desc="Add your restaurant, resort or gym in a few steps."
          />
          <ActionCard
            to="/claim-business"
            icon={BadgeCheck}
            title="Claim a business"
            desc="Already listed? Verify ownership to unlock owner tools."
          />
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">Profile & preferences</h2>
              <p className="text-sm text-muted-foreground">
                Manage your name, contact info and account settings.
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
            >
              <Settings className="h-4 w-4" /> Open profile
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <Icon className="h-4 w-4 text-brand" />
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ActionCard({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-foreground/30"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-display text-base font-bold">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
      </div>
    </Link>
  );
}
