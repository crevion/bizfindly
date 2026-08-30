"use client";

import { TrendingUp } from "lucide-react";
import type { Place } from "@/types/place";
import { ModernPlaceCard } from "./ModernPlaceCard";
import { SmoothInfiniteSlider } from "@/components/common/SmoothInfiniteSlider";

export function TrendingScroller({ places }: { places: Place[] }) {
  if (places.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8 overflow-hidden">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-brand inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase">
            <TrendingUp className="h-3 w-3" /> Trending near you
          </p>
          <h2 className="font-display mt-1 text-xl font-bold md:text-2xl">
            What everyone&apos;s loving
          </h2>
        </div>
      </div>

      <SmoothInfiniteSlider speed={40}>
        {places.map((p, idx) => (
          <div key={`${p.id}-${idx}`} className="w-[280px] sm:w-[300px] md:w-[320px] shrink-0">
            <ModernPlaceCard place={p} />
          </div>
        ))}
      </SmoothInfiniteSlider>
    </section>
  );
}

export function HiddenGemsScroller({ places }: { places: Place[] }) {
  if (places.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 md:px-8">
      <div className="from-foreground via-foreground to-foreground/80 text-background rounded-3xl bg-gradient-to-br p-6 md:p-8 overflow-hidden">
        <div className="mb-4">
          <p className="text-brand text-[11px] font-bold tracking-wider uppercase">Hidden gems</p>
          <h2 className="font-display mt-1 text-xl font-bold md:text-2xl text-background">
            Places locals quietly love
          </h2>
        </div>

        <SmoothInfiniteSlider speed={35} gradientEdges={false}>
          {places.map((p, idx) => (
            <div key={`${p.id}-${idx}`} className="w-[280px] sm:w-[300px] md:w-[320px] shrink-0">
              <ModernPlaceCard place={p} />
            </div>
          ))}
        </SmoothInfiniteSlider>
      </div>
    </section>
  );
}
