"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CategoryConfig, ListingDraft } from "@/types/listing";
import { StepHeader, inputCls } from "./fields";

function buildAiDescription(cfg: CategoryConfig, draft: ListingDraft): string {
  const facKeys = Object.entries(draft.facilities)
    .filter(([, v]) => v)
    .map(([k]) => k);
  const facLabels = cfg.facilities
    .filter((f) => facKeys.includes(f.key))
    .map((f) => f.label.toLowerCase());
  const tagPart = draft.tags.slice(0, 3).join(", ").toLowerCase();
  const facPart = facLabels.slice(0, 3).join(", ");

  if (cfg.id === "restaurant") {
    return `${draft.name || "This spot"} in ${draft.area || draft.location || "the city"} blends ${draft.cuisine || "modern"} flavours with ${facPart || "warm hospitality"}. Perfect for ${tagPart || "everyday cravings"} — built around a memorable guest experience.`;
  }
  if (cfg.id === "resort") {
    return `Escape to ${draft.name || "our resort"} in ${draft.area || draft.location || "a stunning location"}. Featuring ${facPart || "premium amenities"}, our property is designed for ${tagPart || "couples, families and friends"} looking to unwind in style.`;
  }
  return `${draft.name || "Our gym"} in ${draft.area || draft.location || "your neighbourhood"} offers ${facPart || "modern equipment"} with a community-driven vibe. Ideal for ${tagPart || "all fitness levels"}.`;
}

export function DescriptionStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      update({ description: buildAiDescription(cfg, draft) });
      setGenerating(false);
    }, 900);
  };

  return (
    <div>
      <StepHeader
        kicker={`Step 7 · ${cfg.label}`}
        title="Tell your story"
        sub="A short, honest description converts best. Or let AI draft one for you."
      />
      <div className="space-y-3">
        <button
          onClick={generate}
          disabled={generating}
          className="border-brand/30 bg-brand/10 text-brand hover:bg-brand/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition disabled:opacity-60"
        >
          <Sparkles className={cn("h-3.5 w-3.5", generating && "animate-pulse")} />
          {generating ? "Generating…" : "Generate with AI"}
        </button>
        <textarea
          className={cn(inputCls, "min-h-[180px] resize-none leading-relaxed")}
          placeholder="What makes your business special? Vibe, food, ambiance, story…"
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
        />
        <div className="text-muted-foreground text-xs">
          {draft.description.length} characters · ~
          {Math.max(1, Math.round(draft.description.length / 5))} words
        </div>
      </div>
    </div>
  );
}
