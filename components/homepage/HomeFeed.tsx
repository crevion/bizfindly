"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Place } from "@/types/place";
import { PlaceCard } from "@/components/common/PlaceCard";
import { SmoothInfiniteSlider } from "@/components/common/SmoothInfiniteSlider";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = [
  { key: "restaurant", label: "Restaurants" },
  { key: "resort", label: "Resorts" },
  { key: "gym", label: "Gyms" },
];

function CardSkeleton() {
  return (
    <div className="w-[280px] sm:w-[300px] md:w-[320px] shrink-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 w-1/2 bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-1/6 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

interface FeedQuery {
  data?: { count: number; places: Place[] };
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => unknown;
}

export function HomeFeed({ queries }: { queries: FeedQuery[] }) {
  const [selectedCategory, setSelectedCategory] = useState("restaurant");
  const query = queries[CATEGORY_TABS.findIndex((tab) => tab.key === selectedCategory)];
  const displayPlaces = query.data?.places ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 overflow-hidden">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold tracking-wide text-brand uppercase">
            Explore Bangladesh
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Find your next favorite place
          </h2>
        </div>
        <Link
          href={`/ai-discover?category=${selectedCategory}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand"
        >
          Explore all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1 shadow-soft">
        {CATEGORY_TABS.map((tab, index) => {
          const isActive = tab.key === selectedCategory;
          const count = queries[index].data?.count;

          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 cursor-pointer",
                isActive
                  ? "bg-foreground text-background shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  isActive ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                )}
              >
                {count === undefined ? "—" : count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {query.isPending ? (
        <div className="no-scrollbar flex gap-4 overflow-x-hidden pb-3 pt-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : query.isError ? (
        <div role="alert" className="py-12 text-center text-muted-foreground">
          <p>We couldn’t load these places. Please try again.</p>
          <button type="button" onClick={() => void query.refetch()} disabled={query.isFetching} className="mt-4 rounded-xl bg-brand px-5 py-2 text-brand-foreground disabled:opacity-50">
            {query.isFetching ? "Retrying…" : "Try again"}
          </button>
        </div>
      ) : displayPlaces.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No places found in this category.
        </div>
      ) : (
        <SmoothInfiniteSlider key={selectedCategory} speed={0.75}>
          {displayPlaces.map((place, idx) => (
            <div
              key={`${place.id}-${idx}`}
              className="w-[280px] sm:w-[300px] md:w-[320px] shrink-0"
            >
              <PlaceCard place={place} />
            </div>
          ))}
        </SmoothInfiniteSlider>
      )}
    </section>
  );
}
