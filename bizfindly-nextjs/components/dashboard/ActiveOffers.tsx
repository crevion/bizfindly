"use client";

import { Plus, Tag } from "lucide-react";
import { Section } from "./Section";

export function ActiveOffers() {
  return (
    <Section title="Active offers">
      <div className="border-border rounded-2xl border border-dashed p-5 text-center">
        <Tag className="text-muted-foreground mx-auto h-5 w-5" />
        <div className="mt-2 text-sm font-semibold">No offers yet</div>
        <div className="text-muted-foreground text-xs">Run a coupon to attract new guests.</div>
        <button className="gradient-brand text-brand-foreground mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" /> New offer
        </button>
      </div>
    </Section>
  );
}
