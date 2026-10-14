"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
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

import { LocationMapComponent } from "./LocationMapComponent";
import { CustomSelect } from "@/components/common/CustomSelect";

function BudgetAmount({
  value,
  min,
  max,
  label,
  onCommit,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  return (
    <input
      aria-label={label}
      type="number"
      min={min}
      max={max}
      step={1}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const parsed = Number(draft);
        const next =
          draft.trim() && Number.isFinite(parsed) ? Math.max(min, Math.min(parsed, max)) : value;
        setDraft(String(next));
        onCommit(next);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          e.preventDefault();
          setDraft(String(value));
        }
      }}
      className="text-foreground w-16 bg-transparent text-right text-xs font-semibold outline-none"
    />
  );
}

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
    <div className="discover-filter-card">
      <label className="text-muted-foreground mb-2 block text-xs font-semibold">
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
              className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
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
  const searchPlace = usePlaceFinderStore((s) => s.searchPlace);
  const setSearchPlace = usePlaceFinderStore((s) => s.setSearchPlace);
  const searchCuisine = usePlaceFinderStore((s) => s.searchCuisine);
  const setSearchCuisine = usePlaceFinderStore((s) => s.setSearchCuisine);
  const { data: cuisines } = useTaxonomy("cuisines");

  const minPct = (minBudget / BUDGET_MAX) * 100;
  const maxPct = (maxBudget / BUDGET_MAX) * 100;

  const typeConfig = businessTypeConfig(businessType);

  return (
    <div className="discover-filters space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-bold">Filters</h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-brand flex cursor-pointer items-center gap-1 text-xs transition"
        >
          <X size={14} /> Clear all
        </button>
      </div>

      {/* Business type -- the same choice as the dropdown in the page header,
          kept here because it is the first thing a manual search decides. */}
      <div className="discover-filter-card">
        <label className="text-muted-foreground mb-2 block text-xs font-semibold">
          Business type
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {BUSINESS_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setBusinessType(type as BusinessType)}
              aria-pressed={businessType === type}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[22px] border py-4 text-xs font-bold transition ${
                businessType === type
                  ? "bg-brand/5 border-brand/40 text-brand"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BusinessTypeIcon type={type} size={23} />
              {businessTypeConfig(type).noun.replace(/^./, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <LocationMapComponent variant="filters" />

      <div className="discover-filter-card space-y-3">
        <label htmlFor="discover-keyword" className="block text-xs font-semibold">
          {typeConfig.searchLabel}
        </label>
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            id="discover-keyword"
            value={searchPlace}
            onChange={(e) => setSearchPlace(e.target.value)}
            placeholder={typeConfig.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-xs outline-none"
          />
          {searchPlace && (
            <button type="button" aria-label="Clear keyword" onClick={() => setSearchPlace("")}>
              <X size={14} />
            </button>
          )}
        </div>
        {typeConfig.hasCuisine && cuisines.length > 0 && (
          <CustomSelect
            value={searchCuisine}
            options={[
              { value: "", label: "All cuisines" },
              ...cuisines.map((c) => ({ value: c.slug, label: c.name })),
            ]}
            onChange={setSearchCuisine}
            className="w-full"
            triggerClassName="h-11"
          />
        )}
      </div>

      {/* Budget */}
      <div className="discover-filter-card">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-xs font-semibold">
            {typeConfig.budgetLabel}
          </label>
          <span className="text-foreground text-xs font-bold">
            ৳{minBudget.toLocaleString()} – ৳{maxBudget.toLocaleString()}
          </span>
        </div>

        <div className="relative mb-3 flex h-4 items-end">
          <div className="bg-muted absolute bottom-0 h-1 w-full rounded-full" />
          <div
            className="bg-brand absolute bottom-0 h-1 rounded-full"
            style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
          />

          <input
            aria-label="Minimum budget"
            type="range"
            min={0}
            max={BUDGET_MAX}
            step={1}
            value={minBudget}
            onChange={(e) => setMinBudget(Math.min(Number(e.target.value), maxBudget - 200))}
            className="slider-range-thumb"
          />
          <input
            aria-label="Maximum budget"
            type="range"
            min={0}
            max={BUDGET_MAX}
            step={1}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Math.max(Number(e.target.value), minBudget + 200))}
            className="slider-range-thumb"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-muted-foreground flex items-center justify-between gap-1 rounded-full border px-3 py-2 text-[10px]">
            Min ৳
            <BudgetAmount
              key={`min-${minBudget}-${maxBudget}`}
              label="Minimum budget amount"
              onCommit={setMinBudget}
              min={0}
              max={maxBudget - 200}
              value={minBudget}
            />
          </label>
          <label className="text-muted-foreground flex items-center justify-between gap-1 rounded-full border px-3 py-2 text-[10px]">
            Max ৳
            <BudgetAmount
              key={`max-${minBudget}-${maxBudget}`}
              label="Maximum budget amount"
              onCommit={setMaxBudget}
              min={minBudget + 200}
              max={BUDGET_MAX}
              value={maxBudget}
            />
          </label>
        </div>
      </div>

      {/* Min Rating */}
      <div className="discover-filter-card">
        <label className="text-muted-foreground mb-2 block text-xs font-semibold">
          Minimum Rating
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { val: 0, label: "Any" },
            { val: 4.0, label: "4★" },
            { val: 4.3, label: "4.3★" },
            { val: 4.5, label: "4.5★" },
            { val: 4.7, label: "4.7★" },
          ].map((r) => (
            <button
              key={r.val}
              type="button"
              aria-pressed={minRating === r.val}
              onClick={() => setMinRating(r.val)}
              className={`cursor-pointer rounded-xl border py-2 text-xs font-bold transition ${
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

      {typeConfig.facetGroups.map((group) => (
        <FacetChips key={group.param} group={group} businessType={businessType} />
      ))}
      {/* Open Now Toggle */}
      <div className="border-border flex items-center justify-between border-t pt-2">
        <span className="text-foreground text-xs font-semibold">Open Now Only</span>
        <button
          type="button"
          role="switch"
          aria-label="Open now only"
          aria-checked={openNow}
          onClick={() => setOpenNow(!openNow)}
          className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
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
