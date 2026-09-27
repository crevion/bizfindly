"use client";

import { Check, MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Place } from "@/types/place";
import { StepHeader } from "./primitives";

export function FindStep({
  query,
  setQuery,
  results,
  searching,
  selected,
  setSelected,
}: {
  query: string;
  setQuery: (s: string) => void;
  results: Place[];
  searching: boolean;
  selected: Place | null;
  setSelected: (b: Place) => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 1 · Find your business"
        title="Which business do you own?"
        sub="Search by name to find your listing on BizFindly."
      />
      <div className="border-border bg-card shadow-soft mt-6 flex items-center gap-2 rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500/30">
        <Search className="text-muted-foreground h-4 w-4" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search restaurants, resorts, gyms…"
          className="flex-1 bg-transparent text-sm outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-2">
        {results.map((b) => {
          const active = selected?.slug === b.slug && selected?.category === b.category;
          return (
            <button
              key={`${b.category}:${b.slug}`}
              onClick={() => setSelected(b)}
              className={cn(
                "bg-card hover:border-foreground/30 flex items-center gap-3 rounded-2xl border p-3 text-left transition",
                active ? "border-sky-500 ring-2 ring-sky-500/30" : "border-border",
              )}
            >
              <div className="bg-muted h-12 w-12 overflow-hidden rounded-xl">
                {b.image && <img src={b.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{b.name}</div>
                <div className="text-muted-foreground truncate text-xs">
                  <MapPin className="mr-1 inline h-3 w-3" />
                  {b.location} · <span className="capitalize">{b.category}</span>
                </div>
              </div>
              {active && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          );
        })}
        {!searching && results.length === 0 && (
          <div className="border-border bg-surface text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm">
            {query
              ? `No matches for "${query}".`
              : "Search for your business name to get started."}
          </div>
        )}
      </div>
    </div>
  );
}
