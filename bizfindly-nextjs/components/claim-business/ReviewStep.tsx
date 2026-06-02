"use client";

import { Check } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { DOC_TYPES } from "@/content/verificationConfig";
import type { SearchableBusiness } from "@/types/verification";
import { PrivacyNote, StepHeader, SummaryCard } from "./primitives";
import type { ClaimDetails, ClaimDocsState, ClaimSocialState } from "@/types/verification";

export function ReviewStep({
  selected,
  creatingNew,
  details,
  docs,
  social,
}: {
  selected: SearchableBusiness | null;
  creatingNew: boolean;
  details: ClaimDetails;
  docs: ClaimDocsState;
  social: ClaimSocialState;
}) {
  const uploaded = useMemo(() => Object.entries(docs).filter(([, v]) => !!v), [docs]);

  const checks = [
    { ok: !!selected || creatingNew, label: "Business identified" },
    { ok: !!(details.name && details.email && details.phone), label: "Owner details provided" },
    { ok: uploaded.length > 0, label: `${uploaded.length} document(s) uploaded` },
    {
      ok: !!(social.facebook || social.instagram || social.website),
      label: "Social proof linked (optional)",
    },
  ];

  return (
    <div>
      <StepHeader
        eyebrow="Step 5 · Review"
        title="Almost there. Review & submit."
        sub="Make sure everything below is accurate. You'll get an update within 24–48 hours."
      />
      <div className="mt-6 grid gap-4">
        <SummaryCard title="Business">
          {selected ? (
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
          ) : (
            <div className="text-sm">New listing — will be created with your details.</div>
          )}
        </SummaryCard>

        <SummaryCard title="Owner details">
          <div className="grid gap-1 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              {details.name} · {details.role}
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              {details.email}
            </div>
            <div>
              <span className="text-muted-foreground">Phone: </span>
              {details.phone}
            </div>
            <div>
              <span className="text-muted-foreground">Address: </span>
              {details.address}
            </div>
          </div>
        </SummaryCard>

        <SummaryCard title="Documents">
          <div className="grid gap-2">
            {uploaded.map(([k, v]) => {
              const cfg = DOC_TYPES.find((d) => d.key === k);
              if (!cfg || !v) return null;
              return (
                <div key={k} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{cfg.label}</span>
                  <span className="text-muted-foreground">— {v.name}</span>
                </div>
              );
            })}
          </div>
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
