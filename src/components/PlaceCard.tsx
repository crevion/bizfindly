import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Star } from "lucide-react";
import type { Place } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verification/VerifiedBadge";
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
  return (
    <Link
      to="/place/$slug"
      params={{ slug: place.slug }}
      className={cn(
        "group relative block overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card",
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

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {place.trending && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-foreground shadow-soft">
              Trending
            </span>
          )}
          {place.hiddenGem && (
            <span className="rounded-full glass px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground">
              Hidden Gem
            </span>
          )}
          {showMatch && place.matchScore !== undefined && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background shadow-soft">
              {place.matchScore}% match
            </span>
          )}
          {(() => {
            const v = getPlaceVerification(place.id);
            if (v.status === "verified") return <VerifiedBadge status="verified" size="sm" />;
            if (v.status === "pending") return <VerifiedBadge status="pending" size="sm" />;
            return null;
          })()}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass text-foreground transition hover:bg-foreground/10"
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
          <h3 className="mt-1 font-display text-lg font-bold leading-tight">{place.name}</h3>
          <div className="mt-1.5 flex items-center justify-between text-[12px]">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-brand text-brand" />
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
