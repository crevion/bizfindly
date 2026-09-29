"use client";

import { X } from "lucide-react";
import { usePlaceFinderStore } from "./usePlaceFinderStore";
import { BUDGET_MAX } from "./constants";
import {
  BUSINESS_TYPES,
  businessTypeConfig,
  type BusinessType,
  type FacetGroup,
} from "./businessTypes";
import { BusinessTypeIcon } from "./BusinessTypeSelect";
import { useTaxonomy } from "@/lib/backend/taxonomy";

const BARS = [10, 16, 28, 14, 22, 12, 24, 18, 30, 20, 14, 26, 32];

/**
 * One group of filter chips, from the taxonomy the listings are tagged with.
 *
 * Renders nothing when that taxonomy is empty: a chip that cannot match any
 * listing is worse than no chip, which is what the old hardcoded labels were.
 */
function FacetChips({ group, businessType }: { group: FacetGroup; businessType: BusinessType }) {
  const { data, loading } = useTaxonomy(
    group.kind,
    group.kind === "tags" || group.kind === "facilities" ? businessType : undefined,
  );
  const selected = usePlaceFinderStore((s) => s.facets[group.param]) ?? [];
  const toggleFacet = usePlaceFinderStore((s) => s.toggleFacet);

  if (loading || !data.length) return null;

  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-2 block">
        {group.label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {data.map((item) => {
          const active = selected.includes(item.slug);
          return (
            <button
              key={item.slug}
              type="button"
              aria-pressed={active}
              onClick={() => toggleFacet(group.param, item.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                active
                  ? "bg-brand text-brand-foreground border-brand shadow-soft"
                  : "bg-card text-foreground border-border hover:border-brand/40"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PlaceFinderFilters() {
  const businessType = usePlaceFinderStore((s) => s.businessType);
  const setBusinessType = usePlaceFinderStore((s) => s.setBusinessType);
  const minBudget = usePlaceFinderStore((s) => s.minBudget);
  const maxBudget = usePlaceFinderStore((s) => s.maxBudget);
  const setMinBudget = usePlaceFinderStore((s) => s.setMinBudget);
  const setMaxBudget = usePlaceFinderStore((s) => s.setMaxBudget);
  const minRating = usePlaceFinderStore((s) => s.minRating);
  const setMinRating = usePlaceFinderStore((s) => s.setMinRating);
  const openNow = usePlaceFinderStore((s) => s.openNow);
  const setOpenNow = usePlaceFinderStore((s) => s.setOpenNow);
  const clearFilters = usePlaceFinderStore((s) => s.clearFilters);

  const minPct = (minBudget / BUDGET_MAX) * 100;
  const maxPct = (maxBudget / BUDGET_MAX) * 100;

  const typeConfig = businessTypeConfig(businessType);

  return (
    <div className="bg-white rounded-3xl border border-border p-5 shadow-soft space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">Filters</h3>
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand transition cursor-pointer"
        >
          <X size={14} /> Clear all
        </button>
      </div>

      {/* Business type -- the same choice as the dropdown in the page header,
          kept here because it is the first thing a manual search decides. */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Business type
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted rounded-2xl">
          {BUSINESS_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setBusinessType(type as BusinessType)}
              aria-pressed={businessType === type}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                businessType === type
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BusinessTypeIcon type={type} size={13} />
              {businessTypeConfig(type).shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-muted-foreground">
            {typeConfig.budgetLabel}
          </label>
          <span className="text-xs font-bold text-foreground">
            ৳{minBudget.toLocaleString()} – ৳{maxBudget.toLocaleString()}
          </span>
        </div>

        <div className="relative h-12 flex items-end mb-3">
          <div className="absolute inset-0 flex items-end gap-1 px-1">
            {BARS.map((h, i) => {
              const x = (i / BARS.length) * 100;
              const active = x >= minPct && x <= maxPct;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm transition-colors ${
                    active ? "bg-brand" : "bg-muted"
                  }`}
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>

          <div className="absolute bottom-0 w-full h-1 bg-muted rounded-full" />
          <div
            className="absolute bottom-0 h-1 bg-brand rounded-full"
            style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
          />

          <input
            type="range"
            min={0}
            max={BUDGET_MAX}
            step={200}
            value={minBudget}
            onChange={(e) => setMinBudget(Math.min(Number(e.target.value), maxBudget - 200))}
            className="slider-range-thumb"
          />
          <input
            type="range"
            min={0}
            max={BUDGET_MAX}
            step={200}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Math.max(Number(e.target.value), minBudget + 200))}
            className="slider-range-thumb"
          />
        </div>
      </div>

      {/* The chip groups this business type is tagged by. */}
      {typeConfig.facetGroups.map((group) => (
        <FacetChips key={group.param} group={group} businessType={businessType} />
      ))}

      {/* Min Rating */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { val: 0, label: "Any" },
            { val: 4.0, label: "4.0+" },
            { val: 4.5, label: "4.5+" },
            { val: 4.8, label: "4.8+" },
          ].map((r) => (
            <button
              key={r.val}
              type="button"
              onClick={() => setMinRating(r.val)}
              className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                minRating === r.val
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Open Now Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs font-semibold text-foreground">Open Now Only</span>
        <button
          type="button"
          onClick={() => setOpenNow(!openNow)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            openNow ? "bg-brand" : "bg-muted"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              openNow ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
