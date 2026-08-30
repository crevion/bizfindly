"use client";

import { SearchX } from "lucide-react";
import { usePlaceFinderStore } from "./usePlaceFinderStore";

export function PlaceListEmpty() {
  const clearFilters = usePlaceFinderStore((s) => s.clearFilters);

  return (
    <div className="bg-white rounded-3xl border border-border py-16 px-6 flex flex-col items-center text-center shadow-soft">
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-base font-bold text-foreground mb-1">No places found</h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-5">
        We couldn&apos;t find any venues matching your current filters. Try changing your search or resetting filters.
      </p>

      <button
        type="button"
        onClick={clearFilters}
        className="h-9 px-4 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted transition cursor-pointer"
      >
        Clear filters
      </button>
    </div>
  );
}
