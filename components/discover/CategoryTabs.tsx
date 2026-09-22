"use client";

import { Grid3x3, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DISCOVER_CATEGORIES, type DiscoverCategory } from "@/content/discoverFilters";

export function CategoryTabs({
  cat,
  setCat,
  view,
  setView,
}: {
  cat: DiscoverCategory;
  setCat: (c: DiscoverCategory) => void;
  view: "grid" | "map";
  setView: (v: "grid" | "map") => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
        {DISCOVER_CATEGORIES.map((c) => {
          const active = cat === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                active
                  ? "bg-foreground text-background shadow-soft scale-105"
                  : "bg-card text-foreground hover:bg-muted",
              )}
            >
              <span className="mr-1.5">{c.emoji}</span>
              {c.label}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => setView(view === "grid" ? "map" : "grid")}
        className="bg-foreground text-background shadow-soft hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 md:inline-flex"
      >
        {view === "grid" ? <MapIcon className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
        {view === "grid" ? "Map" : "Grid"}
      </button>
    </div>
  );
}
