"use client";

import { MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryConfig, ListingDraft } from "@/types/listing";
import { Field, StepHeader, inputCls } from "./fields";

export function BasicsStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  const namePlaceholder =
    cfg.label === "Restaurant"
      ? "Noor Rooftop"
      : cfg.label === "Resort"
        ? "Sahara Beach Resort"
        : "Iron Pulse Fitness";

  return (
    <div>
      <StepHeader
        kicker={`Step 2 · ${cfg.label}`}
        title="Let's start with the basics"
        sub="The essentials people need to find and contact you."
      />
      <div className="space-y-5">
        <Field label={cfg.nameLabel}>
          <input
            className={inputCls}
            placeholder={`e.g. ${namePlaceholder}`}
            value={draft.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </Field>

        {cfg.id === "restaurant" && (
          <Field label="Cuisine type" hint="Comma-separated">
            <input
              className={inputCls}
              placeholder="Bangla, Continental, Italian"
              value={draft.cuisine || ""}
              onChange={(e) => update({ cuisine: e.target.value })}
            />
          </Field>
        )}

        <Field label="Address / Location">
          <div className="relative">
            <MapPin className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              className={cn(inputCls, "pl-11")}
              placeholder="Street address, city"
              value={draft.location}
              onChange={(e) => update({ location: e.target.value })}
            />
          </div>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Area">
            <input
              className={inputCls}
              placeholder="Gulshan, Cox's Bazar, Banani…"
              value={draft.area}
              onChange={(e) => update({ area: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <div className="relative">
              <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
              <input
                className={cn(inputCls, "pl-11")}
                placeholder="+880 1700 000000"
                value={draft.phone}
                onChange={(e) => update({ phone: e.target.value })}
              />
            </div>
          </Field>
        </div>

        <Field label="Google Maps URL" hint="Optional — paste a share link">
          <input
            className={inputCls}
            placeholder="https://maps.google.com/…"
            value={draft.mapUrl}
            onChange={(e) => update({ mapUrl: e.target.value })}
          />
        </Field>

        <Field label="Website" hint="Optional">
          <input
            className={inputCls}
            placeholder="https://your-business.com"
            value={draft.website || ""}
            onChange={(e) => update({ website: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}
