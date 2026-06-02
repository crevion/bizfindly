"use client";

import { BadgeCheck, Clock, MapPin, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { areas } from "@/content/places";
import {
  PRICE_BOUNDS,
  QUICK_FILTERS,
  SORT_OPTIONS,
  type DiscoverCategory,
  type SortOption,
} from "@/content/discoverFilters";
import { DualRangeSlider } from "./DualRangeSlider";
import { ToggleCard } from "./ToggleCard";

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
  sort: SortOption;
  setSort: (s: SortOption) => void;
  onClose: () => void;
  onReset: () => void;
  resultCount: number;
}) {
  const bounds = PRICE_BOUNDS[props.cat];
  const [min, max] = props.priceRange;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="animate-in fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={props.onClose}
      />
      <div className="animate-in fade-in bg-background shadow-card relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl md:rounded-3xl">
        <div className="border-border bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
          <div className="bg-muted mx-auto mt-2 h-1 w-10 rounded-full md:hidden" />
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-display text-lg font-bold">Filters</h3>
            <button onClick={props.onClose} className="hover:bg-muted rounded-full p-1.5">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
              Sort by
            </p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => props.setSort(s)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                    props.sort === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
              Location
            </p>
            <div className="flex flex-wrap gap-2">
              {["All", ...areas.filter((a) => a !== "Nearby")].map((a) => (
                <button
                  key={a}
                  onClick={() => props.setArea(a)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    props.area === a
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <MapPin className="h-3 w-3" />
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Price · {bounds[2]}
              </p>
              <p className="text-foreground text-xs font-bold">
                ৳{min.toLocaleString()} – ৳{max.toLocaleString()}
              </p>
            </div>
            <DualRangeSlider
              min={bounds[0]}
              max={bounds[1]}
              value={[min, max]}
              onChange={(v) => props.setPriceRange(v)}
            />
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
              Minimum rating
            </p>
            <div className="flex flex-wrap gap-2">
              {[0, 4, 4.3, 4.5, 4.7].map((r) => (
                <button
                  key={r}
                  onClick={() => props.setMinRating(r)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    props.minRating === r
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {r === 0 ? (
                    "Any"
                  ) : (
                    <>
                      <Star className="fill-brand text-brand h-3 w-3" /> {r}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ToggleCard
              label="Verified only"
              icon={<BadgeCheck className="h-4 w-4" />}
              on={props.verifiedOnly}
              onChange={() => props.setVerifiedOnly(!props.verifiedOnly)}
            />
            <ToggleCard
              label="Open now"
              icon={<Clock className="h-4 w-4" />}
              on={props.openNow}
              onChange={() => props.setOpenNow(!props.openNow)}
            />
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
              Quick filters
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_FILTERS[props.cat].map((f) => {
                const active = props.activeQuick.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() =>
                      props.setActiveQuick(
                        active
                          ? props.activeQuick.filter((x) => x !== f)
                          : [...props.activeQuick, f],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                      active
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-border bg-background/95 sticky bottom-0 flex items-center justify-between gap-3 border-t px-5 py-4 backdrop-blur">
          <button
            onClick={props.onReset}
            className="text-muted-foreground hover:text-foreground text-sm font-semibold"
          >
            Reset all
          </button>
          <button
            onClick={props.onClose}
            className="bg-foreground text-background flex-1 rounded-full py-3 text-sm font-bold transition hover:opacity-90"
          >
            Show {props.resultCount} {props.resultCount === 1 ? "place" : "places"}
          </button>
        </div>
      </div>
    </div>
  );
}
