"use client";

import type { CategoryConfig, ListingDraft } from "@/types/listing";
import { Field, PriceInput, StepHeader, inputCls } from "./fields";

export function DetailsStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker={`Step 3 · ${cfg.label}`}
        title="Pricing & hours"
        sub="Set guest expectations up front."
      />
      <div className="space-y-5">
        <div>
          <div className="text-foreground mb-1.5 text-sm font-semibold">
            {cfg.pricingLabel} <span className="text-muted-foreground">· price range</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PriceInput
              placeholder={cfg.priceMinPlaceholder}
              value={draft.priceMin}
              onChange={(v) =>
                update({
                  priceMin: v,
                  pricing: `৳${v}${draft.priceMax ? ` – ৳${draft.priceMax}` : ""}`,
                })
              }
              ariaLabel="Starting price"
            />
            <PriceInput
              placeholder={cfg.priceMaxPlaceholder}
              value={draft.priceMax}
              onChange={(v) =>
                update({
                  priceMax: v,
                  pricing: `৳${draft.priceMin || "?"} – ৳${v}`,
                })
              }
              ariaLabel="Maximum price"
            />
          </div>
          <div className="text-muted-foreground mt-1.5 text-xs">
            Helps with smart filtering and AI recommendations.
          </div>
        </div>

        {cfg.id === "resort" ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Check-in">
                <input
                  className={inputCls}
                  placeholder="2:00 PM"
                  value={draft.checkIn || ""}
                  onChange={(e) => update({ checkIn: e.target.value })}
                />
              </Field>
              <Field label="Check-out">
                <input
                  className={inputCls}
                  placeholder="12:00 PM"
                  value={draft.checkOut || ""}
                  onChange={(e) => update({ checkOut: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Number of rooms">
              <input
                className={inputCls}
                type="number"
                placeholder="24"
                value={draft.rooms || ""}
                onChange={(e) => update({ rooms: e.target.value })}
              />
            </Field>
            <Field label="Reception hours">
              <input
                className={inputCls}
                placeholder="24/7 Reception"
                value={draft.hours}
                onChange={(e) => update({ hours: e.target.value })}
              />
            </Field>
          </>
        ) : (
          <Field label="Opening hours">
            <input
              className={inputCls}
              placeholder={cfg.id === "gym" ? "6:00 AM – 11:00 PM" : "12:00 PM – 11:30 PM"}
              value={draft.hours}
              onChange={(e) => update({ hours: e.target.value })}
            />
          </Field>
        )}
      </div>
    </div>
  );
}
