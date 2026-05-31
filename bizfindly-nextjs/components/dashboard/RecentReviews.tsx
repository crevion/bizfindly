"use client";

import { MessageSquare, Star } from "lucide-react";
import { dashboardReviews } from "@/content/reviews";
import { Section } from "./Section";

export function RecentReviews() {
  return (
    <Section title="Recent reviews" icon={MessageSquare}>
      <div className="space-y-3">
        {dashboardReviews.map((r, i) => (
          <div key={i} className="border-border bg-surface rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{r.name}</div>
              <div className="text-brand flex items-center gap-0.5">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mt-1.5 text-sm">{r.text}</p>
            <button className="text-brand mt-2 text-xs font-semibold hover:underline">Reply</button>
          </div>
        ))}
      </div>
    </Section>
  );
}
