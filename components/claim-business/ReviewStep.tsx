"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Place } from "@/types/place";
import type { DocValue } from "./DocUpload";
import { PrivacyNote, StepHeader, SummaryCard } from "./primitives";
import type { ClaimDetails } from "@/types/verification";

export function ReviewStep({
  selected,
  details,
  document,
}: {
  selected: Place | null;
  details: ClaimDetails;
  document: DocValue;
}) {
  const checks = [
    { ok: !!selected, label: "Business identified" },
    { ok: !!(details.fullName && details.phone), label: "Owner details provided" },
    { ok: !!document, label: "Proof of ownership uploaded" },
  ];

  return (
    <div>
      <StepHeader
        eyebrow="Step 4 · Review"
        title="Almost there. Review & submit."
        sub="Make sure everything below is accurate. You'll get an update within 24–48 hours."
      />
      <div className="mt-6 grid gap-4">
        <SummaryCard title="Business">
          {selected && (
            <div className="flex items-center gap-3">
              <div className="bg-muted h-12 w-12 overflow-hidden rounded-xl">
                {selected.image && (
                  <img src={selected.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <div className="font-semibold">{selected.name}</div>
                <div className="text-muted-foreground text-xs">{selected.location}</div>
              </div>
            </div>
          )}
        </SummaryCard>

        <SummaryCard title="Owner details">
          <div className="grid gap-1 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              {details.fullName}
            </div>
            <div>
              <span className="text-muted-foreground">Phone: </span>
              {details.phone}
            </div>
            {details.message && (
              <div>
                <span className="text-muted-foreground">Message: </span>
                {details.message}
              </div>
            )}
          </div>
        </SummaryCard>

        <SummaryCard title="Documents">
          {document ? (
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">Proof of ownership</span>
              <span className="text-muted-foreground">— {document.name}</span>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No document uploaded yet.</div>
          )}
        </SummaryCard>

        <SummaryCard title="Verification checklist">
          <div className="grid gap-2">
            {checks.map((c, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 text-sm",
                  c.ok ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full",
                    c.ok ? "bg-emerald-100 text-emerald-700" : "bg-muted",
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>
                {c.label}
              </div>
            ))}
          </div>
        </SummaryCard>
      </div>
      <PrivacyNote />
    </div>
  );
}
