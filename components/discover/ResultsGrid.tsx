"use client";

import { SORT_OPTIONS, type DiscoverCategory, type SortOption } from "@/content/discoverFilters";
import type { Place } from "@/types/place";
import { ModernPlaceCard } from "./ModernPlaceCard";
import { DiscoverCardSkeleton } from "./DiscoverCardSkeleton";
import { MapView } from "./MapView";
import { CustomSelect } from "@/components/common/CustomSelect";
import { SlidersHorizontal } from "lucide-react";

export function ResultsGrid({
  cat,
  area,
  filtered,
  sort,
  setSort,
  view,
  onReset,
  loading,
}: {
  cat: DiscoverCategory;
  area: string;
  filtered: Place[];
  sort: SortOption;
  setSort: (s: SortOption) => void;
  view: "grid" | "map";
  onReset: () => void;
  loading?: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            {area === "All" ? "All" : area}{" "}
            <span className="capitalize">{cat === "gym" ? "gyms" : cat + "s"}</span>
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {loading
              ? "Finding places…"
              : `${filtered.length} ${filtered.length === 1 ? "place" : "places"} match your vibe`}
          </p>
        </div>
        <div className="hidden md:block">
          <CustomSelect
            value={sort}
            options={[...SORT_OPTIONS]}
            onChange={(val) => setSort(val as SortOption)}
            icon={<SlidersHorizontal size={13} />}
            triggerClassName="h-9 px-3.5 rounded-full border border-border bg-card text-xs font-semibold text-foreground shadow-soft min-w-[170px]"
            menuClassName="w-[190px]"
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DiscoverCardSkeleton key={i} />
          ))}
        </div>
      ) : view === "map" ? (
        <MapView places={filtered} />
      ) : filtered.length === 0 ? (
        <div className="border-border bg-card mt-6 rounded-3xl border border-dashed p-12 text-center">
          <p className="font-display text-lg font-semibold">No matches yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try clearing some filters or another area.
          </p>
          <button
            onClick={onReset}
            className="bg-foreground text-background mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ModernPlaceCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </section>
  );
}
