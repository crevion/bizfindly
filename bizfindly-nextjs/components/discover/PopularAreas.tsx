"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { POPULAR_AREAS } from "@/content/discoverFilters";
import { places } from "@/content/places";

export function PopularAreas({ area, setArea }: { area: string; setArea: (s: string) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-brand text-[11px] font-bold tracking-wider uppercase">
            Explore by area
          </p>
          <h2 className="font-display mt-1 text-xl font-bold md:text-2xl">Popular locations</h2>
        </div>
      </div>
      <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
        <button
          onClick={() => setArea("All")}
          className={cn(
            "group relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition",
            area === "All" ? "border-brand" : "border-transparent",
          )}
        >
          <div className="from-brand to-brand/60 absolute inset-0 bg-gradient-to-br" />
          <div className="text-brand-foreground relative flex h-full flex-col items-center justify-center">
            <Sparkles className="h-5 w-5" />
            <span className="mt-1 text-xs font-bold">All areas</span>
          </div>
        </button>
        {POPULAR_AREAS.map((a, i) => {
          const cover = places.find((p) => p.area === a)?.image;
          const active = area === a;
          return (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={cn(
                "group relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition hover:-translate-y-0.5",
                active ? "border-brand shadow-card" : "shadow-soft border-transparent",
              )}
            >
              {cover ? (
                <img
                  src={cover}
                  alt={a}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="bg-muted absolute inset-0" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-2.5 text-left text-white">
                <p className="text-[13px] leading-tight font-bold">{a}</p>
                <p className="text-[10px] opacity-80">
                  {places.filter((p) => p.area === a).length} places
                </p>
              </div>
              {i < 3 && (
                <span className="bg-brand/90 text-brand-foreground absolute top-1.5 right-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                  HOT
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
