"use client";

import { Sparkles } from "lucide-react";
import { PlaceCard } from "@/components/common/PlaceCard";
import type { Place } from "@/types/place";

export function AiResults({
  results,
  onRetry,
  onBrowseAll,
}: {
  results: (Place & { matchScore: number })[];
  onRetry: () => void;
  onBrowseAll: () => void;
}) {
  return (
    <div>
      <div className="bg-brand/10 text-brand inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
        <Sparkles className="h-3.5 w-3.5" />
        Your AI matches
      </div>
      <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">
        We found <span className="text-gradient-brand">{results.length}</span> places for you
      </h2>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Based on your mood, budget and vibe — ranked by match score.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {results.map((p) => (
          <PlaceCard key={p.id} place={p} showMatch />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          onClick={onRetry}
          className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          Try again
        </button>
        <button
          onClick={onBrowseAll}
          className="border-border bg-card inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold"
        >
          Browse all places
        </button>
      </div>
    </div>
  );
}
