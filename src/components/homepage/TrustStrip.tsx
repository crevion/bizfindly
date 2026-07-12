import { BadgeCheck, MessageSquareQuote, Shield, Sparkles, Tag } from "lucide-react";

const items = [
  { icon: BadgeCheck, label: "Verified Businesses", color: "text-info" },
  { icon: MessageSquareQuote, label: "Real Reviews" },
  { icon: Shield, label: "Owner Claimed" },
  { icon: Tag, label: "Exclusive Coupons", color: "text-brand" },
  { icon: Sparkles, label: "AI Recommendations", color: "text-brand" },
];

export function TrustStrip() {
  return (
    <div className="border-y border-border bg-card/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 text-xs font-semibold text-muted-foreground md:text-sm">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="inline-flex items-center gap-1.5">
              <Icon className={`h-4 w-4 ${it.color ?? "text-foreground/70"}`} />
              <span>{it.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
