"use client";

import { ImagePlus, MessageSquare, Tag, TrendingUp } from "lucide-react";
import { Section } from "./Section";

const ACTIONS = [
  { icon: ImagePlus, label: "Edit photos" },
  { icon: Tag, label: "Create coupon" },
  { icon: TrendingUp, label: "Boost listing" },
  { icon: MessageSquare, label: "Manage reviews" },
];

export function QuickActions() {
  return (
    <Section title="Quick actions">
      <div className="space-y-2">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              className="border-border bg-surface hover:border-foreground/30 flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm font-semibold transition"
            >
              <span className="bg-muted flex h-9 w-9 items-center justify-center rounded-xl">
                <Icon className="h-4 w-4" />
              </span>
              {a.label}
            </button>
          );
        })}
      </div>
    </Section>
  );
}
