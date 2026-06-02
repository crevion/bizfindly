import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Clock,
  Filter,
  Heart,
  MapPin,
  Map as MapIcon,
  Navigation,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  X,
  Grid3x3,
  BadgeCheck,
} from "lucide-react";
import { areas, places, type Category, type Place } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type Cat = Extract<Category, "restaurant" | "resort" | "gym">;

export const Route = createFileRoute("/discover")({
  component: Discover,
  validateSearch: (s: Record<string, unknown>) => ({
    cat: (s.cat as Cat | undefined) ?? "restaurant",
    q: (s.q as string | undefined) ?? "",
  }),
  head: () => ({
    meta: [
      { title: "Discover restaurants, resorts & gyms — BizFindly" },
      {
        name: "description",
        content:
          "Explore the best restaurants, resorts and gyms across Bangladesh. Filter by vibe, price and area on a premium discovery experience.",
      },
    ],
  }),
});

const CATEGORIES: { key: Cat; label: string; emoji: string }[] = [
  { key: "restaurant", label: "Restaurants", emoji: "🍽️" },
  { key: "resort", label: "Resorts", emoji: "🌴" },
  { key: "gym", label: "Gyms", emoji: "🏋️" },
];

const QUICK_FILTERS: Record<Cat, string[]> = {
  restaurant: [
    "Rooftop",
    "Buffet",
    "Family Friendly",
    "Couple Friendly",
    "Fine Dining",
    "Budget Friendly",
    "Live Music",
    "Delivery",
    "Open Now",
    "Trending",
  ],
  resort: [
    "Swimming Pool",
    "Couple Resort",
    "Family Resort",
    "Luxury",
    "Near Dhaka",
    "BBQ",
    "Nature",
    "Private Villa",
  ],
  gym: [
    "AC Gym",
    "Female Trainer",
    "Weight Training",
    "Cardio",
    "Women Friendly",
    "Budget Gym",
    "Premium Gym",
  ],
};

const PRICE_BOUNDS: Record<Cat, [number, number, string]> = {
  restaurant: [200, 3000, "per person"],
  resort: [1000, 15000, "per night"],
  gym: [800, 8000, "per month"],
};

const TRENDING_SEARCHES = [
  "Rooftop dinner",
  "Couple resort Gazipur",
  "Female trainer gym",
  "Buffet Dhanmondi",
];

const POPULAR_AREAS = [
  "Dhanmondi",
  "Gulshan",
  "Banani",
  "Uttara",
  "Bashundhara",
  "Gazipur",
  "Cox's Bazar",
  "Sajek",
];

const sortOptions = ["Recommended", "Top rated", "Most reviewed", "Budget first"] as const;

// quick filter → matcher
function matchesQuickFilter(p: Place, f: string): boolean {
  const hay = [
    ...p.tags,
    ...p.facilities,
    p.cuisine ?? "",
    p.priceRange,
    p.description,
  ]
    .join(" ")
    .toLowerCase();
  const needle = f.toLowerCase();
  if (needle === "open now") return true;
  if (needle === "trending") return !!p.trending;
  if (needle === "budget friendly" || needle === "budget gym") return p.priceLevel <= 2;
  if (needle === "luxury" || needle === "premium gym" || needle === "fine dining") return p.priceLevel >= 3;
  if (needle === "near dhaka") return ["Gazipur", "Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara"].includes(p.area);
  if (needle === "swimming pool") return hay.includes("pool");
  if (needle === "ac gym") return hay.includes("ac");
  if (needle === "couple resort" || needle === "couple friendly") return hay.includes("couple");
  if (needle === "family resort" || needle === "family friendly") return hay.includes("family");
  return hay.includes(needle);
}

function priceFromRange(p: Place): number {
  // pull first number from priceRange string
  const m = p.priceRange.match(/(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

function Discover() {
  const search = Route.useSearch();
  const [cat, setCat] = useState<Cat>(search.cat ?? "restaurant");
  const [query, setQuery] = useState(search.q ?? "");
  const [area, setArea] = useState<string>("All");
  const [activeQuick, setActiveQuick] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Recommended");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const bounds = PRICE_BOUNDS[cat];
  const [priceRange, setPriceRange] = useState<[number, number]>([bounds[0], bounds[1]]);
  const searchRef = useRef<HTMLDivElement>(null);

  // reset price + quick when category changes
  useEffect(() => {
    const b = PRICE_BOUNDS[cat];
    setPriceRange([b[0], b[1]]);
    setActiveQuick([]);
  }, [cat]);

  // close search panel on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchPanel(false);
      }
    }
    if (showSearchPanel) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showSearchPanel]);

  const baseList = useMemo(() => places.filter((p) => p.category === cat), [cat]);

  const filtered = useMemo(() => {
    let res = baseList.slice();
    if (area !== "All") res = res.filter((p) => p.area === area);
    if (verifiedOnly) res = res.filter((p) => p.verified);
    if (minRating > 0) res = res.filter((p) => p.rating >= minRating);
    if (activeQuick.length) res = res.filter((p) => activeQuick.every((q) => matchesQuickFilter(p, q)));
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cuisine?.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q),
      );
    }
    res = res.filter((p) => {
      const v = priceFromRange(p);
      return v === 0 || (v >= priceRange[0] && v <= priceRange[1] * 1.05);
    });
    if (sort === "Top rated") res.sort((a, b) => b.rating - a.rating);
    else if (sort === "Most reviewed") res.sort((a, b) => b.reviews - a.reviews);
    else if (sort === "Budget first") res.sort((a, b) => a.priceLevel - b.priceLevel);
    return res;
  }, [baseList, area, verifiedOnly, minRating, activeQuick, query, priceRange, sort]);

  const trendingNear = useMemo(() => baseList.filter((p) => p.trending).slice(0, 6), [baseList]);
  const hiddenGems = useMemo(() => baseList.filter((p) => p.hiddenGem).slice(0, 6), [baseList]);

  const placeholder =
    cat === "restaurant"
      ? "Find rooftop restaurants…"
      : cat === "resort"
        ? "Luxury resorts in Gazipur…"
        : "Best gyms near me…";

  const toggleQuick = (f: string) =>
    setActiveQuick((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const activeFilterCount =
    activeQuick.length +
    (verifiedOnly ? 1 : 0) +
    (openNow ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (area !== "All" ? 1 : 0) +
    (priceRange[0] !== bounds[0] || priceRange[1] !== bounds[1] ? 1 : 0);

  return (
    <div className="pb-24 md:pb-12">
      {/* ============ STICKY SEARCH HEADER ============ */}
      <div className="sticky top-14 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl md:top-16">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-8 md:py-4">
          <div className="flex items-center gap-2">
            {/* location chip */}
            <button className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-soft transition hover:bg-muted md:inline-flex">
              <Navigation className="h-4 w-4 text-brand" />
              <span>Dhaka</span>
            </button>

            {/* search bar */}
            <div ref={searchRef} className="relative flex-1">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 shadow-soft transition",
                  showSearchPanel && "ring-2 ring-brand/40",
                )}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowSearchPanel(true)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Clear"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* suggestions panel */}
              {showSearchPanel && (
                <div className="absolute inset-x-0 top-full mt-2 animate-fade-in rounded-3xl border border-border bg-card p-4 shadow-card">
                  <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Trending searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setQuery(t);
                          setShowSearchPanel(false);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-brand-soft"
                      >
                        <TrendingUp className="h-3 w-3 text-brand" />
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Popular areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_AREAS.slice(0, 6).map((a) => (
                      <button
                        key={a}
                        onClick={() => {
                          setArea(a);
                          setShowSearchPanel(false);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
                      >
                        <MapPin className="h-3 w-3" />
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* desktop actions */}
            <button
              onClick={() => setShowFilters(true)}
              className="relative hidden shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-soft transition hover:bg-muted md:inline-flex"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setView((v) => (v === "grid" ? "map" : "grid"))}
              className="hidden shrink-0 items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-soft transition hover:opacity-90 md:inline-flex"
            >
              {view === "grid" ? <MapIcon className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
              {view === "grid" ? "Map" : "Grid"}
            </button>
          </div>

          {/* category tabs */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {CATEGORIES.map((c) => {
              const active = cat === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setCat(c.key)}
                  className={cn(
                    "shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                    active
                      ? "bg-foreground text-background shadow-soft scale-105"
                      : "bg-card text-foreground hover:bg-muted",
                  )}
                >
                  <span className="mr-1.5">{c.emoji}</span>
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* quick filters */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {QUICK_FILTERS[cat].map((f) => {
              const active = activeQuick.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleQuick(f)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                    active
                      ? "border-brand bg-brand text-brand-foreground shadow-soft"
                      : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ LOCATION DISCOVERY ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand">Explore by area</p>
            <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">Popular locations</h2>
          </div>
        </div>
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
          <button
            onClick={() => setArea("All")}
            className={cn(
              "group relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition",
              area === "All" ? "border-brand" : "border-transparent",
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand/60" />
            <div className="relative flex h-full flex-col items-center justify-center text-brand-foreground">
              <Sparkles className="h-5 w-5" />
              <span className="mt-1 text-xs font-bold">All areas</span>
            </div>
          </button>
          {POPULAR_AREAS.map((a, i) => {
            const cover = places.find((p) => p.area === a)?.image;
            const active = area === a;
            return (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={cn(
                  "group relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition hover:-translate-y-0.5",
                  active ? "border-brand shadow-card" : "border-transparent shadow-soft",
                )}
              >
                {cover ? (
                  <img src={cover} alt={a} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 bg-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-2.5 text-left text-white">
                  <p className="text-[13px] font-bold leading-tight">{a}</p>
                  <p className="text-[10px] opacity-80">
                    {places.filter((p) => p.area === a).length} places
                  </p>
                </div>
                {i < 3 && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-brand/90 px-1.5 py-0.5 text-[9px] font-bold text-brand-foreground">
                    HOT
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ TRENDING SECTION ============ */}
      {trendingNear.length > 0 && view === "grid" && (
        <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand">
                <TrendingUp className="h-3 w-3" /> Trending near you
              </p>
              <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">What everyone's loving</h2>
            </div>
            <button className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
            {trendingNear.map((p) => (
              <ModernPlaceCard key={p.id} place={p} className="w-64 shrink-0 md:w-72" />
            ))}
          </div>
        </section>
      )}

      {/* ============ MAIN RESULTS ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              {area === "All" ? "All" : area}{" "}
              <span className="capitalize">{cat === "gym" ? "gyms" : cat + "s"}</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "place" : "places"} match your vibe
            </p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof sortOptions)[number])}
            className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-soft outline-none md:block"
          >
            {sortOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        {view === "map" ? (
          <MapView places={filtered} />
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-lg font-semibold">No matches yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing some filters or another area.</p>
            <button
              onClick={() => {
                setActiveQuick([]);
                setArea("All");
                setVerifiedOnly(false);
                setMinRating(0);
                setPriceRange([bounds[0], bounds[1]]);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ModernPlaceCard key={p.id} place={p} />
            ))}
          </div>
        )}
      </section>

      {/* ============ HIDDEN GEMS ============ */}
      {hiddenGems.length > 0 && view === "grid" && (
        <section className="mx-auto max-w-7xl px-4 pt-12 md:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-foreground via-foreground to-foreground/80 p-6 text-background md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand">Hidden gems</p>
                <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">Places locals quietly love</h2>
              </div>
            </div>
            <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-1">
              {hiddenGems.map((p) => (
                <ModernPlaceCard key={p.id} place={p} className="w-64 shrink-0 md:w-72" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ MOBILE FLOATING ACTIONS ============ */}
      <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center md:hidden">
        <div className="flex items-center gap-2 rounded-full bg-foreground/95 p-1.5 shadow-card backdrop-blur-xl">
          <button
            onClick={() => setShowFilters(true)}
            className="relative inline-flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-xs font-bold text-foreground"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] text-brand-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setView((v) => (v === "grid" ? "map" : "grid"))}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-background"
          >
            {view === "grid" ? <MapIcon className="h-3.5 w-3.5" /> : <Grid3x3 className="h-3.5 w-3.5" />}
            {view === "grid" ? "Map" : "Grid"}
          </button>
        </div>
      </div>

      {/* ============ FILTER MODAL / SHEET ============ */}
      {showFilters && (
        <FilterModal
          cat={cat}
          area={area}
          setArea={setArea}
          activeQuick={activeQuick}
          setActiveQuick={setActiveQuick}
          verifiedOnly={verifiedOnly}
          setVerifiedOnly={setVerifiedOnly}
          openNow={openNow}
          setOpenNow={setOpenNow}
          minRating={minRating}
          setMinRating={setMinRating}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sort={sort}
          setSort={setSort}
          onClose={() => setShowFilters(false)}
          onReset={() => {
            setActiveQuick([]);
            setArea("All");
            setVerifiedOnly(false);
            setOpenNow(false);
            setMinRating(0);
            setPriceRange([bounds[0], bounds[1]]);
          }}
          resultCount={filtered.length}
        />
      )}
    </div>
  );
}

/* ============================== MODERN PLACE CARD ============================== */

function ModernPlaceCard({ place, className }: { place: Place; className?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <Link
      to="/place/$slug"
      params={{ slug: place.slug }}
      className={cn(
        "group relative block overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:ring-brand/30",
        className,
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {place.trending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-foreground shadow-soft">
              <TrendingUp className="h-2.5 w-2.5" /> Trending
            </span>
          )}
          {place.hiddenGem && (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground backdrop-blur">
              Hidden Gem
            </span>
          )}
        </div>

        {/* save button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSaved((s) => !s);
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition hover:scale-110"
          aria-label="Save"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-brand text-brand")} />
        </button>

        {/* open status */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Open now
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-display text-base font-bold">{place.name}</h3>
              {place.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-brand" />}
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {place.area} · <span className="capitalize">{place.cuisine ?? place.category}</span>
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-foreground px-2 py-1 text-[11px] font-bold text-background">
            <Star className="mr-0.5 inline h-2.5 w-2.5 fill-brand text-brand" />
            {place.rating}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {place.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-[12px] font-semibold text-foreground">{place.priceRange.split("•")[1]?.trim() ?? place.priceRange}</span>
          <span className="text-[11px] text-muted-foreground">{place.reviews.toLocaleString()} reviews</span>
        </div>
      </div>
    </Link>
  );
}

/* ============================== MAP VIEW ============================== */

function MapView({ places: list }: { places: Place[] }) {
  const [active, setActive] = useState<Place | null>(list[0] ?? null);
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="relative h-[520px] w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
        {/* faux map grid */}
        <svg className="absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* faux roads */}
        <div className="absolute left-1/4 top-0 h-full w-1 -rotate-12 bg-foreground/10" />
        <div className="absolute right-1/3 top-0 h-full w-1 rotate-6 bg-foreground/10" />
        <div className="absolute left-0 top-1/3 h-1 w-full -rotate-3 bg-foreground/10" />

        {/* pins */}
        {list.map((p, i) => {
          const left = 10 + ((i * 17) % 80);
          const top = 15 + ((i * 23) % 70);
          const isActive = active?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              style={{ left: `${left}%`, top: `${top}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-full transition-all",
                isActive ? "z-10 scale-110" : "hover:scale-110",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-card",
                  isActive ? "bg-brand text-brand-foreground" : "bg-background text-foreground",
                )}
              >
                <Star className="h-2.5 w-2.5 fill-current" />
                {p.rating}
              </div>
              <div
                className={cn(
                  "mx-auto h-2 w-2 rotate-45",
                  isActive ? "bg-brand" : "bg-background",
                )}
              />
            </button>
          );
        })}

        {/* preview card */}
        {active && (
          <div className="absolute inset-x-3 bottom-3 md:inset-x-auto md:left-3 md:right-auto md:w-80">
            <Link
              to="/place/$slug"
              params={{ slug: active.slug }}
              className="flex gap-3 overflow-hidden rounded-2xl bg-background p-2 shadow-card ring-1 ring-border"
            >
              <img src={active.image} alt={active.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1 py-1">
                <div className="flex items-center gap-1">
                  <h4 className="truncate font-display text-sm font-bold">{active.name}</h4>
                  {active.verified && <BadgeCheck className="h-3.5 w-3.5 text-brand" />}
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{active.area} · {active.cuisine ?? active.category}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-0.5 font-bold">
                    <Star className="h-3 w-3 fill-brand text-brand" /> {active.rating}
                  </span>
                  <span className="text-muted-foreground">({active.reviews})</span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== FILTER MODAL ============================== */

function FilterModal(props: {
  cat: Cat;
  area: string;
  setArea: (s: string) => void;
  activeQuick: string[];
  setActiveQuick: (s: string[]) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  openNow: boolean;
  setOpenNow: (v: boolean) => void;
  minRating: number;
  setMinRating: (n: number) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  sort: (typeof sortOptions)[number];
  setSort: (s: (typeof sortOptions)[number]) => void;
  onClose: () => void;
  onReset: () => void;
  resultCount: number;
}) {
  const bounds = PRICE_BOUNDS[props.cat];
  const [min, max] = props.priceRange;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm" onClick={props.onClose} />
      <div className="relative z-10 max-h-[88vh] w-full max-w-2xl animate-fade-in overflow-y-auto rounded-t-3xl bg-background shadow-card md:rounded-3xl">
        {/* drag handle (mobile) */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-muted md:hidden" />
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-display text-lg font-bold">Filters</h3>
            <button onClick={props.onClose} className="rounded-full p-1.5 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5">
          {/* Sort */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort by</p>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => props.setSort(s)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                    props.sort === s ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</p>
            <div className="flex flex-wrap gap-2">
              {["All", ...areas.filter((a) => a !== "Nearby")].map((a) => (
                <button
                  key={a}
                  onClick={() => props.setArea(a)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    props.area === a ? "border-brand bg-brand text-brand-foreground" : "border-border hover:bg-muted",
                  )}
                >
                  <MapPin className="h-3 w-3" />
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Price dual-range */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Price · {bounds[2]}
              </p>
              <p className="text-xs font-bold text-foreground">
                ৳{min.toLocaleString()} – ৳{max.toLocaleString()}
              </p>
            </div>
            <DualRangeSlider
              min={bounds[0]}
              max={bounds[1]}
              value={[min, max]}
              onChange={(v) => props.setPriceRange(v)}
            />
          </div>

          {/* Rating */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Minimum rating</p>
            <div className="flex flex-wrap gap-2">
              {[0, 4, 4.3, 4.5, 4.7].map((r) => (
                <button
                  key={r}
                  onClick={() => props.setMinRating(r)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    props.minRating === r ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted",
                  )}
                >
                  {r === 0 ? "Any" : (
                    <>
                      <Star className="h-3 w-3 fill-brand text-brand" /> {r}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <ToggleCard label="Verified only" icon={<BadgeCheck className="h-4 w-4" />} on={props.verifiedOnly} onChange={() => props.setVerifiedOnly(!props.verifiedOnly)} />
            <ToggleCard label="Open now" icon={<Clock className="h-4 w-4" />} on={props.openNow} onChange={() => props.setOpenNow(!props.openNow)} />
          </div>

          {/* Quick filters */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick filters</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_FILTERS[props.cat].map((f) => {
                const active = props.activeQuick.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() =>
                      props.setActiveQuick(
                        active ? props.activeQuick.filter((x) => x !== f) : [...props.activeQuick, f],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                      active ? "border-brand bg-brand text-brand-foreground" : "border-border hover:bg-muted",
                    )}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">
          <button onClick={props.onReset} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            Reset all
          </button>
          <button
            onClick={props.onClose}
            className="flex-1 rounded-full bg-foreground py-3 text-sm font-bold text-background transition hover:opacity-90"
          >
            Show {props.resultCount} {props.resultCount === 1 ? "place" : "places"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleCard({
  label,
  icon,
  on,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
        on ? "border-brand bg-brand-soft text-foreground" : "border-border bg-card hover:bg-muted",
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition",
          on ? "bg-brand" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            on ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

/* ============================== DUAL RANGE SLIDER ============================== */

function DualRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const pct = (n: number) => ((n - min) / (max - min)) * 100;
  const step = Math.max(1, Math.round((max - min) / 100));

  return (
    <div className="relative h-10">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand"
        style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={(e) => {
          const v = Math.min(parseInt(e.target.value, 10), hi - step);
          onChange([v, hi]);
        }}
        className="range-thumb absolute inset-x-0 top-0 h-10 w-full appearance-none bg-transparent"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={(e) => {
          const v = Math.max(parseInt(e.target.value, 10), lo + step);
          onChange([lo, v]);
        }}
        className="range-thumb absolute inset-x-0 top-0 h-10 w-full appearance-none bg-transparent"
      />
    </div>
  );
}
