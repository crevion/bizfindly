"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { areas } from "@/content/places";
import {
  PRICE_BOUNDS,
  QUICK_FILTERS,
  SORT_OPTIONS,
  type DiscoverCategory,
  type SortOption,
} from "@/content/discoverFilters";
import type { BudgetTier } from "@/lib/backend/places";
import type { TaxonomyDimension, TaxonomyFilters } from "@/hooks/useDiscoverState";
import { DualRangeSlider } from "./DualRangeSlider";
import { TaxonomyChips } from "./TaxonomyChips";
import { ToggleCard } from "./ToggleCard";
import { ScrollArea } from "@/components/common/ScrollArea";

const BUDGET_TIERS: { value: BudgetTier; label: string }[] = [
  { value: "budget", label: "Budget (Under ৳500)" },
  { value: "mid_range", label: "Mid-range (৳500 – ৳1.5k)" },
  { value: "premium", label: "Premium (৳1.5k – ৳3.5k)" },
  { value: "luxury", label: "Luxury (৳3.5k+)" },
];

const BUSINESS_TYPE_SLUG: Record<DiscoverCategory, string> = {
  restaurant: "restaurant",
  resort: "resort",
  gym: "gym",
};

export function FilterModal(props: {
  cat: DiscoverCategory;
  area: string;
  setArea: (s: string) => void;
  activeQuick: string[];
  setActiveQuick: (s: string[]) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  openNow: boolean;
  setOpenNow: (v: boolean) => void;
  minRating: number;
  setMinRating: (n: number) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  taxFilters: TaxonomyFilters;
  setTaxFilter: (dim: TaxonomyDimension, slug: string | undefined) => void;
  budgetTier: BudgetTier | undefined;
  setBudgetTier: (t: BudgetTier | undefined) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  onClose: () => void;
  onReset: () => void;
  resultCount: number;
}) {
  const bounds = PRICE_BOUNDS[props.cat];
  const [min, max] = props.priceRange;
  const businessType = BUSINESS_TYPE_SLUG[props.cat];

  const [expandAreas, setExpandAreas] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");
  const [expandQuick, setExpandQuick] = useState(false);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props]);

  // Compute active filters count
  const activeCount = useMemo(() => {
    let count = 0;
    if (props.area !== "All") count++;
    if (props.verifiedOnly) count++;
    if (props.openNow) count++;
    if (props.minRating > 0) count++;
    if (min > bounds[0] || max < bounds[1]) count++;
    if (props.budgetTier) count++;
    count += props.activeQuick.length;
    count += Object.keys(props.taxFilters).length;
    return count;
  }, [
    props.area,
    props.verifiedOnly,
    props.openNow,
    props.minRating,
    min,
    max,
    bounds,
    props.budgetTier,
    props.activeQuick,
    props.taxFilters,
  ]);

  const rawAreas = useMemo(() => {
    return ["All", ...areas.filter((a) => a !== "Nearby")];
  }, []);

  const filteredAreas = useMemo(() => {
    if (!areaSearch.trim()) return rawAreas;
    const q = areaSearch.toLowerCase().trim();
    return rawAreas.filter((a) => a.toLowerCase().includes(q));
  }, [rawAreas, areaSearch]);

  const visibleAreas = useMemo(() => {
    if (expandAreas || areaSearch.trim()) return filteredAreas;
    // Pin active area to top if not in top 7
    if (props.area !== "All" && !filteredAreas.slice(0, 7).includes(props.area)) {
      return ["All", props.area, ...filteredAreas.filter((a) => a !== "All" && a !== props.area).slice(0, 5)];
    }
    return filteredAreas.slice(0, 7);
  }, [expandAreas, areaSearch, filteredAreas, props.area]);

  const quickFilterList = QUICK_FILTERS[props.cat];
  const visibleQuick = useMemo(() => {
    if (expandQuick) return quickFilterList;
    return quickFilterList.slice(0, 6);
  }, [expandQuick, quickFilterList]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={props.onClose}
      />

      {/* Modal Card */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 flex flex-col w-full max-w-2xl h-[88vh] md:h-[82vh] max-h-[88vh] md:max-h-[82vh] rounded-t-3xl md:rounded-3xl border border-border bg-card shadow-2xl overflow-hidden min-h-0">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-5 py-4 z-10">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 text-brand" />
            <h2 className="font-display text-lg font-bold text-foreground">Filter & Sort</h2>
            {activeCount > 0 && (
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand">
                {activeCount} active
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={props.onClose}
            aria-label="Close filters"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-muted/80 hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body using Radix ScrollArea */}
        <ScrollArea className="flex-1 min-h-0 w-full overflow-hidden">
          <div className="space-y-6 px-5 py-5 touch-pan-y overscroll-contain">
            {/* Sort Options */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Sort Results
              </p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => props.setSort(s)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
                      props.sort === s
                        ? "border-foreground bg-foreground text-background shadow-soft"
                        : "border-border bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Location / Area with Compact Expand & Search */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Location & Area
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {rawAreas.length - 1} areas
                </span>
              </div>

              {/* Area search input when expanded */}
              {expandAreas && (
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={areaSearch}
                    onChange={(e) => setAreaSearch(e.target.value)}
                    placeholder="Search area (e.g. Dhanmondi, Gulshan)..."
                    className="w-full rounded-xl border border-border bg-background pl-8.5 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 transition focus:border-brand focus:ring-1 focus:ring-brand/20 focus:outline-none"
                  />
                  {areaSearch && (
                    <button
                      type="button"
                      onClick={() => setAreaSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {visibleAreas.map((a) => {
                  const isActive = props.area === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => props.setArea(a)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition cursor-pointer",
                        isActive
                          ? "border-brand bg-brand text-brand-foreground shadow-soft"
                          : "border-border bg-background text-foreground hover:border-foreground/30 hover:bg-muted",
                      )}
                    >
                      <MapPin className="h-3 w-3" />
                      {a}
                    </button>
                  );
                })}
              </div>

              {!areaSearch && rawAreas.length > 7 && (
                <button
                  type="button"
                  onClick={() => setExpandAreas((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline cursor-pointer"
                >
                  {expandAreas ? (
                    <>
                      Show fewer areas <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      + Show {rawAreas.length - 7} more areas <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Price Range Slider */}
            <div className="rounded-2xl border border-border bg-background p-4 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Price Range
                  </p>
                  <span className="text-[11px] text-muted-foreground">{bounds[2]}</span>
                </div>
                <div className="font-mono text-xs font-bold text-foreground">
                  ৳{min.toLocaleString()} – ৳{max.toLocaleString()}
                </div>
              </div>
              <DualRangeSlider
                min={bounds[0]}
                max={bounds[1]}
                value={[min, max]}
                onChange={(v) => props.setPriceRange(v)}
              />
            </div>

            {/* Minimum Rating */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Minimum Rating
              </p>
              <div className="flex flex-wrap gap-2">
                {[0, 4, 4.3, 4.5, 4.7].map((r) => {
                  const isActive = props.minRating === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => props.setMinRating(r)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
                        isActive
                          ? "border-foreground bg-foreground text-background shadow-soft"
                          : "border-border bg-background text-foreground hover:bg-muted",
                      )}
                    >
                      {r === 0 ? (
                        "Any Rating"
                      ) : (
                        <>
                          <Star className="h-3 w-3 fill-brand text-brand" />
                          <span>{r}+</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Toggles */}
            <div className="grid grid-cols-2 gap-3">
              <ToggleCard
                label="Verified only"
                icon={<BadgeCheck className="h-4 w-4 text-info" />}
                on={props.verifiedOnly}
                onChange={() => props.setVerifiedOnly(!props.verifiedOnly)}
              />
              <ToggleCard
                label="Open now"
                icon={<Clock className="h-4 w-4 text-emerald-500" />}
                on={props.openNow}
                onChange={() => props.setOpenNow(!props.openNow)}
              />
            </div>

            {/* Restaurant Taxonomies (Cuisine, Vibe, Occasion, Group Type) */}
            {props.cat === "restaurant" && (
              <div className="space-y-4 pt-1 border-t border-border">
                <TaxonomyChips
                  label="Cuisine"
                  kind="cuisines"
                  initialLimit={6}
                  selected={props.taxFilters.cuisine}
                  onSelect={(slug) => props.setTaxFilter("cuisine", slug)}
                />
                <TaxonomyChips
                  label="Vibe & Ambiance"
                  kind="vibes"
                  initialLimit={6}
                  selected={props.taxFilters.vibe}
                  onSelect={(slug) => props.setTaxFilter("vibe", slug)}
                />
                <TaxonomyChips
                  label="Occasion"
                  kind="occasions"
                  initialLimit={6}
                  selected={props.taxFilters.occasion}
                  onSelect={(slug) => props.setTaxFilter("occasion", slug)}
                />
                <TaxonomyChips
                  label="Group Type"
                  kind="groupTypes"
                  initialLimit={6}
                  selected={props.taxFilters.groupType}
                  onSelect={(slug) => props.setTaxFilter("groupType", slug)}
                />

                {/* Budget Tiers */}
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Budget Tier
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_TIERS.map((t) => {
                      const active = props.budgetTier === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => props.setBudgetTier(active ? undefined : t.value)}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
                            active
                              ? "border-brand bg-brand text-brand-foreground shadow-soft"
                              : "border-border bg-background text-foreground hover:bg-muted",
                          )}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Resort Taxonomies */}
            {props.cat === "resort" && (
              <div className="space-y-4 pt-1 border-t border-border">
                <TaxonomyChips
                  label="Tags & Styles"
                  kind="tags"
                  initialLimit={6}
                  businessType={businessType}
                  selected={props.taxFilters.tag}
                  onSelect={(slug) => props.setTaxFilter("tag", slug)}
                />
                <TaxonomyChips
                  label="Facilities & Amenities"
                  kind="facilities"
                  initialLimit={6}
                  businessType={businessType}
                  selected={props.taxFilters.facility}
                  onSelect={(slug) => props.setTaxFilter("facility", slug)}
                />
              </div>
            )}

            {/* Quick Filters with Collapse */}
            <div className="space-y-2 pt-1 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Popular Mood Tags
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {quickFilterList.length} tags
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {visibleQuick.map((f) => {
                  const active = props.activeQuick.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() =>
                        props.setActiveQuick(
                          active
                            ? props.activeQuick.filter((x) => x !== f)
                            : [...props.activeQuick, f],
                        )
                      }
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition cursor-pointer",
                        active
                          ? "border-brand bg-brand text-brand-foreground shadow-soft"
                          : "border-border bg-background text-foreground hover:bg-muted",
                      )}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>

              {quickFilterList.length > 6 && (
                <button
                  type="button"
                  onClick={() => setExpandQuick((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline cursor-pointer"
                >
                  {expandQuick ? (
                    <>
                      Show fewer tags <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      + Show {quickFilterList.length - 6} more tags{" "}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-card px-5 py-4 z-10">
          <button
            type="button"
            onClick={props.onReset}
            disabled={activeCount === 0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset all</span>
          </button>
          <button
            type="button"
            onClick={props.onClose}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-foreground py-3 text-xs font-bold text-background shadow-soft transition hover:bg-foreground/90 active:scale-[0.99] cursor-pointer"
          >
            Show {props.resultCount} {props.resultCount === 1 ? "Place" : "Places"}
          </button>
        </div>
      </div>
    </div>
  );
}
