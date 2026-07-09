import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Bookmark, ChevronDown, Filter, Heart, History, LayoutGrid, List as ListIcon,
  Map as MapIcon, MapPin, Maximize2, Mic, Minimize2, Navigation, Search, Share2, Sliders,
  Sparkles, Star, X, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  parseQuery, searchPlaces, describeFilters, removeFilter, emptyFilters,
  QUICK_SUGGESTIONS, EXAMPLE_QUERIES, type AiFilters,
} from "@/lib/aiSearch";
import { places as ALL_PLACES, type Category, type Place } from "@/lib/mockData";
import { getPlaceVerification } from "@/lib/verification";
import { VerifiedBadge } from "@/components/verification/VerifiedBadge";

export const Route = createFileRoute("/ai")({
  component: AiFinder,
  head: () => ({
    meta: [
      { title: "AI Business Finder — BizFindly" },
      {
        name: "description",
        content:
          "A professional AI-powered workspace to discover verified restaurants, resorts and gyms across Bangladesh.",
      },
    ],
  }),
});

/* ============================================================
 * Constants
 * ============================================================ */

const HISTORY_KEY = "bf.ai.history.v1";
const SAVED_KEY = "bf.ai.saved.v1";

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { key: "resort", label: "Resort", emoji: "🌴" },
  { key: "gym", label: "Gym", emoji: "🏋️" },
];
const CITIES = ["Dhaka", "Chattogram", "Cox's Bazar", "Sylhet"];
const AREAS = ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara", "Gazipur", "Cox's Bazar", "Sajek", "Old Dhaka"];
const CUISINES = ["Bangla", "Chinese", "Thai", "Italian", "BBQ", "Seafood", "Japanese", "Continental"];
const FACILITY_TOGGLES: { key: string; label: string; kind: "flag" | "facility" | "tag" }[] = [
  { key: "verifiedOnly", label: "Verified only", kind: "flag" },
  { key: "openNow", label: "Open now", kind: "flag" },
  { key: "trending", label: "Trending", kind: "flag" },
  { key: "family", label: "Family friendly", kind: "tag" },
  { key: "buffet", label: "Buffet", kind: "tag" },
  { key: "rooftop", label: "Rooftop", kind: "tag" },
  { key: "couple", label: "Couple friendly", kind: "tag" },
  { key: "live music", label: "Live music", kind: "tag" },
  { key: "parking", label: "Parking", kind: "facility" },
  { key: "kids zone", label: "Kids zone", kind: "facility" },
  { key: "pool", label: "Swimming pool", kind: "facility" },
  { key: "female trainer", label: "Female trainer", kind: "facility" },
  { key: "ac", label: "Air conditioning", kind: "facility" },
  { key: "beachfront", label: "Beachfront", kind: "facility" },
];

const SORT_OPTIONS = [
  { key: "match", label: "Most Relevant" },
  { key: "trending", label: "Trending" },
  { key: "rating", label: "Highest Rated" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];
type ViewMode = "grid" | "list" | "map";
type SidebarTab = "ai" | "manual";

/* ============================================================
 * Main
 * ============================================================ */

function AiFinder() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<SidebarTab>("ai");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<AiFilters>(emptyFilters());
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [sort, setSort] = useState<SortKey>("match");
  const [view, setView] = useState<ViewMode>("grid");
  const [mapCollapsed, setMapCollapsed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h));
      const s = localStorage.getItem(SAVED_KEY);
      if (s) setSaved(JSON.parse(s));
    } catch { /* ignore */ }
  }, []);

  const persist = (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
  };

  const pushHistory = (q: string) => {
    const next = [q, ...history.filter((h) => h !== q)].slice(0, 10);
    setHistory(next);
    persist(HISTORY_KEY, next);
  };

  const runQuery = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setQuery(text);
    setFilters({ ...parseQuery(text), sort });
    setSubmitted(true);
    pushHistory(text);
  };

  const toggleSave = (q: string) => {
    const next = saved.includes(q) ? saved.filter((x) => x !== q) : [q, ...saved].slice(0, 12);
    setSaved(next);
    persist(SAVED_KEY, next);
  };

  const results = useMemo<(Place & { matchScore: number })[]>(
    () => (submitted || anyFilterActive(filters) ? searchPlaces({ ...filters, sort }) : []),
    [filters, submitted, sort],
  );

  const chips = describeFilters(filters);
  const universe = submitted || anyFilterActive(filters) ? results : ALL_PLACES.map((p) => ({ ...p, matchScore: 0 }));

  const startVoice = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) { alert("Voice search isn't supported in this browser."); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      if (text) runQuery(text);
    };
    rec.start();
  };

  const clearAll = () => {
    setFilters(emptyFilters());
    setSubmitted(false);
    setQuery("");
    setSelectedId(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[oklch(0.975_0.008_80)]">
      {/* Top header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-4 py-3 md:px-6">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-bold hover:bg-muted"
            aria-label="Back to BizFindly"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl gradient-brand text-brand-foreground shadow-glow">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">BizFindly <span className="text-muted-foreground font-medium">AI</span></span>
          </button>

          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={() => runQuery(query)}
            onVoice={startVoice}
            listening={listening}
          />

          <button
            onClick={() => navigate({ to: "/" })}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 gap-5 px-4 py-5 md:px-6">
        {/* Sidebar */}
        <aside
          className={cn(
            "hidden shrink-0 lg:block",
            "w-[340px] xl:w-[360px]",
          )}
        >
          <div className="sticky top-[76px] max-h-[calc(100vh-92px)] overflow-y-auto pr-1 [scrollbar-width:thin]">
            <Sidebar
              tab={tab} setTab={setTab}
              query={query} setQuery={setQuery} runQuery={runQuery}
              filters={filters} setFilters={setFilters}
              history={history} onClearHistory={() => { setHistory([]); persist(HISTORY_KEY, []); }}
              saved={saved} onToggleSave={toggleSave}
              listening={listening} onVoice={startVoice}
              inputRef={inputRef}
              onApply={() => setSubmitted(true)}
            />
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {showFiltersMobile && (
          <div className="fixed inset-0 z-50 flex flex-col bg-black/40 lg:hidden" onClick={() => setShowFiltersMobile(false)}>
            <div
              className="mt-auto max-h-[88vh] overflow-y-auto rounded-t-3xl bg-background p-4 shadow-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
              <Sidebar
                tab={tab} setTab={setTab}
                query={query} setQuery={setQuery}
                runQuery={(q) => { runQuery(q); setShowFiltersMobile(false); }}
                filters={filters} setFilters={setFilters}
                history={history} onClearHistory={() => { setHistory([]); persist(HISTORY_KEY, []); }}
                saved={saved} onToggleSave={toggleSave}
                listening={listening} onVoice={startVoice}
                inputRef={inputRef}
                onApply={() => { setSubmitted(true); setShowFiltersMobile(false); }}
              />
            </div>
          </div>
        )}

        {/* Main */}
        <main className="min-w-0 flex-1 space-y-5">
          {/* Map card */}
          <div className={cn(
            "overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all",
            mapCollapsed ? "h-14" : "h-[280px] md:h-[340px]",
          )}>
            <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapIcon className="h-4 w-4 text-brand" />
                Live map
                <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                  · {universe.length} pinned
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
                  onClick={() => alert("Nearby me — requires location permission")}
                >
                  <Navigation className="h-3.5 w-3.5" /> Nearby
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  onClick={() => setMapCollapsed((v) => !v)}
                  aria-label={mapCollapsed ? "Expand map" : "Collapse map"}
                >
                  {mapCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {!mapCollapsed && (
              <FauxMap
                places={universe}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-soft">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3 w-3" /> Active
              </span>
              <div className="flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setFilters((f) => removeFilter(f, c.key))}
                    className="group inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand transition hover:bg-brand/20"
                  >
                    {c.label}
                    <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
              <button
                onClick={clearAll}
                className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}

          {/* AI response card */}
          {submitted && (
            <AiResponseCard
              query={query}
              resultCount={results.length}
              chips={chips}
              onRemove={(k) => setFilters((f) => removeFilter(f, k))}
            />
          )}

          {/* Results header */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-xl font-extrabold">
                {results.length || (submitted ? 0 : universe.length)}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filters.category ? `${cap(filters.category)}s` : "Businesses"} found
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <SortDropdown value={sort} onChange={setSort} />
              <div className="flex overflow-hidden rounded-full border border-border bg-card">
                <ViewToggleBtn active={view === "grid"} onClick={() => setView("grid")} label="Grid"><LayoutGrid className="h-3.5 w-3.5" /></ViewToggleBtn>
                <ViewToggleBtn active={view === "list"} onClick={() => setView("list")} label="List"><ListIcon className="h-3.5 w-3.5" /></ViewToggleBtn>
                <ViewToggleBtn active={view === "map"} onClick={() => { setView("map"); setMapCollapsed(false); }} label="Map"><MapIcon className="h-3.5 w-3.5" /></ViewToggleBtn>
              </div>
            </div>
          </div>

          {/* Results body */}
          {!submitted && !anyFilterActive(filters) ? (
            <EmptyIntro onExample={runQuery} />
          ) : results.length === 0 ? (
            <EmptyResults filters={filters} onUpdate={setFilters} />
          ) : view === "list" ? (
            <div className="space-y-3">
              {results.map((p) => (
                <ResultListRow
                  key={p.id}
                  place={p}
                  selected={selectedId === p.id}
                  onHover={() => setSelectedId(p.id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <ResultCard
                  key={p.id}
                  place={p}
                  selected={selectedId === p.id}
                  onHover={() => setSelectedId(p.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile floating action buttons */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2 lg:hidden">
        <button
          onClick={() => setShowMapMobile((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-card"
          aria-label="Toggle map"
        >
          <MapIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowFiltersMobile(true)}
          className="flex h-12 items-center gap-2 rounded-full gradient-brand px-4 text-sm font-bold text-brand-foreground shadow-glow"
        >
          <Sliders className="h-4 w-4" /> Filters
          {chips.length > 0 && (
            <span className="rounded-full bg-white/25 px-1.5 text-[10px]">{chips.length}</span>
          )}
        </button>
      </div>

      {showMapMobile && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2 font-semibold"><MapIcon className="h-4 w-4 text-brand" /> Map</div>
            <button onClick={() => setShowMapMobile(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <FauxMap places={universe} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      )}
    </div>
  );
}

function anyFilterActive(f: AiFilters) {
  return (
    !!f.category || !!f.area || !!f.cuisine || !!f.budgetMax || !!f.budgetMin ||
    f.priceLevelMax !== undefined || f.priceLevelMin !== undefined ||
    !!f.minRating || !!f.openNow || !!f.verifiedOnly || !!f.trending ||
    f.tags.length > 0 || f.facilities.length > 0
  );
}

/* ============================================================
 * Top Search Bar
 * ============================================================ */

function SearchBar({
  value, onChange, onSubmit, onVoice, listening,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onVoice: () => void;
  listening: boolean;
}) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPh((i) => (i + 1) % EXAMPLE_QUERIES.length), 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="group flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-soft transition focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20"
    >
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={EXAMPLE_QUERIES[ph]}
        className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground md:text-[15px]"
      />
      <span className="hidden items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand sm:inline-flex">
        <Sparkles className="h-3 w-3" /> AI
      </span>
      <button
        type="button"
        onClick={onVoice}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition",
          listening ? "gradient-brand text-brand-foreground animate-pulse" : "text-muted-foreground hover:bg-muted",
        )}
        aria-label="Voice search"
      >
        <Mic className="h-4 w-4" />
      </button>
      <button
        type="submit"
        className="flex h-9 items-center gap-1.5 rounded-full gradient-brand px-4 text-sm font-bold text-brand-foreground shadow-glow transition active:scale-95"
      >
        <span className="hidden sm:inline">Search</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

/* ============================================================
 * Sidebar
 * ============================================================ */

function Sidebar({
  tab, setTab, query, setQuery, runQuery,
  filters, setFilters, history, onClearHistory,
  saved, onToggleSave, listening, onVoice, inputRef, onApply,
}: {
  tab: SidebarTab;
  setTab: (t: SidebarTab) => void;
  query: string;
  setQuery: (v: string) => void;
  runQuery: (q: string) => void;
  filters: AiFilters;
  setFilters: React.Dispatch<React.SetStateAction<AiFilters>>;
  history: string[];
  onClearHistory: () => void;
  saved: string[];
  onToggleSave: (q: string) => void;
  listening: boolean;
  onVoice: () => void;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  onApply: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex rounded-full border border-border bg-card p-1 shadow-soft">
        <TabBtn active={tab === "ai"} onClick={() => setTab("ai")}>
          <Sparkles className="h-3.5 w-3.5" /> AI Search
        </TabBtn>
        <TabBtn active={tab === "manual"} onClick={() => setTab("manual")}>
          <Sliders className="h-3.5 w-3.5" /> Manual Filters
        </TabBtn>
      </div>

      {tab === "ai" ? (
        <AiTab
          query={query} setQuery={setQuery} runQuery={runQuery}
          history={history} onClearHistory={onClearHistory}
          saved={saved} onToggleSave={onToggleSave}
          listening={listening} onVoice={onVoice} inputRef={inputRef}
        />
      ) : (
        <ManualTab filters={filters} setFilters={setFilters} onApply={onApply} />
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition",
        active ? "gradient-brand text-brand-foreground shadow-glow" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/* ---------- AI tab ---------- */

function AiTab({
  query, setQuery, runQuery, history, onClearHistory, saved, onToggleSave,
  listening, onVoice, inputRef,
}: {
  query: string;
  setQuery: (v: string) => void;
  runQuery: (q: string) => void;
  history: string[];
  onClearHistory: () => void;
  saved: string[];
  onToggleSave: (q: string) => void;
  listening: boolean;
  onVoice: () => void;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="space-y-4">
      <SidebarCard>
        <SectionHeader icon={<Sparkles className="h-4 w-4 text-brand" />} title="Ask AI" hint="Natural language" />
        <textarea
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runQuery(query); } }}
          placeholder="Show me a rooftop restaurant in Gulshan under ৳3000…"
          rows={4}
          className="w-full resize-none rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button" onClick={onVoice}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-border transition",
              listening ? "gradient-brand border-transparent text-brand-foreground animate-pulse" : "text-muted-foreground hover:bg-muted",
            )}
            aria-label="Voice"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            onClick={() => runQuery(query)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full gradient-brand py-2.5 text-sm font-bold text-brand-foreground shadow-glow transition active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" /> Ask AI
          </button>
        </div>
      </SidebarCard>

      <SidebarCard>
        <SectionHeader icon={<Zap className="h-4 w-4 text-brand" />} title="Quick suggestions" />
        <div className="flex flex-wrap gap-1.5">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => runQuery(s)}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand"
            >
              {s}
            </button>
          ))}
        </div>
      </SidebarCard>

      {history.length > 0 && (
        <SidebarCard>
          <SectionHeader
            icon={<History className="h-4 w-4 text-muted-foreground" />}
            title="Recent"
            action={<button onClick={onClearHistory} className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">Clear</button>}
          />
          <ul className="space-y-1">
            {history.map((q) => (
              <li key={q} className="group flex items-center gap-1">
                <button
                  onClick={() => runQuery(q)}
                  className="flex-1 truncate rounded-lg px-2 py-1.5 text-left text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {q}
                </button>
                <button
                  onClick={() => onToggleSave(q)}
                  className="opacity-0 transition group-hover:opacity-100"
                  aria-label="Save"
                >
                  <Bookmark
                    className={cn("h-3.5 w-3.5", saved.includes(q) ? "fill-brand text-brand" : "text-muted-foreground")}
                  />
                </button>
              </li>
            ))}
          </ul>
        </SidebarCard>
      )}

      {saved.length > 0 && (
        <SidebarCard>
          <SectionHeader icon={<Bookmark className="h-4 w-4 text-brand" />} title="Saved searches" />
          <ul className="space-y-1">
            {saved.map((q) => (
              <li key={q} className="group flex items-center gap-1">
                <button
                  onClick={() => runQuery(q)}
                  className="flex-1 truncate rounded-lg px-2 py-1.5 text-left text-xs font-medium transition hover:bg-muted"
                >
                  {q}
                </button>
                <button onClick={() => onToggleSave(q)} className="text-muted-foreground opacity-0 group-hover:opacity-100" aria-label="Remove">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </SidebarCard>
      )}
    </div>
  );
}

/* ---------- Manual tab ---------- */

function ManualTab({
  filters, setFilters, onApply,
}: {
  filters: AiFilters;
  setFilters: React.Dispatch<React.SetStateAction<AiFilters>>;
  onApply: () => void;
}) {
  const set = <K extends keyof AiFilters>(k: K, v: AiFilters[K]) => setFilters((f) => ({ ...f, [k]: v }));
  const min = filters.budgetMin ?? 200;
  const max = filters.budgetMax ?? 8000;

  const toggleTag = (t: string) => setFilters((f) => ({
    ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
  }));
  const toggleFac = (t: string) => setFilters((f) => ({
    ...f, facilities: f.facilities.includes(t) ? f.facilities.filter((x) => x !== t) : [...f.facilities, t],
  }));

  return (
    <div className="space-y-4">
      <SidebarCard>
        <SectionHeader icon={<LayoutGrid className="h-4 w-4 text-brand" />} title="Business type" />
        <div className="grid grid-cols-3 gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => set("category", filters.category === c.key ? undefined : c.key)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold transition",
                filters.category === c.key
                  ? "border-brand bg-brand/10 text-brand shadow-soft"
                  : "border-border bg-background hover:border-brand/40",
              )}
            >
              <span className="text-lg">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </SidebarCard>

      <SidebarCard>
        <SectionHeader icon={<MapPin className="h-4 w-4 text-brand" />} title="Location" />
        <div className="space-y-2">
          <MiniSelect label="City" value={CITIES[0]} options={CITIES} onChange={() => { /* single city mock */ }} />
          <MiniSelect
            label="Area"
            value={filters.area ?? "Any"}
            options={["Any", ...AREAS]}
            onChange={(v) => set("area", v === "Any" ? undefined : v)}
          />
          <button
            onClick={() => alert("Nearby me — requires location permission")}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-semibold text-muted-foreground hover:border-brand/40 hover:text-brand"
          >
            <Navigation className="h-3.5 w-3.5" /> Nearby me
          </button>
        </div>
      </SidebarCard>

      <SidebarCard>
        <SectionHeader
          icon={<Zap className="h-4 w-4 text-brand" />}
          title="Budget"
          action={<span className="text-[11px] font-bold text-brand">৳{min.toLocaleString()} – ৳{max.toLocaleString()}</span>}
        />
        <DualRange
          min={200} max={15000} step={100}
          low={min} high={max}
          onChange={(lo, hi) => setFilters((f) => ({ ...f, budgetMin: lo, budgetMax: hi }))}
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <NumInput label="Min ৳" value={min} onChange={(v) => set("budgetMin", v)} />
          <NumInput label="Max ৳" value={max} onChange={(v) => set("budgetMax", v)} />
        </div>
      </SidebarCard>

      <SidebarCard>
        <SectionHeader icon={<Star className="h-4 w-4 text-brand" />} title="Minimum rating" />
        <div className="flex gap-1.5">
          {[0, 4, 4.3, 4.5, 4.7].map((r) => (
            <button
              key={r}
              onClick={() => set("minRating", r === 0 ? undefined : r)}
              className={cn(
                "flex-1 rounded-lg border py-1.5 text-xs font-bold transition",
                (filters.minRating ?? 0) === r
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-background hover:border-brand/40",
              )}
            >
              {r === 0 ? "Any" : `${r}★`}
            </button>
          ))}
        </div>
      </SidebarCard>

      {(!filters.category || filters.category === "restaurant") && (
        <SidebarCard>
          <SectionHeader title="Cuisine" />
          <div className="flex flex-wrap gap-1.5">
            {CUISINES.map((c) => (
              <button
                key={c}
                onClick={() => set("cuisine", filters.cuisine === c ? undefined : c)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-semibold transition",
                  filters.cuisine === c
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border bg-background hover:border-brand/40",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </SidebarCard>
      )}

      <SidebarCard>
        <SectionHeader title="Facilities & flags" />
        <div className="grid grid-cols-2 gap-1.5">
          {FACILITY_TOGGLES.map((t) => {
            const active =
              t.kind === "flag" ? Boolean((filters as unknown as Record<string, unknown>)[t.key]) :
              t.kind === "tag" ? filters.tags.includes(t.key) :
              filters.facilities.includes(t.key);
            return (
              <button
                key={t.key}
                onClick={() => {
                  if (t.kind === "flag") set(t.key as keyof AiFilters, !active as never);
                  else if (t.kind === "tag") toggleTag(t.key);
                  else toggleFac(t.key);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[11px] font-semibold transition",
                  active
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-foreground",
                )}
              >
                <span className={cn(
                  "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border",
                  active ? "border-brand bg-brand text-brand-foreground" : "border-border",
                )}>
                  {active && <span className="text-[9px] leading-none">✓</span>}
                </span>
                {t.label}
              </button>
            );
          })}
        </div>
      </SidebarCard>

      <button
        onClick={onApply}
        className="flex w-full items-center justify-center gap-2 rounded-full gradient-brand py-3 text-sm font-bold text-brand-foreground shadow-glow transition active:scale-[0.98]"
      >
        <Search className="h-4 w-4" /> Apply filters
      </button>
    </div>
  );
}

/* ---------- Sidebar primitives ---------- */

function SidebarCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">{children}</div>;
}
function SectionHeader({ icon, title, hint, action }: { icon?: React.ReactNode; title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-sm font-bold">{title}</span>
        {hint && <span className="text-[11px] font-medium text-muted-foreground">· {hint}</span>}
      </div>
      {action}
    </div>
  );
}
function MiniSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs">
      <span className="w-12 shrink-0 font-semibold text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent font-semibold outline-none"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </label>
  );
}
function NumInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs focus-within:border-brand/60">
      <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value || "0", 10))}
        className="w-full bg-transparent text-right font-bold outline-none"
      />
    </label>
  );
}

function DualRange({
  min, max, step, low, high, onChange,
}: {
  min: number; max: number; step: number; low: number; high: number;
  onChange: (lo: number, hi: number) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand"
        style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%` }}
      />
      <input
        type="range" min={min} max={max} step={step} value={low}
        onChange={(e) => onChange(Math.min(parseInt(e.target.value, 10), high - step), high)}
        className="range-thumb absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent"
      />
      <input
        type="range" min={min} max={max} step={step} value={high}
        onChange={(e) => onChange(low, Math.max(parseInt(e.target.value, 10), low + step))}
        className="range-thumb absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent"
      />
    </div>
  );
}

/* ============================================================
 * Sort dropdown + view toggle
 * ============================================================ */

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const cur = SORT_OPTIONS.find((o) => o.key === value)!;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold hover:border-brand/40"
      >
        Sort: <span className="text-brand">{cur.label}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} aria-label="Close" />
          <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.key}
                onClick={() => { onChange(o.key); setOpen(false); }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2 text-xs font-semibold transition",
                  o.key === value ? "bg-brand/10 text-brand" : "hover:bg-muted",
                )}
              >
                {o.label}
                {o.key === value && <span>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function ViewToggleBtn({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center transition",
        active ? "gradient-brand text-brand-foreground" : "text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

/* ============================================================
 * Faux Map
 * ============================================================ */

function FauxMap({
  places, selectedId, onSelect,
}: {
  places: (Place & { matchScore?: number })[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  // Deterministic pseudo-random layout from id
  const points = useMemo(() => places.slice(0, 40).map((p, i) => {
    const seed = p.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + i;
    const x = 8 + ((seed * 37) % 84);
    const y = 10 + ((seed * 53) % 78);
    return { p, x, y };
  }), [places]);

  const active = points.find((pt) => pt.p.id === selectedId);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[oklch(0.94_0.02_180)]">
      {/* Water & land shapes */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M6 0H0V6" fill="none" stroke="oklch(0.88 0.02 180)" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <path d="M0 55 Q20 45 40 55 T80 60 T100 55 L100 100 L0 100 Z" fill="oklch(0.92 0.03 150)" opacity="0.5" />
        <path d="M20 20 Q40 15 60 25 T90 30 L95 40 L60 50 L30 40 Z" fill="oklch(0.92 0.03 130)" opacity="0.4" />
        {/* roads */}
        <path d="M5 30 Q40 32 95 28" fill="none" stroke="oklch(1 0 0)" strokeWidth="1.5" opacity="0.7" />
        <path d="M10 65 Q50 60 90 70" fill="none" stroke="oklch(1 0 0)" strokeWidth="1.5" opacity="0.7" />
        <path d="M45 5 Q50 50 55 95" fill="none" stroke="oklch(1 0 0)" strokeWidth="1.5" opacity="0.7" />
      </svg>

      {/* Pins */}
      {points.map(({ p, x, y }) => {
        const isActive = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            style={{ left: `${x}%`, top: `${y}%` }}
            className={cn(
              "group absolute -translate-x-1/2 -translate-y-full transition-all duration-200",
              isActive ? "z-20 scale-125" : "z-10 hover:z-20 hover:scale-110",
            )}
          >
            <div className={cn(
              "flex h-8 min-w-8 items-center gap-1 rounded-full border-2 px-1.5 text-[10px] font-bold shadow-card transition",
              isActive
                ? "gradient-brand border-white text-brand-foreground"
                : p.verified
                  ? "border-white bg-white text-foreground hover:border-brand"
                  : "border-white bg-foreground text-background hover:border-brand",
            )}>
              <MapPin className="h-3.5 w-3.5" />
              {isActive && <span className="pr-1">{p.name.split(" ")[0]}</span>}
            </div>
          </button>
        );
      })}

      {/* Selected preview */}
      {active && (
        <Link
          to="/place/$slug"
          params={{ slug: active.p.slug }}
          className="absolute bottom-3 left-1/2 z-30 flex w-[280px] -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-card p-2 shadow-card animate-in slide-in-from-bottom-2"
        >
          <img src={active.p.image} alt={active.p.name} className="h-14 w-14 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">{active.p.name}</div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="h-3 w-3 fill-brand text-brand" /> {active.p.rating}
              <span>·</span> {active.p.area}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-brand" />
        </Link>
      )}
    </div>
  );
}

/* ============================================================
 * Result cards
 * ============================================================ */

function ResultCard({ place, selected, onHover }: { place: Place & { matchScore: number }; selected: boolean; onHover: () => void }) {
  const v = getPlaceVerification(place.id);
  const price = priceFromRangeStr(place.priceRange);
  return (
    <Link
      to="/place/$slug"
      params={{ slug: place.slug }}
      onMouseEnter={onHover}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-card",
        selected ? "border-brand ring-2 ring-brand/30" : "border-border",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={place.image} alt={place.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {place.matchScore >= 55 && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-foreground shadow-soft">
              {place.matchScore}% match
            </span>
          )}
          {place.trending && (
            <span className="rounded-full bg-[#F59E0B] px-2 py-0.5 text-[10px] font-bold text-white shadow-soft">
              Trending
            </span>
          )}
        </div>
        <div className="absolute right-2 top-2 flex gap-1">
          <IconBtn label="Save"><Heart className="h-3.5 w-3.5" /></IconBtn>
          <IconBtn label="Share"><Share2 className="h-3.5 w-3.5" /></IconBtn>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-display text-[15px] font-bold leading-tight">{place.name}</h3>
              {v.status === "verified" && <VerifiedBadge status="verified" size="sm" />}
            </div>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {place.cuisine ?? cap(place.category)} · {place.area}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-[#22C55E]/10 px-1.5 py-0.5 text-xs">
            <Star className="h-3 w-3 fill-[#22C55E] text-[#22C55E]" />
            <span className="font-bold text-[#166534]">{place.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {place.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-2 text-[11px]">
          <span className="font-bold text-foreground">
            {price ? `৳${price.toLocaleString()}` : "৳".repeat(place.priceLevel)}
          </span>
          <span className="text-muted-foreground">{place.reviews.toLocaleString()} reviews</span>
          <span className="rounded-full bg-[#22C55E]/10 px-1.5 py-0.5 font-bold text-[#166534]">Open</span>
        </div>
      </div>
    </Link>
  );
}

function ResultListRow({ place, selected, onHover }: { place: Place & { matchScore: number }; selected: boolean; onHover: () => void }) {
  const v = getPlaceVerification(place.id);
  return (
    <Link
      to="/place/$slug"
      params={{ slug: place.slug }}
      onMouseEnter={onHover}
      className={cn(
        "flex gap-4 rounded-2xl border bg-card p-3 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card",
        selected ? "border-brand ring-2 ring-brand/30" : "border-border",
      )}
    >
      <img src={place.image} alt={place.name} className="h-24 w-32 shrink-0 rounded-xl object-cover" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-display font-bold">{place.name}</h3>
              {v.status === "verified" && <VerifiedBadge status="verified" size="sm" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {place.cuisine ?? cap(place.category)} · {place.area}
            </p>
          </div>
          {place.matchScore >= 55 && (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">{place.matchScore}%</span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {place.tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{t}</span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-bold text-foreground">
            <Star className="h-3 w-3 fill-brand text-brand" /> {place.rating}
          </span>
          <span>{place.reviews} reviews</span>
          <span className="font-bold text-foreground">{"৳".repeat(place.priceLevel)}</span>
          <span className="ml-auto rounded-full bg-[#22C55E]/10 px-2 py-0.5 font-bold text-[#166534]">Open now</span>
        </div>
      </div>
    </Link>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={(e) => e.preventDefault()}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft backdrop-blur transition hover:scale-110 hover:bg-white"
    >
      {children}
    </button>
  );
}

/* ============================================================
 * AI response card
 * ============================================================ */

function AiResponseCard({
  query, resultCount, chips, onRemove,
}: {
  query: string;
  resultCount: number;
  chips: { key: string; label: string }[];
  onRemove: (k: string) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#3B82F6]/20 bg-gradient-to-br from-[#3B82F6]/5 via-brand/5 to-transparent p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-brand text-brand-foreground shadow-glow">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-bold">AI searched thousands of listings</span> and found{" "}
            <span className="font-bold text-brand">{resultCount}</span>{" "}
            {resultCount === 1 ? "match" : "matches"}
            {query && <> for <span className="italic text-muted-foreground">“{query}”</span></>}.
          </p>
          {chips.length > 0 && (
            <div className="mt-3">
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Detected preferences</div>
              <div className="flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => onRemove(c.key)}
                    className="group inline-flex items-center gap-1 rounded-full border border-brand/30 bg-white px-2.5 py-1 text-xs font-semibold text-brand shadow-soft transition hover:bg-brand hover:text-brand-foreground"
                  >
                    <span className="text-[10px]">✓</span> {c.label}
                    <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Empty states
 * ============================================================ */

function EmptyIntro({ onExample }: { onExample: (q: string) => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-brand-foreground shadow-glow">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold">Your AI workspace is ready</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Ask in natural language or fine-tune the manual filters. Results, chips and the live map update together.
      </p>
      <div className="mx-auto mt-6 grid max-w-2xl gap-2 sm:grid-cols-2">
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => onExample(q)}
            className="group rounded-2xl border border-border bg-background p-3 text-left text-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft"
          >
            <span className="mr-1.5 text-brand">›</span>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyResults({ filters, onUpdate }: { filters: AiFilters; onUpdate: (f: AiFilters) => void }) {
  const suggestions: { label: string; apply: () => void }[] = [];
  if (filters.budgetMax) {
    suggestions.push({
      label: `Increase budget to ৳${Math.round(filters.budgetMax * 1.5).toLocaleString()}`,
      apply: () => onUpdate({ ...filters, budgetMax: Math.round(filters.budgetMax! * 1.5) }),
    });
  }
  if (filters.area) suggestions.push({ label: "Expand search radius", apply: () => onUpdate({ ...filters, area: undefined }) });
  if (filters.tags.length > 0) suggestions.push({ label: `Remove "${filters.tags[0]}" filter`, apply: () => onUpdate({ ...filters, tags: filters.tags.slice(1) }) });
  if (filters.priceLevelMax !== undefined) suggestions.push({ label: "Include premium options", apply: () => onUpdate({ ...filters, priceLevelMax: undefined }) });
  if (!suggestions.length) suggestions.push({ label: "Reset filters", apply: () => onUpdate(emptyFilters()) });

  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center">
      <p className="font-display text-xl font-extrabold">No exact matches</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        Try one of these adjustments to widen the search:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={s.apply}
            className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 py-2 text-xs font-bold text-brand-foreground shadow-glow transition active:scale-95"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Helpers
 * ============================================================ */

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function priceFromRangeStr(s: string): number {
  const m = s.match(/(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult:
    | ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void)
    | null;
}
