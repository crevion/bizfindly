import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Filter, History, LayoutGrid, Mic, Search, Sliders, Sparkles, X,
} from "lucide-react";
import { PlaceCard } from "@/components/PlaceCard";
import { cn } from "@/lib/utils";
import {
  parseQuery, searchPlaces, describeFilters, removeFilter, emptyFilters,
  QUICK_SUGGESTIONS, EXAMPLE_QUERIES, type AiFilters,
} from "@/lib/aiSearch";
import type { Category, Place } from "@/lib/mockData";

export const Route = createFileRoute("/ai")({
  component: AiFinder,
  head: () => ({
    meta: [
      { title: "AI Business Finder — BizFindly" },
      {
        name: "description",
        content:
          "Describe what you need in plain language — our AI searches thousands of verified restaurants, resorts and gyms.",
      },
    ],
  }),
});

type Mode = "ai" | "manual";
const HISTORY_KEY = "bf.ai.history.v1";

function AiFinder() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("ai");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<AiFilters>(emptyFilters());
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const pushHistory = (q: string) => {
    const next = [q, ...history.filter((h) => h !== q)].slice(0, 8);
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const runQuery = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setQuery(text);
    setFilters(parseQuery(text));
    setSubmitted(true);
    pushHistory(text);
  };

  const results = useMemo<(Place & { matchScore: number })[]>(
    () => (submitted || anyFilterActive(filters) ? searchPlaces(filters) : []),
    [filters, submitted],
  );

  const chips = describeFilters(filters);

  const startVoice = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice search isn't supported in this browser.");
      return;
    }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[500px]">
        <div className="gradient-brand absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="border-border/60 bg-background/70 sticky top-0 z-30 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="text-brand h-4 w-4" />
            AI Business Finder
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-muted flex rounded-full p-1 text-xs font-semibold">
              <button
                onClick={() => setMode("ai")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition",
                  mode === "ai" ? "bg-background shadow-soft" : "text-muted-foreground",
                )}
              >
                <Sparkles className="h-3.5 w-3.5" /> AI Search
              </button>
              <button
                onClick={() => setMode("manual")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition",
                  mode === "manual" ? "bg-background shadow-soft" : "text-muted-foreground",
                )}
              >
                <Sliders className="h-3.5 w-3.5" /> Manual
              </button>
            </div>
            <button
              onClick={() => navigate({ to: "/" })}
              className="bg-muted hover:bg-foreground/10 flex h-9 w-9 items-center justify-center rounded-full transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[minmax(320px,35%)_1fr] md:px-8 md:py-10">
        {/* LEFT PANEL */}
        <aside className="space-y-6 md:sticky md:top-24 md:self-start">
          {mode === "ai" ? (
            <AiPanel
              query={query}
              setQuery={setQuery}
              onSubmit={() => runQuery(query)}
              onSuggestion={(s) => runQuery(s)}
              history={history}
              onHistory={(q) => runQuery(q)}
              onClearHistory={() => {
                setHistory([]);
                try {
                  localStorage.removeItem(HISTORY_KEY);
                } catch {
                  /* ignore */
                }
              }}
              inputRef={inputRef}
              onVoice={startVoice}
              listening={listening}
            />
          ) : (
            <ManualPanel filters={filters} setFilters={setFilters} onApply={() => setSubmitted(true)} />
          )}
        </aside>

        {/* RIGHT PANEL */}
        <section>
          <ResultsHeader
            resultCount={results.length}
            chips={chips}
            onRemove={(k) => setFilters((f) => removeFilter(f, k))}
            onClear={() => {
              setFilters(emptyFilters());
              setSubmitted(false);
              setQuery("");
            }}
            submitted={submitted}
          />

          {!submitted && !anyFilterActive(filters) ? (
            <EmptyIntro onExample={runQuery} />
          ) : results.length === 0 ? (
            <EmptyResults filters={filters} onUpdate={setFilters} />
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <PlaceCard key={p.id} place={p} showMatch />
              ))}
            </div>
          )}
        </section>
      </div>
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

/* -------------------- AI Panel -------------------- */

function AiPanel({
  query, setQuery, onSubmit, onSuggestion, history, onHistory, onClearHistory,
  inputRef, onVoice, listening,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: () => void;
  onSuggestion: (s: string) => void;
  history: string[];
  onHistory: (q: string) => void;
  onClearHistory: () => void;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  onVoice: () => void;
  listening: boolean;
}) {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % EXAMPLE_QUERIES.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="bg-brand/10 text-brand inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> Grounded in verified listings
        </div>
        <h1 className="font-display mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
          Find exactly what you're <span className="text-gradient-brand">looking for.</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">
          Describe what you need and our AI will search thousands of verified businesses.
        </p>
      </div>

      <div className="bg-card ring-border/60 shadow-card group rounded-3xl p-3 ring-1 transition focus-within:ring-2 focus-within:ring-foreground/20">
        <textarea
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder={EXAMPLE_QUERIES[placeholderIdx]}
          rows={3}
          className="placeholder:text-muted-foreground w-full resize-none bg-transparent px-3 py-2 text-sm outline-none md:text-base"
        />
        <div className="flex items-center justify-between px-2 pt-2">
          <button
            type="button"
            onClick={onVoice}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition",
              listening ? "bg-brand text-brand-foreground animate-pulse" : "bg-muted hover:bg-foreground/10",
            )}
            aria-label="Voice search"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            onClick={onSubmit}
            className="gradient-brand text-brand-foreground shadow-glow inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Search <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">
          Try
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestion(s)}
              className="border-border bg-card hover:border-foreground/30 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" /> Recent
            </span>
            <button onClick={onClearHistory} className="hover:text-foreground normal-case tracking-normal">
              Clear
            </button>
          </div>
          <ul className="space-y-1.5">
            {history.map((q) => (
              <li key={q}>
                <button
                  onClick={() => onHistory(q)}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground w-full truncate rounded-xl px-3 py-2 text-left text-sm transition"
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* -------------------- Manual Panel -------------------- */

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "restaurant", label: "Restaurants" },
  { key: "resort", label: "Resorts" },
  { key: "gym", label: "Gyms" },
];
const AREAS = ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara", "Gazipur", "Cox's Bazar", "Sajek"];
const CUISINES = ["Bangla", "Chinese", "Thai", "Italian", "BBQ", "Seafood", "Japanese"];

function ManualPanel({
  filters, setFilters, onApply,
}: {
  filters: AiFilters;
  setFilters: (f: AiFilters) => void;
  onApply: () => void;
}) {
  return (
    <div className="bg-card ring-border/60 shadow-soft space-y-6 rounded-3xl p-6 ring-1">
      <div className="flex items-center gap-2">
        <Sliders className="text-brand h-4 w-4" />
        <h2 className="font-display text-lg font-bold">Manual search</h2>
      </div>

      <Section label="Business type">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c.key}
              active={filters.category === c.key}
              onClick={() =>
                setFilters({ ...filters, category: filters.category === c.key ? undefined : c.key })
              }
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </Section>

      <Section label="Area">
        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <Chip
              key={a}
              active={filters.area === a}
              onClick={() => setFilters({ ...filters, area: filters.area === a ? undefined : a })}
            >
              {a}
            </Chip>
          ))}
        </div>
      </Section>

      {(!filters.category || filters.category === "restaurant") && (
        <Section label="Cuisine">
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((c) => (
              <Chip
                key={c}
                active={filters.cuisine === c}
                onClick={() => setFilters({ ...filters, cuisine: filters.cuisine === c ? undefined : c })}
              >
                {c}
              </Chip>
            ))}
          </div>
        </Section>
      )}

      <Section label="Budget tier">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Budget", max: 2 },
            { label: "Mid-range", min: 2, max: 3 },
            { label: "Premium", min: 3 },
            { label: "Luxury", min: 4 },
          ].map((b) => {
            const active =
              filters.priceLevelMin === b.min && filters.priceLevelMax === b.max;
            return (
              <Chip
                key={b.label}
                active={active}
                onClick={() =>
                  setFilters(
                    active
                      ? { ...filters, priceLevelMin: undefined, priceLevelMax: undefined }
                      : { ...filters, priceLevelMin: b.min, priceLevelMax: b.max },
                  )
                }
              >
                {b.label}
              </Chip>
            );
          })}
        </div>
      </Section>

      <Section label="Minimum rating">
        <div className="flex flex-wrap gap-2">
          {[4, 4.3, 4.5, 4.7].map((r) => (
            <Chip
              key={r}
              active={filters.minRating === r}
              onClick={() =>
                setFilters({ ...filters, minRating: filters.minRating === r ? undefined : r })
              }
            >
              {r}★+
            </Chip>
          ))}
        </div>
      </Section>

      <Section label="Trust">
        <div className="flex flex-wrap gap-2">
          <Chip
            active={!!filters.verifiedOnly}
            onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
          >
            Verified only
          </Chip>
          <Chip
            active={!!filters.trending}
            onClick={() => setFilters({ ...filters, trending: !filters.trending })}
          >
            Trending
          </Chip>
        </div>
      </Section>

      <button
        onClick={onApply}
        className="gradient-brand text-brand-foreground shadow-glow inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
      >
        <Search className="h-4 w-4" /> Apply filters
      </button>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">
        {label}
      </div>
      {children}
    </div>
  );
}
function Chip({
  active, onClick, children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background hover:border-foreground/30",
      )}
    >
      {children}
    </button>
  );
}

/* -------------------- Results header -------------------- */

function ResultsHeader({
  resultCount, chips, onRemove, onClear, submitted,
}: {
  resultCount: number;
  chips: { key: string; label: string }[];
  onRemove: (k: string) => void;
  onClear: () => void;
  submitted: boolean;
}) {
  if (!submitted && chips.length === 0) return null;
  return (
    <div className="bg-card ring-border/60 shadow-soft rounded-2xl p-4 ring-1">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="text-brand h-4 w-4" />
          <span className="font-semibold">
            {resultCount === 0
              ? "No matches yet"
              : `Found ${resultCount} ${resultCount === 1 ? "place" : "places"} matching your request.`}
          </span>
        </div>
        {chips.length > 0 && (
          <button
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground text-xs font-semibold"
          >
            Clear all
          </button>
        )}
      </div>
      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="text-muted-foreground inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
            <Filter className="h-3 w-3" /> Detected
          </div>
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => onRemove(c.key)}
              className="group border-brand/30 bg-brand/5 text-brand hover:bg-brand/10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition"
            >
              {c.label}
              <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------- Empty states -------------------- */

function EmptyIntro({ onExample }: { onExample: (q: string) => void }) {
  return (
    <div className="border-border/60 bg-card/50 mt-6 rounded-3xl border border-dashed p-10 text-center">
      <div className="bg-brand/10 text-brand mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
        <LayoutGrid className="h-6 w-6" />
      </div>
      <h2 className="font-display mt-4 text-2xl font-bold">Ask anything about local businesses</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        The AI understands your intent, converts it into filters, then searches only real listings in our database.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => onExample(q)}
            className="border-border bg-background hover:border-foreground/30 rounded-2xl border p-3 text-left text-sm transition"
          >
            <span className="text-brand mr-1.5">›</span>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyResults({
  filters, onUpdate,
}: {
  filters: AiFilters;
  onUpdate: (f: AiFilters) => void;
}) {
  const suggestions: { label: string; apply: () => void }[] = [];
  if (filters.budgetMax) {
    suggestions.push({
      label: `Increase budget to ৳${Math.round(filters.budgetMax * 1.5).toLocaleString()}`,
      apply: () => onUpdate({ ...filters, budgetMax: Math.round(filters.budgetMax! * 1.5) }),
    });
  }
  if (filters.area) {
    suggestions.push({
      label: `Search nearby locations`,
      apply: () => onUpdate({ ...filters, area: undefined }),
    });
  }
  if (filters.tags.length > 0) {
    suggestions.push({
      label: `Remove "${filters.tags[0]}" filter`,
      apply: () => onUpdate({ ...filters, tags: filters.tags.slice(1) }),
    });
  }
  if (filters.priceLevelMax !== undefined) {
    suggestions.push({
      label: "Include premium options",
      apply: () => onUpdate({ ...filters, priceLevelMax: undefined }),
    });
  }
  if (suggestions.length === 0) {
    suggestions.push({
      label: "Reset and start over",
      apply: () => onUpdate(emptyFilters()),
    });
  }

  return (
    <div className="border-border/60 bg-card/50 mt-5 rounded-3xl border border-dashed p-8 text-center">
      <p className="font-display text-lg font-bold">No exact matches</p>
      <p className="text-muted-foreground mx-auto mt-1 max-w-md text-sm">
        Your search is narrow. Try one of these adjustments:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={s.apply}
            className="bg-foreground text-background inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------- SpeechRecognition types (minimal) -------------------- */
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
  interface SpeechRecognitionInstance extends EventTarget {
    lang: string;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
  }
  interface SpeechRecognitionEvent extends Event {
    results: { [index: number]: { [index: number]: { transcript: string } } };
  }
}
