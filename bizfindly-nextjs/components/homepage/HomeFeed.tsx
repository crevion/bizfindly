"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Place } from "@/types/place";
import { listPlaces } from "@/lib/backend/places";
import { places as mockPlaces } from "@/content/places";
import { PlaceCard } from "@/components/common/PlaceCard";
import { SmoothInfiniteSlider } from "@/components/common/SmoothInfiniteSlider";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = [
  { key: "restaurant", label: "Restaurants", defaultCount: "3.4k+" },
  { key: "resort", label: "Resorts", defaultCount: "320+" },
  { key: "gym", label: "Gyms", defaultCount: "180+" },
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

export function HomeFeed() {
  const [selectedCategory, setSelectedCategory] = useState<"restaurant" | "resort" | "gym">(
    "restaurant",
  );
  const [data, setData] = useState<{
    restaurant: Place[];
    resort: Place[];
    gym: Place[];
  }>({
    restaurant: [],
    resort: [],
    gym: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      listPlaces("restaurant", { pageSize: 30 }).catch(() => []),
      listPlaces("resort", { pageSize: 30 }).catch(() => []),
      listPlaces("gym", { pageSize: 30 }).catch(() => []),
    ])
      .then(([restaurants, resorts, gyms]) => {
        if (!active) return;

        const fallbackRestaurants = mockPlaces.filter((p) => p.category === "restaurant");
        const fallbackResorts = mockPlaces.filter((p) => p.category === "resort");
        const fallbackGyms = mockPlaces.filter((p) => p.category === "gym");

        setData({
          restaurant: restaurants.length > 0 ? restaurants : fallbackRestaurants,
          resort: resorts.length > 0 ? resorts : fallbackResorts,
          gym: gyms.length > 0 ? gyms : fallbackGyms,
        });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const currentList = data[selectedCategory];
  const basePlaces =
    currentList.length > 0
      ? currentList
      : mockPlaces.filter((p) => p.category === selectedCategory);

  let displayPlaces = basePlaces;
  if (displayPlaces.length > 0 && displayPlaces.length < 8) {
    while (displayPlaces.length < 8) {
      displayPlaces = [...displayPlaces, ...basePlaces];
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 overflow-hidden">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold tracking-wide text-brand uppercase">
            Trending near you
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            What people are loving in Dhaka
          </h2>
        </div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand"
        >
          Explore all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1 shadow-soft">
        {CATEGORY_TABS.map((tab) => {
          const isActive = tab.key === selectedCategory;
          const count =
            data[tab.key as keyof typeof data]?.length > 0
              ? `${data[tab.key as keyof typeof data].length}+`
              : tab.defaultCount;

          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key as "restaurant" | "resort" | "gym")}
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
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="no-scrollbar flex gap-4 overflow-x-hidden pb-3 pt-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
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
