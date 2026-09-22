"use client";

import { X } from "lucide-react";
import { usePlaceFinderStore } from "./usePlaceFinderStore";
import { PLACE_VIBES, BUDGET_MAX } from "./constants";

const BARS = [10, 16, 28, 14, 22, 12, 24, 18, 30, 20, 14, 26, 32];

export function PlaceFinderFilters() {
  const searchCategory = usePlaceFinderStore((s) => s.searchCategory);
  const setSearchCategory = usePlaceFinderStore((s) => s.setSearchCategory);
  const minBudget = usePlaceFinderStore((s) => s.minBudget);
  const maxBudget = usePlaceFinderStore((s) => s.maxBudget);
  const setMinBudget = usePlaceFinderStore((s) => s.setMinBudget);
  const setMaxBudget = usePlaceFinderStore((s) => s.setMaxBudget);
  const minRating = usePlaceFinderStore((s) => s.minRating);
  const setMinRating = usePlaceFinderStore((s) => s.setMinRating);
  const selectedVibes = usePlaceFinderStore((s) => s.selectedVibes);
  const toggleVibe = usePlaceFinderStore((s) => s.toggleVibe);
  const openNow = usePlaceFinderStore((s) => s.openNow);
  const setOpenNow = usePlaceFinderStore((s) => s.setOpenNow);
  const clearFilters = usePlaceFinderStore((s) => s.clearFilters);

  const minPct = (minBudget / BUDGET_MAX) * 100;
  const maxPct = (maxBudget / BUDGET_MAX) * 100;

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

      {/* Categories */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Category
        </label>
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-muted rounded-2xl">
          {[
            { key: "all", label: "All" },
            { key: "restaurant", label: "Eat" },
            { key: "resort", label: "Stay" },
            { key: "gym", label: "Gym" },
          ].map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSearchCategory(c.key as "all" | "restaurant" | "resort" | "gym")}
              className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                searchCategory === c.key
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-muted-foreground">
            Budget per Person / Night
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

      {/* Vibes & Features */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Vibe & Facilities
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PLACE_VIBES.map((vibe) => {
            const active = selectedVibes.includes(vibe.label);
            return (
              <button
                key={vibe.label}
                type="button"
                onClick={() => toggleVibe(vibe.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  active
                    ? "bg-brand text-brand-foreground border-brand shadow-soft"
                    : "bg-card text-foreground border-border hover:border-brand/40"
                }`}
              >
                <span>{vibe.icon}</span>
                <span>{vibe.label}</span>
              </button>
            );
          })}
        </div>
      </div>

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
