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
    <div className="border-border bg-card shadow-soft flex w-[280px] shrink-0 animate-pulse flex-col overflow-hidden rounded-2xl border sm:w-[300px] md:w-[320px]">
      <div className="bg-muted aspect-[4/3]" />
      <div className="space-y-2 p-3.5">
        <div className="bg-muted h-3 w-1/2 rounded" />
        <div className="bg-muted h-4 w-3/4 rounded" />
        <div className="flex items-center justify-between pt-1">
          <div className="bg-muted h-3 w-1/4 rounded" />
          <div className="bg-muted h-3 w-1/6 rounded" />
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
  const placeRows = [
    displayPlaces.filter((_, index) => index % 2 === 0),
    displayPlaces.filter((_, index) => index % 2 === 1),
  ].filter((row) => row.length > 0);

  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-4 py-12 md:px-8 md:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Find your next favorite place
          </h2>
        </div>
        <Link
          href={`/ai-discover?category=${selectedCategory}`}
          className="btn-primary inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          Explore all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="border-border bg-card shadow-soft mb-6 inline-flex max-w-full rounded-full border p-1">
        {CATEGORY_TABS.map((tab, index) => {
          const isActive = tab.key === selectedCategory;
          const count = queries[index].data?.count;

          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              aria-pressed={isActive}
              className={cn(
                "relative min-w-0 cursor-pointer rounded-full px-3 py-2 text-xs font-semibold transition sm:px-5 sm:text-sm",
                isActive
                  ? "bg-foreground text-background shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:ml-2",
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
        <div className="space-y-4">
          {[0, 1].map((row) => (
            <div key={row} className="no-scrollbar flex gap-4 overflow-x-hidden pt-1 pb-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ))}
        </div>
      ) : query.isError ? (
        <div role="alert" className="text-muted-foreground py-12 text-center">
          <p>We couldn’t load these places. Please try again.</p>
          <button
            type="button"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
            className="bg-brand text-brand-foreground mt-4 rounded-xl px-5 py-2 disabled:opacity-50"
          >
            {query.isFetching ? "Retrying…" : "Try again"}
          </button>
        </div>
      ) : displayPlaces.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No places found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {placeRows.map((places, row) => (
            <SmoothInfiniteSlider key={`${selectedCategory}-${row}`} speed={0.75}>
              {places.map((place) => (
                <div key={place.id} className="w-[280px] shrink-0 sm:w-[300px] md:w-[320px]">
                  <PlaceCard place={place} />
                </div>
              ))}
            </SmoothInfiniteSlider>
          ))}
        </div>
      )}
    </section>
  );
}
