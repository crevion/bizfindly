"use client";

import { Heart, Loader2 } from "lucide-react";
import { useSavedPlace } from "@/lib/backend/saved/useSavedPlace";
import type { Place } from "@/types/place";
import { cn } from "@/lib/utils";

export function SavePlaceButton({ place, className, showLabel = false }: { place: Pick<Place, "category" | "slug">; className?: string; showLabel?: boolean }) {
  const { saved, pending, toggle } = useSavedPlace(place.category, place.slug);
  return (
    <button type="button" aria-label={saved ? "Remove from saved places" : "Save place"} aria-pressed={saved} disabled={pending} onClick={(event) => { event.preventDefault(); event.stopPropagation(); void toggle(); }} className={cn("inline-flex items-center justify-center gap-2 transition disabled:cursor-wait disabled:opacity-60", className)}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-4 w-4", saved && "fill-brand text-brand")} />}
      {showLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}
