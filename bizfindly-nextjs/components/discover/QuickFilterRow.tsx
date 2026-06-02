"use client";

import { cn } from "@/lib/utils";
import { QUICK_FILTERS, type DiscoverCategory } from "@/content/discoverFilters";

export function QuickFilterRow({
  cat,
  activeQuick,
  toggleQuick,
}: {
  cat: DiscoverCategory;
  activeQuick: string[];
  toggleQuick: (f: string) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {QUICK_FILTERS[cat].map((f) => {
        const active = activeQuick.includes(f);
        return (
          <button
            key={f}
            onClick={() => toggleQuick(f)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
              active
                ? "border-brand bg-brand text-brand-foreground shadow-soft"
                : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground",
            )}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
