"use client";

import { useMemo } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  Sparkles,
  Star,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import type { CategoryConfig, ListingDraft } from "@/types/listing";
import { cn } from "@/lib/utils";

interface LiveListingPreviewProps {
  draft: ListingDraft;
  cfg: CategoryConfig | null;
  onJumpToSection?: (sectionId: number) => void;
  sectionComplete: boolean[];
}

export function LiveListingPreview({
  draft,
  cfg,
  onJumpToSection,
  sectionComplete,
}: LiveListingPreviewProps) {
  // Extract all uploaded images across groups
  const allUploadedImages = useMemo(() => {
    return Object.values(draft.images || {})
      .flat()
      .filter(Boolean);
  }, [draft.images]);

  const coverImage =
    allUploadedImages[0] ||
    cfg?.image ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  // Calculate Price Level Indicator
  const priceLevel = useMemo(() => {
    const min = parseInt(draft.priceMin, 10) || 0;
    if (min <= 0) return "৳";
    if (min < 1000) return "৳";
    if (min < 3000) return "৳৳";
    return "৳৳৳";
  }, [draft.priceMin]);

  // Selected facilities labels
  const selectedFacilities = useMemo(() => {
    if (!cfg) return [];
    return cfg.facilities.filter((f) => draft.facilities?.[f.key]);
  }, [cfg, draft.facilities]);

  // Only validated sections count as complete.
  const completeness = sectionComplete.filter(Boolean).length * 25;

  return (
    <div className="space-y-6">
      {/* Quality / Completeness Gauge */}
      <div className="border-border bg-card shadow-soft rounded-3xl border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand h-4 w-4" />
            <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Listing Strength
            </span>
          </div>
          <span className="text-brand font-mono text-sm font-bold">{completeness}%</span>
        </div>

        <div className="bg-muted mt-3 h-2 w-full overflow-hidden rounded-full">
          <div
            className="from-brand h-full rounded-full bg-gradient-to-r to-rose-400 transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>

        <p className="text-muted-foreground mt-2.5 text-xs">
          {completeness >= 85
            ? "🌟 Outstanding! Your listing is comprehensive and ready for customers."
            : completeness >= 50
              ? "⚡ Good progress. Add photos and amenities to boost your visibility."
              : "📝 Fill out your business basics and operating info to get started."}
        </p>

        {/* Quick checklist */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
          <div
            onClick={() => onJumpToSection?.(0)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition",
              sectionComplete[0]
                ? "text-success bg-success/10"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Name & Category</span>
          </div>
          <div
            onClick={() => onJumpToSection?.(1)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition",
              sectionComplete[1]
                ? "text-success bg-success/10"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Hours & Pricing</span>
          </div>
          <div
            onClick={() => onJumpToSection?.(2)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition",
              sectionComplete[2]
                ? "text-success bg-success/10"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Photos ({allUploadedImages.length})</span>
          </div>
          <div
            onClick={() => onJumpToSection?.(3)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition",
              sectionComplete[3]
                ? "text-success bg-success/10"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Amenities & Story</span>
          </div>
        </div>
      </div>

      {/* Live Place Card Preview */}
      <div className="border-border bg-card shadow-card rounded-3xl border p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Customer Card View
          </span>
          <span className="bg-brand-soft text-brand inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold">
            Live Preview
          </span>
        </div>

        <div className="group border-border bg-card shadow-soft hover:shadow-card relative flex flex-col overflow-hidden rounded-2xl border transition">
          {/* Card Media */}
          <div className="bg-muted relative aspect-[4/3] overflow-hidden">
            <img
              src={coverImage}
              alt={draft.name || "Preview"}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Category & Status Pill */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="bg-brand text-brand-foreground rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-sm">
                {cfg?.label || "Listing"}
              </span>
              <span className="bg-foreground/90 text-background rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
                New
              </span>
            </div>

            <button
              type="button"
              className="bg-background/90 text-foreground shadow-soft absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur"
              aria-label="Favorite preview"
            >
              <Heart className="h-4 w-4" />
            </button>

            {/* Bottom Floating Card Badges */}
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-1.5 text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
                <Clock className="h-3 w-3 text-emerald-400" />
                {draft.hours || "Hours not set"}
              </span>
              <span className="font-mono text-xs font-bold">{priceLevel}</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
              <MapPin className="text-brand h-3.5 w-3.5" />
              <span className="truncate">
                {draft.area || draft.location || "City / Neighborhood"}
              </span>
              {draft.cuisine && (
                <>
                  <span className="opacity-40">·</span>
                  <span className="truncate capitalize">{draft.cuisine}</span>
                </>
              )}
            </div>

            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-foreground line-clamp-1 text-base leading-tight font-bold">
                {draft.name || "Your Business Name"}
              </h3>
              <BadgeCheck className="text-info h-4 w-4 shrink-0" />
            </div>

            <p className="text-muted-foreground line-clamp-2 text-xs">
              {draft.description ||
                "Your business description and story will appear here for patrons exploring local places."}
            </p>

            {/* Amenities / Tags Chips */}
            {(selectedFacilities.length > 0 || draft.tags.length > 0) && (
              <div className="border-border/60 mt-1 flex flex-wrap gap-1 border-t pt-1">
                {selectedFacilities.slice(0, 3).map((f) => (
                  <span
                    key={f.key}
                    className="bg-muted text-foreground rounded-md px-2 py-0.5 text-[10px] font-medium"
                  >
                    {f.label}
                  </span>
                ))}
                {draft.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="bg-brand-soft text-brand rounded-md px-2 py-0.5 text-[10px] font-semibold"
                  >
                    #{t}
                  </span>
                ))}
                {selectedFacilities.length + draft.tags.length > 5 && (
                  <span className="text-muted-foreground self-center text-[10px]">
                    +{selectedFacilities.length + draft.tags.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Price & Rating Footer */}
            <div className="border-border mt-2 flex items-center justify-between border-t pt-2 text-[12px]">
              <span className="text-foreground inline-flex items-center gap-1 font-semibold">
                <Star className="fill-brand text-brand h-3.5 w-3.5" />
                <span>5.0</span>
                <span className="text-muted-foreground font-normal">(New)</span>
              </span>
              <span className="text-muted-foreground text-xs font-semibold">
                {draft.priceMin && draft.priceMax
                  ? `৳${draft.priceMin} – ৳${draft.priceMax}`
                  : draft.priceMin
                    ? `From ৳${draft.priceMin}`
                    : "Pricing on request"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
