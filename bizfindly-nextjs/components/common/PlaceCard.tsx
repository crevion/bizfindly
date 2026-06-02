"use client";

import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import type { Place } from "@/types/place";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { getPlaceVerification } from "@/lib/verification";

const priceLabel = (n: number) => "৳".repeat(n);

export function PlaceCard({
  place,
  className,
  showMatch,
}: {
  place: Place;
  className?: string;
  showMatch?: boolean;
}) {
  const v = getPlaceVerification(place.id);

  return (
    <Link
      href={`/place/${place.slug}`}
      className={cn(
        "group bg-card shadow-soft hover:shadow-card relative block overflow-hidden rounded-3xl transition hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {place.trending && (
            <span className="bg-brand text-brand-foreground shadow-soft rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
              Trending
            </span>
          )}
          {place.hiddenGem && (
            <span className="glass text-foreground rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
              Hidden Gem
            </span>
          )}
          {showMatch && place.matchScore !== undefined && (
            <span className="bg-foreground text-background shadow-soft rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
              {place.matchScore}% match
            </span>
          )}
          {v.status === "verified" && <VerifiedBadge status="verified" size="sm" />}
          {v.status === "pending" && <VerifiedBadge status="pending" size="sm" />}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="glass text-foreground hover:bg-foreground/10 absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full transition"
          aria-label="Save"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-90">
            <MapPin className="h-3 w-3" />
            {place.area}
            <span className="opacity-60">·</span>
            <span className="capitalize">{place.cuisine ?? place.category}</span>
          </div>
          <h3 className="font-display mt-1 text-lg leading-tight font-bold">{place.name}</h3>
          <div className="mt-1.5 flex items-center justify-between text-[12px]">
            <span className="inline-flex items-center gap-1">
              <Star className="fill-brand text-brand h-3.5 w-3.5" />
              <span className="font-semibold">{place.rating}</span>
              <span className="opacity-70">({place.reviews})</span>
            </span>
            <span className="font-semibold opacity-90">{priceLabel(place.priceLevel)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
