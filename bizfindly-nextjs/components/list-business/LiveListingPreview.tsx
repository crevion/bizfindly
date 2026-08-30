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
}

export function LiveListingPreview({
  draft,
  cfg,
  onJumpToSection,
}: LiveListingPreviewProps) {
  // Extract all uploaded images across groups
  const allUploadedImages = useMemo(() => {
    return Object.values(draft.images || {}).flat().filter(Boolean);
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

  // Completeness score
  const completeness = useMemo(() => {
    let score = 0;
    if (draft.category) score += 20;
    if (draft.name.trim().length > 1) score += 20;
    if (draft.location.trim().length > 1 || draft.area.trim().length > 1) score += 15;
    if (draft.hours.trim().length > 0 && draft.priceMin.trim().length > 0) score += 15;
    if (allUploadedImages.length > 0) score += 15;
    if (draft.description.trim().length > 10 || draft.tags.length > 0) score += 15;
    return Math.min(100, score);
  }, [draft, allUploadedImages]);

  return (
    <div className="space-y-6">
      {/* Quality / Completeness Gauge */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Listing Strength
            </span>
          </div>
          <span className="font-mono text-sm font-bold text-brand">{completeness}%</span>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-brand to-rose-400 transition-all duration-500 rounded-full"
            style={{ width: `${completeness}%` }}
          />
        </div>

        <p className="mt-2.5 text-xs text-muted-foreground">
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
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition cursor-pointer",
              draft.name ? "text-success bg-success/10" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Name & Category</span>
          </div>
          <div
            onClick={() => onJumpToSection?.(1)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition cursor-pointer",
              draft.hours && draft.priceMin ? "text-success bg-success/10" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Hours & Pricing</span>
          </div>
          <div
            onClick={() => onJumpToSection?.(2)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition cursor-pointer",
              allUploadedImages.length > 0 ? "text-success bg-success/10" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Photos ({allUploadedImages.length})</span>
          </div>
          <div
            onClick={() => onJumpToSection?.(3)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition cursor-pointer",
              draft.description ? "text-success bg-success/10" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Amenities & Story</span>
          </div>
        </div>
      </div>

      {/* Live Place Card Preview */}
      <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Customer Card View
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-brand">
            Live Preview
          </span>
        </div>

        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-card">
          {/* Card Media */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={coverImage}
              alt={draft.name || "Preview"}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Category & Status Pill */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-foreground shadow-sm">
                {cfg?.label || "Listing"}
              </span>
              <span className="rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] font-semibold text-background backdrop-blur">
                New
              </span>
            </div>

            <button
              type="button"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur"
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
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-brand" />
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
              <h3 className="font-display text-base font-bold leading-tight text-foreground line-clamp-1">
                {draft.name || "Your Business Name"}
              </h3>
              <BadgeCheck className="h-4 w-4 shrink-0 text-info" />
            </div>

            <p className="line-clamp-2 text-xs text-muted-foreground">
              {draft.description ||
                "Your business description and story will appear here for patrons exploring local places."}
            </p>

            {/* Amenities / Tags Chips */}
            {(selectedFacilities.length > 0 || draft.tags.length > 0) && (
              <div className="mt-1 flex flex-wrap gap-1 pt-1 border-t border-border/60">
                {selectedFacilities.slice(0, 3).map((f) => (
                  <span
                    key={f.key}
                    className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    {f.label}
                  </span>
                ))}
                {draft.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand"
                  >
                    #{t}
                  </span>
                ))}
                {selectedFacilities.length + draft.tags.length > 5 && (
                  <span className="text-[10px] text-muted-foreground self-center">
                    +{selectedFacilities.length + draft.tags.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Price & Rating Footer */}
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-border text-[12px]">
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Star className="h-3.5 w-3.5 fill-brand text-brand" />
                <span>5.0</span>
                <span className="text-muted-foreground font-normal">(New)</span>
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
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
