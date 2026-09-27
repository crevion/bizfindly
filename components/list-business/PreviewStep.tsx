"use client";

import { MapPin, Sparkles, Star } from "lucide-react";
import { useMemo } from "react";
import type { CategoryConfig, ListingDraft } from "@/types/listing";
import { StepHeader } from "./fields";

export function PreviewStep({ cfg, draft }: { cfg: CategoryConfig; draft: ListingDraft }) {
  const allImages = useMemo(() => Object.values(draft.images).flat(), [draft.images]);
  const hero = allImages[0] || cfg.image;
  const facLabels = cfg.facilities.filter((f) => draft.facilities[f.key]).map((f) => f.label);

  return (
    <div>
      <StepHeader
        kicker="Almost there"
        title="Live preview"
        sub="This is what people will see. Looks good? Hit publish."
      />
      <div className="border-border bg-card shadow-card overflow-hidden rounded-3xl border">
        <div className="relative h-56 w-full md:h-72">
          <img src={hero} alt={draft.name} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">
                {cfg.label}
              </span>
              {draft.tags.slice(0, 2).map((t) => (
                <span key={t} className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
            <div className="font-display mt-2 text-2xl font-bold">
              {draft.name || "Your business"}
            </div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="h-3.5 w-3.5" /> {draft.location || "Location"}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
            <span className="text-foreground inline-flex items-center gap-1 font-semibold">
              <Star className="fill-brand text-brand h-4 w-4" /> New
            </span>
            <span>·</span>
            <span>{draft.pricing || "Pricing"}</span>
            <span>·</span>
            <span>{draft.hours || "Hours"}</span>
          </div>

          <div className="border-brand/20 bg-brand/5 mt-4 rounded-2xl border p-4">
            <div className="text-brand flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> AI SUMMARY
            </div>
            <p className="text-foreground mt-1.5 text-sm leading-relaxed">
              {draft.description || "Your business description will appear here."}
            </p>
          </div>

          {facLabels.length > 0 && (
            <div className="mt-5">
              <div className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Facilities
              </div>
              <div className="flex flex-wrap gap-2">
                {facLabels.map((f) => (
                  <span key={f} className="bg-muted rounded-full px-3 py-1.5 text-xs font-semibold">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {allImages.length > 1 && (
            <div className="mt-5">
              <div className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Gallery
              </div>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                {allImages.slice(1, 9).map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {draft.mapUrl && (
            <div className="border-border bg-surface mt-5 flex items-center gap-2 rounded-2xl border p-4 text-sm">
              <MapPin className="text-brand h-4 w-4" />
              <a
                href={draft.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-foreground truncate hover:underline"
              >
                {draft.mapUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
