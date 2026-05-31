"use client";

import { ChevronRight, TrendingUp } from "lucide-react";
import type { Place } from "@/types/place";
import { ModernPlaceCard } from "./ModernPlaceCard";

export function TrendingScroller({ places }: { places: Place[] }) {
  if (places.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-brand inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase">
            <TrendingUp className="h-3 w-3" /> Trending near you
          </p>
          <h2 className="font-display mt-1 text-xl font-bold md:text-2xl">
            What everyone&apos;s loving
          </h2>
        </div>
        <button className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-semibold">
          See all <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
        {places.map((p) => (
          <ModernPlaceCard key={p.id} place={p} className="w-64 shrink-0 md:w-72" />
        ))}
      </div>
    </section>
  );
}

export function HiddenGemsScroller({ places }: { places: Place[] }) {
  if (places.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 md:px-8">
      <div className="from-foreground via-foreground to-foreground/80 text-background rounded-3xl bg-gradient-to-br p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-brand text-[11px] font-bold tracking-wider uppercase">Hidden gems</p>
            <h2 className="font-display mt-1 text-xl font-bold md:text-2xl">
              Places locals quietly love
            </h2>
          </div>
        </div>
        <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-1">
          {places.map((p) => (
            <ModernPlaceCard key={p.id} place={p} className="w-64 shrink-0 md:w-72" />
          ))}
        </div>
      </div>
    </section>
  );
}
