"use client";

import { useState, useMemo } from "react";
import { Check, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaxonomy, type TaxonomyKind } from "@/lib/backend/taxonomy/useTaxonomy";
import type { BusinessTypeSlug } from "@/lib/backend/taxonomy";

export function TaxonomyChips({
  label,
  kind,
  businessType,
  selected,
  onSelect,
  initialLimit = 7,
}: {
  label: string;
  kind: Exclude<TaxonomyKind, "businessTypes">;
  businessType?: BusinessTypeSlug;
  selected: string | undefined;
  onSelect: (slug: string | undefined) => void;
  initialLimit?: number;
}) {
  const { data, loading } = useTaxonomy(kind, businessType);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Reorder items so the currently selected item is always visible at the front
  const sortedData = useMemo(() => {
    if (!data.length) return [];
    if (!selected) return data;
    const selectedItem = data.find((item) => item.slug === selected);
    if (!selectedItem) return data;
    const others = data.filter((item) => item.slug !== selected);
    return [selectedItem, ...others];
  }, [data, selected]);

  // Filter items if user is searching
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return sortedData;
    const q = searchQuery.toLowerCase().trim();
    return sortedData.filter((item) => item.name.toLowerCase().includes(q));
  }, [sortedData, searchQuery]);

  const selectedName = useMemo(() => {
    return data.find((item) => item.slug === selected)?.name;
  }, [data, selected]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            {label}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="bg-muted h-7 w-20 animate-pulse rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) return null;

  const showExpandButton = !searchQuery.trim() && data.length > initialLimit;
  const visibleItems =
    isExpanded || searchQuery.trim() ? filteredData : filteredData.slice(0, initialLimit);

  return (
    <div className="space-y-2.5">
      {/* Header with Title & Active Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {selectedName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-brand">
              {selectedName}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(undefined);
                }}
                className="hover:text-destructive cursor-pointer"
                aria-label={`Clear ${label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>

        {/* Count badge */}
        <span className="text-[11px] text-muted-foreground">
          {data.length} options
        </span>
      </div>

      {/* Inline Search for tag-heavy lists (when expanded or searching) */}
      {(isExpanded || data.length > 12) && (
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${label.toLowerCase()}...`}
            className="w-full rounded-xl border border-border bg-background pl-8.5 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 transition focus:border-brand focus:ring-1 focus:ring-brand/20 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Tag Chips List */}
      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar py-0.5">
        {visibleItems.length === 0 ? (
          <p className="text-xs text-muted-foreground py-1">No matching {label.toLowerCase()}.</p>
        ) : (
          visibleItems.map((item) => {
            const active = selected === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => onSelect(active ? undefined : item.slug)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition cursor-pointer",
                  active
                    ? "border-brand bg-brand text-brand-foreground shadow-xs"
                    : "border-border bg-background text-foreground hover:border-foreground/30 hover:bg-muted",
                )}
              >
                {active && <Check className="h-3 w-3" />}
                {item.name}
              </button>
            );
          })
        )}
      </div>

      {/* Show More / Fewer Toggle Button */}
      {showExpandButton && (
        <button
          type="button"
          onClick={() => {
            setIsExpanded((prev) => !prev);
            if (isExpanded) setSearchQuery("");
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline pt-0.5 cursor-pointer"
        >
          {isExpanded ? (
            <>
              Show fewer {label.toLowerCase()} <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              + Show {data.length - initialLimit} more {label.toLowerCase()}{" "}
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
