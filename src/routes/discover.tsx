import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { PlaceCard } from "@/components/PlaceCard";
import { areas, places, type Category } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  component: Discover,
  validateSearch: (s: Record<string, unknown>) => ({
    cat: (s.cat as Category | undefined) ?? undefined,
    q: (s.q as string | undefined) ?? "",
  }),
  head: () => ({
    meta: [
      { title: "Discover places — BizFindly" },
      { name: "description", content: "Browse restaurants, cafes and resorts. Filter by area, budget and vibe." },
    ],
  }),
});

const categories: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "restaurant", label: "Restaurants" },
  { key: "cafe", label: "Cafes" },
  { key: "resort", label: "Resorts" },
];

const sortOptions = ["Recommended", "Top rated", "Most reviewed", "Budget first"] as const;

function Discover() {
  const search = Route.useSearch();
  const [cat, setCat] = useState<Category | "all">(search.cat ?? "all");
  const [query, setQuery] = useState(search.q ?? "");
  const [area, setArea] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState(4);
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Recommended");

  const filtered = useMemo(() => {
    let res = places.slice();
    if (cat !== "all") res = res.filter((p) => p.category === cat);
    if (area !== "All" && area !== "Nearby") res = res.filter((p) => p.area === area);
    res = res.filter((p) => p.priceLevel <= maxPrice);
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cuisine?.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q),
      );
    }
    if (sort === "Top rated") res.sort((a, b) => b.rating - a.rating);
    else if (sort === "Most reviewed") res.sort((a, b) => b.reviews - a.reviews);
    else if (sort === "Budget first") res.sort((a, b) => a.priceLevel - b.priceLevel);
    return res;
  }, [cat, area, maxPrice, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Discover</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse handpicked places. Filter by vibe, budget and location.
          </p>
        </div>
      </div>

      {/* search bar */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, cuisine, vibe…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 shadow-soft">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="bg-transparent text-sm outline-none"
          >
            <option>All</option>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 shadow-soft">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof sortOptions)[number])}
            className="bg-transparent text-sm outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* category pills */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition",
              cat === c.key
                ? "bg-foreground text-background"
                : "bg-card text-foreground hover:bg-muted",
            )}
          >
            {c.label}
          </button>
        ))}
        <div className="mx-1 h-9 w-px bg-border" />
        {[1, 2, 3, 4].map((p) => (
          <button
            key={p}
            onClick={() => setMaxPrice(p)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
              maxPrice === p ? "bg-brand text-brand-foreground" : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {"৳".repeat(p)}
            {p < 4 && "+"}
          </button>
        ))}
      </div>

      {/* results */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "place" : "places"} found
          </div>
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground md:hidden">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-lg font-semibold">No matches yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another area or budget.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
