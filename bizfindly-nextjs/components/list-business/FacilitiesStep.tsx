"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryConfig, ListingDraft } from "@/types/listing";
import { StepHeader } from "./fields";
import { TaxonomyMultiSelect } from "./TaxonomyMultiSelect";

const BUSINESS_TYPE_SLUG: Record<string, string> = {
  restaurant: "restaurant",
  resort: "resort",
  gym: "gym",
};

export function FacilitiesStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  const toggle = (key: string) =>
    update({
      facilities: { ...draft.facilities, [key]: !draft.facilities[key] },
    });

  if (cfg.id === "restaurant" || cfg.id === "resort") {
    return (
      <div className="space-y-6">
        <StepHeader
          kicker={`Step 4 · ${cfg.label}`}
          title="What facilities do you offer?"
          sub="Tap everything that applies — these power smart filters."
        />
        <TaxonomyMultiSelect
          label="Facilities"
          kind="facilities"
          businessType={BUSINESS_TYPE_SLUG[cfg.id]}
          selected={draft.facilityIds}
          onChange={(ids) => update({ facilityIds: ids })}
        />
      </div>
    );
  }

  return (
    <div>
      <StepHeader
        kicker={`Step 4 · ${cfg.label}`}
        title="What facilities do you offer?"
        sub="Tap everything that applies — these power smart filters."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {cfg.facilities.map((f) => {
          const active = !!draft.facilities[f.key];
          return (
            <button
              key={f.key}
              onClick={() => toggle(f.key)}
              className={cn(
                "group flex items-center justify-between rounded-2xl border-2 px-4 py-4 text-left text-sm font-semibold transition",
                active
                  ? "border-brand bg-brand/5 text-foreground"
                  : "border-border bg-surface text-foreground hover:border-foreground/30",
              )}
            >
              <span>{f.label}</span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition",
                  active
                    ? "gradient-brand text-brand-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {active ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="block h-2 w-2 rounded-full bg-current opacity-30" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
