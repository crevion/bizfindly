"use client";

import { cn } from "@/lib/utils";
import type { ListingDraft } from "@/types/listing";

export function ListingSwitcher({
  listings,
  activeId,
  onPick,
}: {
  listings: ListingDraft[];
  activeId: string | null | undefined;
  onPick: (id: string) => void;
}) {
  if (listings.length <= 1) return null;
  return (
    <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
      {listings.map((l) => (
        <button
          key={l.id}
          onClick={() => l.id && onPick(l.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold",
            l.id === activeId
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-surface text-foreground",
          )}
        >
          {l.name || "Untitled"}
        </button>
      ))}
    </div>
  );
}
