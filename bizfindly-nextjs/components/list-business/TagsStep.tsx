"use client";

import { Sparkles, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryConfig, ListingDraft } from "@/types/listing";
import { StepHeader } from "./fields";

function buildAiSuggestions(cfg: CategoryConfig, draft: ListingDraft): string[] {
  const suggestions = new Set<string>();
  if (cfg.id === "restaurant") {
    if (draft.facilities.rooftop) suggestions.add("Rooftop Dining");
    if (draft.facilities.kids) suggestions.add("Family Friendly");
    if (draft.facilities.buffet) suggestions.add("Buffet");
    if (draft.facilities.liveMusic) suggestions.add("Couple Friendly");
    if (!draft.facilities.buffet) suggestions.add("Instagrammable");
  }
  if (cfg.id === "resort") {
    if (draft.facilities.pool) suggestions.add("Luxury Resort");
    if (draft.facilities.couple) suggestions.add("Couple Retreat");
    if (draft.facilities.family) suggestions.add("Family Resort");
    suggestions.add("Staycation");
  }
  if (cfg.id === "gym") {
    if (draft.facilities.femaleTrainer) suggestions.add("Women Only");
    if (draft.facilities.trainer) suggestions.add("Beginner Friendly");
    suggestions.add("Mixed Gym");
    suggestions.add("Premium Fitness");
  }
  return Array.from(suggestions);
}

export function TagsStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  const toggle = (t: string) => {
    const has = draft.tags.includes(t);
    update({ tags: has ? draft.tags.filter((x) => x !== t) : [...draft.tags, t] });
  };

  const aiSuggest = () => {
    const merged = Array.from(new Set([...draft.tags, ...buildAiSuggestions(cfg, draft)]));
    update({ tags: merged });
  };

  return (
    <div>
      <StepHeader
        kicker={`Step 5 · ${cfg.label}`}
        title="Pick a few vibe tags"
        sub="Help us match you with the right people."
      />
      <button
        onClick={aiSuggest}
        className="border-brand/30 bg-brand/10 text-brand hover:bg-brand/20 mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Suggest tags with AI
      </button>
      <div className="flex flex-wrap gap-2">
        {cfg.tags.map((t) => {
          const active = draft.tags.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-foreground hover:border-foreground/40",
              )}
            >
              <Tag className="mr-1.5 inline h-3.5 w-3.5 opacity-70" />
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
