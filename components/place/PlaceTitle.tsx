"use client";

import { OpeningHours } from "./OpeningHours";
import { Clock, MapPin, Star, TrendingUp } from "lucide-react";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import type { Place } from "@/types/place";
import type { VerificationStatus } from "@/types/verification";

export function PlaceTitle({
  place,
  verificationStatus,
}: {
  place: Place;
  verificationStatus: VerificationStatus;
}) {
  const isVerified = verificationStatus === "verified";
  const isPending = verificationStatus === "pending";

  return (
    <div>
      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase">
        <span className="bg-muted rounded-full px-2.5 py-1 capitalize">{place.category}</span>
        {place.cuisine && (
          <span className="bg-muted rounded-full px-2.5 py-1">{place.cuisine}</span>
        )}
        {isVerified && <VerifiedBadge status="verified" size="md" />}
        {isPending && <VerifiedBadge status="pending" size="md" />}
        {!isVerified && !isPending && <VerifiedBadge status="unclaimed" size="md" />}
        {place.trending && (
          <span className="bg-foreground text-background inline-flex items-center gap-1 rounded-full px-2.5 py-1">
            <TrendingUp className="h-3.5 w-3.5" /> Trending
          </span>
        )}
      </div>

      <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
        {place.name}
      </h1>

      <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Star className="fill-brand text-brand h-4 w-4" />
          <span className="text-foreground font-bold">{place.rating}</span>
          <span>({place.reviews} reviews)</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {place.location}
        </span>
        <div className="flex w-full items-start gap-2 pt-2">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <OpeningHours hours={place.hours} />
        </div>
      </div>
    </div>
  );
}
