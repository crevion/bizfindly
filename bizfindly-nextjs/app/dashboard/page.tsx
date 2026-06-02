"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/backend/auth";
import { useListingStore } from "@/store/useListingStore";
import { AuthGate } from "@/components/auth/AuthGate";
import { ActiveOffers } from "@/components/dashboard/ActiveOffers";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { ListingHero } from "@/components/dashboard/ListingHero";
import { ListingSwitcher } from "@/components/dashboard/ListingSwitcher";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentReviews } from "@/components/dashboard/RecentReviews";
import { ViewsChart } from "@/components/dashboard/ViewsChart";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const listings = useListingStore((s) => s.listings);
  const listingHydrated = useListingStore((s) => s.hydrated);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (listings[0]?.id) setActiveId(listings[0].id);
  }, [user, listings]);

  if (!hydrated || !listingHydrated) return <div className="bg-background min-h-screen" />;
  if (!user) {
    return (
      <AuthGate
        title="Sign in to access your dashboard"
        subtitle="Manage your listings, view analytics and respond to reviews."
      />
    );
  }
  if (listings.length === 0) return <EmptyDashboard />;

  const active = listings.find((l) => l.id === activeId) || listings[0];
  if (!active) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <DashboardHeader />
      <ListingSwitcher listings={listings} activeId={active.id} onPick={setActiveId} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <ListingHero active={active} />
          <ViewsChart />
          <RecentReviews />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <ActiveOffers />
        </div>
      </div>
    </div>
  );
}
