"use client";

import Link from "next/link";
import { BadgeCheck, Heart, MapPin, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Place } from "@/types/place";

export function ModernPlaceCard({ place, className }: { place: Place; className?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <Link
      href={`/place/${place.slug}`}
      className={cn(
        "group bg-card shadow-soft ring-border/40 hover:shadow-card hover:ring-brand/30 relative block overflow-hidden rounded-3xl ring-1 transition-all duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {place.trending && (
            <span className="bg-brand text-brand-foreground shadow-soft inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
              <TrendingUp className="h-2.5 w-2.5" /> Trending
            </span>
          )}
          {place.hiddenGem && (
            <span className="bg-background/90 text-foreground rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase backdrop-blur">
              Hidden Gem
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSaved((s) => !s);
          }}
          className="bg-background/90 text-foreground shadow-soft absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition hover:scale-110"
          aria-label="Save"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-brand text-brand")} />
        </button>

        <div className="bg-background/90 text-foreground absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Open now
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display truncate text-base font-bold">{place.name}</h3>
              {place.verified && <BadgeCheck className="text-brand h-4 w-4 shrink-0" />}
            </div>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[12px]">
              <MapPin className="h-3 w-3" />
              {place.area} · <span className="capitalize">{place.cuisine ?? place.category}</span>
            </p>
          </div>
          <div className="bg-foreground text-background shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold">
            <Star className="fill-brand text-brand mr-0.5 inline h-2.5 w-2.5" />
            {place.rating}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {place.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-foreground text-[12px] font-semibold">
            {place.priceRange.split("•")[1]?.trim() ?? place.priceRange}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {place.reviews.toLocaleString()} reviews
          </span>
        </div>
      </div>
    </Link>
  );
}
