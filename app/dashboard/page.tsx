"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/backend/auth";
import { dashboardApi } from "@/lib/backend/owner/dashboard";
import { AuthGate } from "@/components/auth/AuthGate";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { DashboardListingPanel } from "@/components/dashboard/DashboardListingPanel";

export default function DashboardPage() {
  const { user, token, hydrated } = useAuthStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const query = useInfiniteQuery({
    queryKey: ["dashboard", token, "listings"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => dashboardApi.listings(pageParam),
    getNextPageParam: (last, pages) => (last.next ? pages.length + 1 : undefined),
    enabled: hydrated && !!user && !!token,
    retry: false,
  });
  if (!hydrated)
    return (
      <div className="p-8" role="status">
        Loading dashboard…
      </div>
    );
  if (!user || !token)
    return (
      <AuthGate
        title="Sign in to access your dashboard"
        subtitle="Manage your listings, offers and reviews."
      />
    );
  if (query.isPending)
    return (
      <div className="p-8" role="status">
        Loading your listings…
      </div>
    );
  if (query.isError)
    return (
      <div className="p-8" role="alert">
        {query.error.message}{" "}
        <button onClick={() => void query.refetch()} className="underline">
          Try again
        </button>
      </div>
    );
  const listings = query.data.pages.flatMap((page) => page.results);
  if (!listings.length) return <EmptyDashboard />;
  const active = listings.find((listing) => listing.id === activeId) ?? listings[0];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <DashboardHeader />
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Your listings">
        {listings.map((listing) => (
          <button
            key={listing.id}
            onClick={() => setActiveId(listing.id)}
            aria-pressed={active.id === listing.id}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${active.id === listing.id ? "bg-foreground text-background" : "bg-card border-border"}`}
          >
            {listing.name} · {listing.category}
          </button>
        ))}
        {query.hasNextPage && (
          <button
            disabled={query.isFetchingNextPage}
            onClick={() => void query.fetchNextPage()}
            className="px-4 underline"
          >
            {query.isFetchingNextPage ? "Loading…" : "More listings"}
          </button>
        )}
      </div>
      <DashboardListingPanel key={`${token}:${active.id}`} listing={active} />
    </div>
  );
}
