"use client";

import { cn } from "@/lib/utils";
import { VERIFICATION_FILTERS } from "@/content/verificationFilters";
import type { ClaimRecord, VerificationFilter } from "@/types/verification";

export function FilterTabs({
  claims,
  filter,
  setFilter,
}: {
  claims: ClaimRecord[];
  filter: VerificationFilter;
  setFilter: (f: VerificationFilter) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {VERIFICATION_FILTERS.map((f) => {
        const count =
          f.id === "all" ? claims.length : claims.filter((c) => c.status === f.id).length;
        const active = filter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface",
            )}
          >
            {f.label}
            <span className="ml-1.5 opacity-60">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
