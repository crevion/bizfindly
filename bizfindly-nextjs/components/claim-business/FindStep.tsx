"use client";

import { Check, MapPin, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchableBusiness } from "@/types/verification";
import { StepHeader } from "./primitives";

export function FindStep({
  query,
  setQuery,
  results,
  selected,
  setSelected,
  creatingNew,
  onCreateNew,
}: {
  query: string;
  setQuery: (s: string) => void;
  results: SearchableBusiness[];
  selected: SearchableBusiness | null;
  setSelected: (b: SearchableBusiness) => void;
  creatingNew: boolean;
  onCreateNew: () => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 1 · Find your business"
        title="Which business do you own?"
        sub="Search by name or location, or add a new business if it's not on BizFindly yet."
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
          const active = selected?.id === b.id;
          return (
            <button
              key={b.id}
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
        {results.length === 0 && (
          <div className="border-border bg-surface text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm">
            No matches for &quot;{query}&quot;.
          </div>
        )}
      </div>

      <button
        onClick={onCreateNew}
        className={cn(
          "mt-4 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed p-4 text-left transition",
          creatingNew
            ? "border-sky-500 bg-sky-500/5"
            : "border-border bg-surface hover:border-foreground/30",
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
          <Plus className="h-5 w-5" />
        </span>
        <div>
          <div className="text-sm font-semibold">Create a new business listing</div>
          <div className="text-muted-foreground text-xs">
            Don&apos;t see it? We&apos;ll create the listing during verification.
          </div>
        </div>
        {creatingNew && (
          <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white">
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    </div>
  );
}
