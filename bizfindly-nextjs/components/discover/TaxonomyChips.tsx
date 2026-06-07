"use client";

import { cn } from "@/lib/utils";
import { useTaxonomy, type TaxonomyKind } from "@/lib/backend/taxonomy/useTaxonomy";
import type { BusinessTypeSlug } from "@/lib/backend/taxonomy";

export function TaxonomyChips({
  label,
  kind,
  businessType,
  selected,
  onSelect,
}: {
  label: string;
  kind: Exclude<TaxonomyKind, "businessTypes">;
  businessType?: BusinessTypeSlug;
  selected: string | undefined;
  onSelect: (slug: string | undefined) => void;
}) {
  const { data, loading } = useTaxonomy(kind, businessType);

  if (loading) {
    return (
      <div>
        <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
          {label}
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="bg-muted h-7 w-20 animate-pulse rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) return null;

  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {data.map((item) => {
          const active = selected === item.slug;
          return (
            <button
              key={item.slug}
              onClick={() => onSelect(active ? undefined : item.slug)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                active
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
