import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Compass, Search, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Best buffet in Dhanmondi",
  "Gym with female trainer",
  "Budget resort near Dhaka",
  "Rooftop dinner for two",
];

export function GlobalSearchHero() {
  const nav = useNavigate();
  const [q, setQ] = useState("");

  function submit(term?: string) {
    const v = (term ?? q).trim();
    if (!v) {
      nav({ to: "/ai" });
      return;
    }
    nav({ to: "/ai", search: { q: v } as never });
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="relative"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-card">
          <div className="flex flex-1 items-center gap-2 pl-3">
            <Sparkles className="h-5 w-5 text-brand" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask anything… e.g. rooftop under 2000 in Gulshan"
              className="flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">AI Discover</span>
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => submit(s)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={() => submit()}
          className="btn-primary inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold"
        >
          <Sparkles className="h-4 w-4" /> AI Discover
        </button>
        <button
          onClick={() => nav({ to: "/discover" })}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground shadow-soft transition hover:-translate-y-0.5 hover:border-foreground/30"
        >
          <Compass className="h-4 w-4" /> Manual Discover
        </button>
      </div>
    </div>
  );
}
