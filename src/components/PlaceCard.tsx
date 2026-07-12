import { Link } from "@tanstack/react-router";
import { BadgeCheck, Clock, Heart, MapPin, Star, Tag } from "lucide-react";
import type { Place } from "@/lib/mockData";
import { cn } from "@/lib/utils";
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
  const isVerified = v.status === "verified";
  // Deterministic "open now" & coupon flags from id for premium feel
  const idNum = parseInt(place.id, 10) || 0;
  const openNow = idNum % 4 !== 0;
  const hasCoupon = idNum % 3 === 0;

  return (
    <Link
      to="/place/$slug"
      params={{ slug: place.slug }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:border-foreground/10 hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {place.trending && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
              Trending
            </span>
          )}
          {showMatch && place.matchScore !== undefined && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-background">
              {place.matchScore}% match
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition hover:bg-background hover:text-brand"
          aria-label="Save"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Bottom chips */}
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-1.5">
          {openNow && (
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
          <span className="truncate">{place.area}</span>
          <span className="opacity-60">·</span>
          <span className="truncate capitalize">{place.cuisine ?? place.category}</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate font-display text-[15px] font-bold leading-tight text-foreground">
            {place.name}
          </h3>
          {isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-info" />}
        </div>
        <div className="mt-1 flex items-center justify-between text-[12px]">
          <span className="inline-flex items-center gap-1 text-foreground">
            <Star className="h-3.5 w-3.5 fill-brand text-brand" />
            <span className="font-semibold">{place.rating}</span>
            <span className="text-muted-foreground">({place.reviews.toLocaleString()})</span>
          </span>
          <span className="font-semibold text-muted-foreground">{priceLabel(place.priceLevel)}</span>
        </div>
      </div>
    </Link>
  );
}
