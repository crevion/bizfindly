"use client";

import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import type { ClaimRecord } from "@/types/verification";

export function ClaimList({
  claims,
  activeId,
  onPick,
}: {
  claims: ClaimRecord[];
  activeId: string | null | undefined;
  onPick: (id: string) => void;
}) {
  return (
    <div className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2">
      {claims.map((c) => (
        <button
          key={c.id}
          onClick={() => onPick(c.id)}
          className={cn(
            "bg-card hover:border-foreground/30 block w-full rounded-2xl border p-4 text-left transition",
            c.id === activeId ? "border-sky-500 ring-2 ring-sky-500/20" : "border-border",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{c.placeName}</div>
              <div className="text-muted-foreground truncate text-xs">
                {c.ownerName} · {c.ownerRole}
              </div>
            </div>
            <VerifiedBadge status={c.status} size="sm" />
          </div>
          <div className="text-muted-foreground mt-2 text-[11px]">
            Submitted {new Date(c.submittedAt).toLocaleDateString()}
          </div>
        </button>
      ))}
      {claims.length === 0 && (
        <div className="border-border text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm">
          Nothing in this filter.
        </div>
      )}
    </div>
  );
}
