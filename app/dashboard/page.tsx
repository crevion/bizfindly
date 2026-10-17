"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/backend/auth";
import { dashboardApi } from "@/lib/backend/owner/dashboard";
import { AuthGate } from "@/components/auth/AuthGate";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { DashboardListingPanel } from "@/components/dashboard/DashboardListingPanel";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8" role="status">Loading dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const requestedListing = searchParams.get("listing");
  const requestedCategory = searchParams.get("category");
  const shouldEdit = searchParams.get("edit") === "true";
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
  const listings = query.data?.pages.flatMap((page) => page.results) ?? [];
  const requestedBusiness = listings.find((listing) => {
    const matchesListing = listing.slug === requestedListing || listing.id === requestedListing;
    const matchesCategory = !requestedCategory || listing.category === requestedCategory;
    return matchesListing && matchesCategory;
  });

  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = query;

  useEffect(() => {
    // The submitted business may be on a later dashboard page.
    if (requestedListing && !requestedBusiness && hasNextPage &&
        !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [requestedListing, requestedBusiness, hasNextPage,
      isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

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
        <button onClick={() => void query.refetch()} className="cursor-pointer transition-colors enabled:hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed underline">
          Try again
        </button>
      </div>
    );
  if (requestedListing && !requestedBusiness) {
    if (query.hasNextPage && !query.isFetchNextPageError) {
      return <div className="p-8" role="status">Finding your listing…</div>;
    }
    return (
      <div className="p-8" role="alert">
        Could not find your submitted listing.
        <button onClick={() => void query.refetch()} className="ml-2 underline">
          Try again
        </button>
        <Link href="/dashboard" className="ml-2 underline">View all listings</Link>
      </div>
    );
  }
  if (!listings.length) return <EmptyDashboard />;
  const active = listings.find((listing) => listing.id === activeId) ?? requestedBusiness ?? listings[0];
  return (
    <div className="site-container py-8 md:py-12">
      <DashboardHeader />
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Your listings">
        {listings.map((listing) => (
          <button
            key={listing.id}
            onClick={() => setActiveId(listing.id)}
            aria-pressed={active.id === listing.id}
            className={`cursor-pointer transition-colors enabled:hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed rounded-full border px-4 py-2 text-sm font-semibold ${active.id === listing.id ? "bg-foreground text-background" : "bg-card border-border"}`}
          >
            {listing.name} · {listing.category}
          </button>
        ))}
        {query.hasNextPage && (
          <button
            disabled={query.isFetchingNextPage}
            onClick={() => void query.fetchNextPage()}
            className="cursor-pointer transition-colors enabled:hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed px-4 underline"
          >
            {query.isFetchingNextPage ? "Loading…" : "More listings"}
          </button>
        )}
      </div>
      <DashboardListingPanel
        key={`${token}:${active.id}`}
        listing={active}
        initiallyEditing={shouldEdit && active === requestedBusiness}
      />
    </div>
  );
}
