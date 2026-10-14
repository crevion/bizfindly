"use client";

import Link from "next/link";
import { Bookmark, MapPin, Sparkles, Star, Tag } from "lucide-react";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import toast from "react-hot-toast";
import type { Place } from "@/types/place";
import { usePlaceFinderStore } from "./usePlaceFinderStore";

import { hasPriceFigure, priceAmount, PRICE_SYMBOL } from "@/lib/backend/places/price";

export function PlaceFinderCard({
  place,
  layout = "grid",
  onAskAi,
}: {
  place: Place;
  layout?: "grid" | "list";
  onAskAi?: () => void;
}) {
  const isSaved = usePlaceFinderStore((s) => s.savedPlaceIds.has(place.id));
  const toggleSavedPlace = usePlaceFinderStore((s) => s.toggleSavedPlace);
  const selectedPlaceId = usePlaceFinderStore((s) => s.selectedPlaceId);
  const toggleSelectedPlace = usePlaceFinderStore((s) => s.toggleSelectedPlace);

  const isSelected = selectedPlaceId === place.id;
  const hasCoupon = place.hasOffer === true;
  const priceText = priceAmount(place.priceRange);
  const showPriceSymbol = hasPriceFigure(place.priceRange);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedPlace(place.id);
    if (isSaved) {
      toast.success("Removed from saved places");
    } else {
      toast.success("Saved to your collection");
    }
  };

  const handleAskAi = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSelectedPlace(place.id);
    onAskAi?.();
  };

  if (layout === "list") {
    const tags = [...new Set([...(place.tags ?? []), ...(place.facilities ?? [])])].slice(0, 3);

    return (
      <article
        className={`group bg-card shadow-soft hover:shadow-card grid grid-cols-[64px_minmax(0,1fr)] items-start gap-3 rounded-[22px] border p-3 transition sm:flex sm:items-stretch sm:gap-4 ${
          isSelected ? "border-brand ring-brand/20 ring-2" : "border-border"
        }`}
      >
        <Link
          href={`/place/${place.slug}`}
          className="bg-muted block h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-32"
        >
          <img
            src={place.image}
            alt={place.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-0.5 sm:gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link href={`/place/${place.slug}`} className="max-w-full min-w-0">
                <h3 className="font-display text-foreground hover:text-brand truncate text-sm font-bold transition sm:text-base">
                  {place.name}
                </h3>
              </Link>
              {place.verified && <VerifiedBadge status="verified" size="sm" />}
            </div>
            <p className="text-muted-foreground mt-0.5 truncate text-xs">
              <span className="capitalize">{place.cuisine || place.category}</span>
              {(place.area || place.location) && <> · {place.area || place.location}</>}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium"
                >
                  {tag}
                </span>
              ))}
              {place.trending && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  Trending
                </span>
              )}
              {hasCoupon && (
                <span className="bg-brand-soft text-brand inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
                  <Tag size={10} />
                  Coupon
                </span>
              )}
            </div>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <span className="text-foreground inline-flex items-center gap-1 font-bold">
              <Star size={12} className="fill-brand text-brand" />
              {place.rating || "New"}
            </span>
            <span>{(place.reviews ?? 0).toLocaleString()} reviews</span>
            {priceText && (
              <span>
                {showPriceSymbol && `${PRICE_SYMBOL} `}
                {priceText}
              </span>
            )}
          </div>
        </div>
        <div className="col-span-2 flex shrink-0 flex-wrap items-center justify-end gap-2 sm:flex-col sm:items-end sm:justify-between">
          {place.matchScore != null && (
            <span
              className="bg-brand/10 text-brand rounded-full px-2 py-0.5 text-[10px] font-bold"
              aria-label={`${place.matchScore}% match`}
            >
              {place.matchScore}%
            </span>
          )}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSave}
              aria-label={isSaved ? "Unsave place" : "Save place"}
              aria-pressed={isSaved}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition sm:h-7 sm:w-7 ${isSaved ? "border-brand bg-brand-soft text-brand" : "border-border text-muted-foreground hover:text-brand"}`}
            >
              <Bookmark size={12} className={isSaved ? "fill-brand" : ""} />
            </button>
            <button
              type="button"
              onClick={handleAskAi}
              aria-label={isSelected ? "Unpin place from AI chat" : "Ask AI about this place"}
              aria-pressed={isSelected}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition sm:h-7 sm:w-7 ${isSelected ? "border-brand bg-brand text-white" : "border-border text-muted-foreground hover:text-brand"}`}
            >
              <Sparkles size={12} />
            </button>
          </div>
          {place.openNow != null && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${place.openNow ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}
            >
              {place.openNow ? "Open now" : "Closed"}
            </span>
          )}
        </div>
      </article>
    );
  }

  return (
    <div
      className={`discover-place-card group bg-card hover:shadow-card relative flex overflow-hidden rounded-[22px] border transition hover:-translate-y-0.5 ${layout === "grid" ? "flex-col" : "flex-col sm:flex-row"} ${
        isSelected ? "border-brand ring-brand/20 shadow-glow ring-2" : "border-border shadow-soft"
      }`}
    >
      {/* Image */}
      <div
        className={`bg-muted relative w-full shrink-0 overflow-hidden ${layout === "grid" ? "aspect-[1.6]" : "aspect-[4/3] sm:aspect-square sm:w-52"}`}
      >
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {place.matchScore != null && (
            <span className="bg-brand rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
              {place.matchScore}% match
            </span>
          )}
          {place.trending && (
            <span className="text-brand-foreground shadow-soft rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase">
              Trending
            </span>
          )}
        </div>
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {hasCoupon && (
            <span className="bg-brand-soft text-brand shadow-soft inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold">
              <Tag size={10} /> Coupon
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs font-medium">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">{place.area || place.location}</span>
                <span className="opacity-50">·</span>
                <span className="truncate capitalize">{place.cuisine || place.category}</span>
              </div>
              <Link href={`/place/${place.slug}`}>
                <h3 className="font-display text-foreground hover:text-brand truncate text-base font-bold transition">
                  {place.name}
                </h3>
              </Link>
              {place.verified && <VerifiedBadge status="verified" size="sm" className="mt-1" />}
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={handleSave}
                aria-label="Save place"
                className={`flex h-11 w-11 cursor-pointer sm:h-8 sm:w-8 items-center justify-center rounded-full border transition ${
                  isSaved
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-border bg-background text-muted-foreground hover:border-brand hover:text-brand"
                }`}
              >
                <Bookmark size={14} className={isSaved ? "fill-brand" : ""} />
              </button>
              <button
                type="button"
                onClick={handleAskAi}
                title={isSelected ? "Pinned to AI Chat" : "Ask AI about this place"}
                className={`flex h-11 w-11 cursor-pointer sm:h-8 sm:w-8 items-center justify-center rounded-full border transition ${
                  isSelected
                    ? "border-brand bg-brand text-brand-foreground shadow-soft"
                    : "border-border bg-background text-muted-foreground hover:border-brand hover:text-brand"
                }`}
              >
                <Sparkles size={14} />
              </button>
            </div>
          </div>

          {place.description && (
            <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
              {place.description}
            </p>
          )}

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {place.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-muted text-foreground/80 rounded-lg px-2 py-0.5 text-[10px] font-medium"
              >
                {tag}
              </span>
            ))}
            {place.facilities?.slice(0, 2).map((fac) => (
              <span
                key={fac}
                className="bg-muted text-muted-foreground rounded-lg px-2 py-0.5 text-[10px] font-medium"
              >
                {fac}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-border mt-4 flex items-center justify-between border-t pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-foreground flex items-center gap-1 font-bold">
              <Star size={13} className="fill-brand text-brand" />
              {place.rating || "New"}
            </span>
            <span className="text-muted-foreground">({(place.reviews ?? 0).toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-2">
            {/* One symbol, not one per price tier -- and none at all when the
                range says "Price on request" rather than a figure. */}
            {showPriceSymbol && (
              <span className="text-foreground text-sm font-bold">{PRICE_SYMBOL}</span>
            )}
            {priceText && <span className="text-muted-foreground text-[11px]">{priceText}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
