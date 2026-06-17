"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/lib/backend/auth";
import { listOwnerListings } from "@/lib/backend/places/ownerListings";
import { useListingStore } from "@/store/useListingStore";
import type { ListingDraft } from "@/types/listing";
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
  const localListings = useListingStore((s) => s.listings);
  const listingHydrated = useListingStore((s) => s.hydrated);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [remoteListings, setRemoteListings] = useState<ListingDraft[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(true);

  console.log({ remoteListings });

  useEffect(() => {
    if (!user) return;
    let active = true;
    setRemoteLoading(true);
    listOwnerListings()
      .then((res) => {
        if (active) setRemoteListings(res);
      })
      .catch(() => {
        if (active) setRemoteListings([]);
      })
      .finally(() => {
        if (active) setRemoteLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const listings = useMemo(() => {
    const seen = new Set(remoteListings.map((l) => l.slug ?? l.id));
    const localOnly = localListings.filter((l) => !seen.has(l.slug ?? l.id));
    return [...remoteListings, ...localOnly];
  }, [remoteListings, localListings]);

  useEffect(() => {
    if (!user) return;
    if (listings[0]?.id) setActiveId((prev) => prev ?? listings[0].id ?? null);
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
  if (remoteLoading && listings.length === 0) {
    return <div className="bg-background min-h-screen" />;
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
