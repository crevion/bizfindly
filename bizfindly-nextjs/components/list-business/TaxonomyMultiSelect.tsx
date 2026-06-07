"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaxonomy, type TaxonomyKind } from "@/lib/backend/taxonomy/useTaxonomy";
import type { BusinessTypeSlug } from "@/lib/backend/taxonomy";

export function TaxonomyMultiSelect({
  label,
  kind,
  businessType,
  selected,
  onChange,
}: {
  label: string;
  kind: Exclude<TaxonomyKind, "businessTypes">;
  businessType?: BusinessTypeSlug;
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const { data, loading, error } = useTaxonomy(kind, businessType);

  const current = selected ?? [];
  const toggle = (id: number) =>
    onChange(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);

  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
        {label}
      </p>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="bg-muted h-9 w-24 animate-pulse rounded-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-muted-foreground text-sm">Couldn’t load {label.toLowerCase()}.</p>
      ) : data.length === 0 ? (
        <p className="text-muted-foreground text-sm">No options available yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.map((item) => {
            const id = item.id;
            if (id === undefined) return null;
            const active = current.includes(id);
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => toggle(id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-surface text-foreground hover:border-foreground/40",
                )}
              >
                {active && <Check className="h-3.5 w-3.5" />}
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
