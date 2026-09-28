"use client";

import Link from "next/link";
import { BadgeCheck, Clock, MapPin, Star, Tag } from "lucide-react";
import type { Place } from "@/types/place";
import { cn } from "@/lib/utils";
import { hasPriceFigure, priceAmount, PRICE_SYMBOL } from "@/lib/backend/places/price";

// The mappers hand us the range prefixed with the price tier and spelled out
// ("৳৳ • 500–900 per person"); a card only has room for the numbers, behind one
// symbol. A price nobody recorded is left off the card entirely.
const rangeLabel = (range?: string) => {
  if (!hasPriceFigure(range)) return null;
  return `${PRICE_SYMBOL}${priceAmount(range).replace(/\s*per person$/, "")}`;
};

export function PlaceCard({
  place: s,
  className: a,
  showMatch: r,
}: {
  place: Place;
  className?: string;
  showMatch?: boolean;
}) {
  const isVerified = !!s.verified;
  const numId = parseInt(s.id, 10) || 0;
  const isOpenNow = numId % 4 !== 0;
  const hasCoupon = numId % 3 === 0;
  const range = rangeLabel(s.priceRange);

  return (
    <Link
      href={`/place/${s.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:border-foreground/10 hover:shadow-card",
        a,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={s.image}
          alt={s.name}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105 pointer-events-none select-none"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {s.trending && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
              Trending
            </span>
          )}
          {r && s.matchScore !== undefined && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-background">
              {s.matchScore}% match
            </span>
          )}
        </div>
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-1.5">
          {isOpenNow && (
            <span className="inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-0.5 text-[10px] font-semibold text-success shadow-soft backdrop-blur">
              <Clock className="h-3 w-3" /> Open Now
            </span>
          )}
          {hasCoupon && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-brand shadow-soft">
              <Tag className="h-3 w-3" /> Coupon
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{s.area}</span>
          <span className="opacity-60">·</span>
          <span className="truncate capitalize">{s.cuisine ?? s.category}</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate font-display text-[15px] font-bold leading-tight text-foreground">
            {s.name}
          </h3>
          {isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-info" />}
        </div>
        <div className="mt-1 flex items-center justify-between text-[12px]">
          <span className="inline-flex min-w-0 items-center gap-1 text-foreground">
            <Star className="h-3.5 w-3.5 fill-brand text-brand" />
            <span className="font-semibold">{s.rating}</span>
            <span className="text-muted-foreground">({s.reviews?.toLocaleString?.() ?? s.reviews})</span>
          </span>
          {range && <span className="shrink-0 font-semibold text-muted-foreground">{range}</span>}
        </div>
      </div>
    </Link>
  );
}
