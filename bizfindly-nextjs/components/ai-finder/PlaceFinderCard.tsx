"use client";

import Link from "next/link";
import { BadgeCheck, Bookmark, Clock, Heart, MapPin, Sparkles, Star, Tag } from "lucide-react";
import toast from "react-hot-toast";
import type { Place } from "@/types/place";
import { usePlaceFinderStore } from "./usePlaceFinderStore";

const priceLabel = (n: number) => "৳".repeat(n || 1);

export function PlaceFinderCard({ place }: { place: Place }) {
  const isSaved = usePlaceFinderStore((s) => s.savedPlaceIds.has(place.id));
  const toggleSavedPlace = usePlaceFinderStore((s) => s.toggleSavedPlace);
  const selectedPlaceId = usePlaceFinderStore((s) => s.selectedPlaceId);
  const toggleSelectedPlace = usePlaceFinderStore((s) => s.toggleSelectedPlace);

  const isSelected = selectedPlaceId === place.id;
  const numId = parseInt(place.id, 10) || 1;
  const isOpenNow = numId % 4 !== 0;
  const hasCoupon = numId % 3 === 0;

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
  };

  return (
    <div
      className={`group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl border bg-card p-4 gap-4 transition hover:-translate-y-0.5 hover:shadow-card ${
        isSelected ? "border-brand ring-2 ring-brand/20 shadow-glow" : "border-border shadow-soft"
      }`}
    >
      {/* Image */}
      <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl shrink-0 bg-muted">
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {place.trending && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-foreground shadow-soft">
              Trending
            </span>
          )}
        </div>
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {isOpenNow && (
            <span className="inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-0.5 text-[9px] font-semibold text-success shadow-soft backdrop-blur">
              <Clock size={10} /> Open
            </span>
          )}
          {hasCoupon && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[9px] font-bold text-brand shadow-soft">
              <Tag size={10} /> Coupon
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">{place.area || place.location}</span>
                <span className="opacity-50">·</span>
                <span className="truncate capitalize">{place.cuisine || place.category}</span>
              </div>
              <Link href={`/place/${place.slug}`}>
                <h3 className="font-display text-base font-bold text-foreground hover:text-brand transition truncate">
                  {place.name}
                </h3>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleSave}
                aria-label="Save place"
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition cursor-pointer ${
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
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition cursor-pointer ${
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
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {place.description}
            </p>
          )}

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {place.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/80"
              >
                {tag}
              </span>
            ))}
            {place.facilities?.slice(0, 2).map((fac) => (
              <span
                key={fac}
                className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {fac}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 font-bold text-foreground">
              <Star size={13} className="fill-brand text-brand" />
              {place.rating || 4.5}
            </span>
            <span className="text-muted-foreground">({(place.reviews || 100).toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-sm">
              {priceLabel(place.priceLevel)}
            </span>
            {place.priceRange && (
              <span className="text-muted-foreground text-[11px] hidden sm:inline">
                {place.priceRange.replace(/৳+ • /, "")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
