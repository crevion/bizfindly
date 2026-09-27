"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/backend/auth";
import { savedApi, savedItemToPlace } from "@/lib/backend/saved/api";
import { PlaceCard } from "@/components/common/PlaceCard";

export function SavedFeed() {
  const { token, user, hydrated } = useAuthStore();
  const query = useInfiniteQuery({
    queryKey: ["saved-places", token],
    queryFn: ({ pageParam }) => savedApi.list(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, pages) => last.next ? pages.length + 1 : undefined,
    enabled: Boolean(token && user && hydrated),
    retry: false,
  });
  const saved = token && user ? query.data?.pages.flatMap((page) => page.results.map(savedItemToPlace)) ?? [] : [];
  const loading = !hydrated || Boolean(token && user && query.isPending);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-end justify-between">
        <div><h1 className="font-display text-3xl font-bold md:text-4xl">Your saved places</h1><p className="mt-1 text-sm text-muted-foreground">Restaurants, resorts and gyms you bookmarked.</p></div>
        {token && user && query.data && <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{query.data.pages[0].count} saved</span>}
      </div>
      {loading ? <div role="status" className="py-12 text-center">Loading saved places…</div>
        : !token || !user ? <div className="py-12 text-center"><p>Sign in to see your saved places.</p><Link href="/join?next=%2Fsaved" className="mt-4 inline-block font-semibold text-brand">Sign in</Link></div>
        : query.isError ? <div role="alert" className="py-12 text-center"><p>{query.error.message}</p><button type="button" onClick={() => void query.refetch()} className="mt-4 font-semibold text-brand">Try again</button></div>
        : saved.length === 0 ? <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center"><Heart className="mx-auto h-10 w-10 text-muted-foreground" /><p className="mt-4 text-lg font-semibold">Nothing saved yet</p><Link href="/ai-discover" className="mt-3 inline-block text-sm font-semibold text-brand">Start browsing →</Link></div>
        : <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{saved.map((place) => <PlaceCard key={`${place.category}-${place.slug}`} place={place} />)}</div>}
      {token && user && query.hasNextPage && <button type="button" disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} className="mt-6 rounded-xl border border-border px-5 py-3">{query.isFetchingNextPage ? "Loading…" : "Load more"}</button>}
    </div>
  );
}
