"use client";

import { Filter, Grid3x3, Map as MapIcon } from "lucide-react";

export function MobileActionBar({
  view,
  setView,
  onOpenFilters,
  activeFilterCount,
}: {
  view: "grid" | "map";
  setView: (v: "grid" | "map") => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}) {
  return (
    <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center md:hidden">
      <div className="bg-foreground/95 shadow-card flex items-center gap-2 rounded-full p-1.5 backdrop-blur-xl">
        <button
          onClick={onOpenFilters}
          className="bg-background text-foreground relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-brand text-brand-foreground inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px]">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setView(view === "grid" ? "map" : "grid")}
          className="text-background inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold"
        >
          {view === "grid" ? (
            <MapIcon className="h-3.5 w-3.5" />
          ) : (
            <Grid3x3 className="h-3.5 w-3.5" />
          )}
          {view === "grid" ? "Map" : "Grid"}
        </button>
      </div>
    </div>
  );
}
