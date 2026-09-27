"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_LIST } from "@/content/listingCategories";
import type { ListingCategory } from "@/types/listing";
import { StepHeader } from "./fields";

export function CategoryStep({
  value,
  onSelect,
}: {
  value: ListingCategory | null;
  onSelect: (c: ListingCategory) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker="Step 1"
        title="What would you like to list?"
        sub="Pick a category — we'll tailor the next steps to your business."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {CATEGORY_LIST.map((c) => {
          const Icon = c.icon;
          const active = value === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={cn(
                "group shadow-card hover:shadow-glow relative aspect-[4/5] overflow-hidden rounded-3xl text-left transition-all duration-300 hover:-translate-y-1 md:aspect-[3/4]",
                active && "ring-brand ring-offset-background ring-2 ring-offset-2",
              )}
            >
              <img
                src={c.image}
                alt={c.label}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className={cn("absolute inset-0 bg-gradient-to-t opacity-90", c.gradient)} />
              <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <Icon className="h-5 w-5" />
                  </span>
                  {active && (
                    <span className="text-foreground flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-display text-2xl leading-tight font-extrabold">
                    {c.label}
                  </div>
                  <div className="mt-1 text-sm opacity-90">{c.tagline}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
