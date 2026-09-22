"use client";

import { useEffect, useRef } from "react";
import { MapPin, Navigation, Search, SlidersHorizontal, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { POPULAR_AREAS, TRENDING_SEARCHES } from "@/content/discoverFilters";

export function DiscoverSearchBar({
  query,
  setQuery,
  placeholder,
  showSearchPanel,
  setShowSearchPanel,
  setArea,
  onOpenFilters,
  activeFilterCount,
}: {
  query: string;
  setQuery: (s: string) => void;
  placeholder: string;
  showSearchPanel: boolean;
  setShowSearchPanel: (v: boolean) => void;
  setArea: (s: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}) {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchPanel(false);
      }
    }
    if (showSearchPanel) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showSearchPanel, setShowSearchPanel]);

  return (
    <div className="flex items-center gap-2">
      <button className="border-border bg-card shadow-soft hover:bg-muted hidden shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition md:inline-flex">
        <Navigation className="text-brand h-4 w-4" />
        <span>Dhaka</span>
      </button>

      <div ref={searchRef} className="relative flex-1">
        <div
          className={cn(
            "border-border bg-card shadow-soft flex items-center gap-2 rounded-full border px-5 py-3 transition",
            showSearchPanel && "ring-brand/40 ring-2",
          )}
        >
          <Search className="text-muted-foreground h-4 w-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSearchPanel(true)}
            placeholder={placeholder}
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:bg-muted rounded-full p-1"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {showSearchPanel && (
          <div className="animate-in fade-in border-border bg-card shadow-card absolute inset-x-0 top-full mt-2 rounded-3xl border p-4">
            <p className="text-muted-foreground mb-2 px-1 text-[11px] font-bold tracking-wider uppercase">
              Trending searches
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setQuery(t);
                    setShowSearchPanel(false);
                  }}
                  className="bg-muted text-foreground hover:bg-brand-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition"
                >
                  <TrendingUp className="text-brand h-3 w-3" />
                  {t}
                </button>
              ))}
            </div>
            <p className="text-muted-foreground mt-4 mb-2 px-1 text-[11px] font-bold tracking-wider uppercase">
              Popular areas
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_AREAS.slice(0, 6).map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setArea(a);
                    setShowSearchPanel(false);
                  }}
                  className="border-border hover:bg-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
                >
                  <MapPin className="h-3 w-3" />
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onOpenFilters}
        className="border-border bg-card shadow-soft hover:bg-muted relative hidden shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition md:inline-flex"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-brand text-brand-foreground ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
