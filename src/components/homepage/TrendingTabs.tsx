import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { places, type Category } from "@/lib/mockData";
import { PlaceCard } from "@/components/PlaceCard";
import { cn } from "@/lib/utils";

const TABS: { key: Category; label: string; count: string }[] = [
  { key: "restaurant", label: "Restaurants", count: "3.4k+" },
  { key: "resort", label: "Resorts", count: "320+" },
  { key: "gym", label: "Gyms", count: "180+" },
];

export function TrendingTabs() {
  const [tab, setTab] = useState<Category>("restaurant");
  const items = places
    .filter((p) => p.category === tab)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold tracking-wide text-brand uppercase">
            Trending near you
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            What people are loving in Dhaka
          </h2>
        </div>
        <Link
          to="/discover"
          className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand"
        >
          Explore all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1 shadow-soft">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5",
                active
                  ? "bg-foreground text-background shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>
    </section>
  );
}
