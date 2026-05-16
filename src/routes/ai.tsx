import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Dumbbell, Palmtree, Sparkles, UtensilsCrossed, X } from "lucide-react";
import { places } from "@/lib/mockData";
import { PlaceCard } from "@/components/PlaceCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  component: AiFlow,
  head: () => ({
    meta: [
      { title: "AI Discovery — BizFindly" },
      { name: "description", content: "Tell us your mood, get personalized AI picks." },
    ],
  }),
});

type Track = "restaurant" | "resort" | "gym";

interface Step {
  key: string;
  question: string;
  options: string[];
  multi?: boolean;
}

const restaurantSteps: Step[] = [
  {
    key: "occasion",
    question: "What are you looking for today?",
    options: [
      "Family Dinner",
      "Couple Date",
      "Rooftop Dining",
      "Budget Meal",
      "Buffet",
      "Fine Dining",
      "Birthday",
      "Fast Food",
    ],
  },
  {
    key: "matters",
    question: "What matters most?",
    multi: true,
    options: [
      "Taste",
      "Interior",
      "Budget",
      "Quiet Environment",
      "Instagrammable",
      "Live Music",
      "Family Friendly",
      "Kids Friendly",
    ],
  },
  { key: "budget", question: "What's your budget?", options: ["Budget", "Mid-range", "Premium", "Luxury"] },
  {
    key: "cuisine",
    question: "Pick a cuisine",
    options: ["Bangla", "Chinese", "Thai", "Italian", "BBQ", "Seafood", "Dessert"],
  },
  {
    key: "area",
    question: "Where to?",
    options: ["Nearby", "Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara", "Old Dhaka"],
  },
  { key: "group", question: "Who's coming along?", options: ["Solo", "Couple", "Family", "Friends"] },
];

const resortSteps: Step[] = [
  { key: "group", question: "Who's traveling?", options: ["Couple", "Family", "Friends", "Solo"] },
  { key: "budget", question: "What's your budget?", options: ["Budget", "Mid-range", "Premium", "Luxury"] },
  { key: "nights", question: "How many nights?", options: ["1 night", "2 nights", "3 nights", "4+ nights"] },
  { key: "vibe", question: "What's the vibe?", options: ["Beach", "Nature", "Luxury", "Adventure"] },
  { key: "pool", question: "Do you need a pool?", options: ["Yes", "No"] },
  { key: "kids", question: "Kids friendly?", options: ["Yes", "No"] },
  { key: "distance", question: "How far from Dhaka?", options: ["Near Dhaka", "Long Trip"] },
  { key: "energy", question: "Quiet or activity-focused?", options: ["Quiet", "Activity-focused"] },
];

function AiFlow() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"intro" | "questions" | "results">("intro");
  const [track, setTrack] = useState<Track>("restaurant");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const steps = track === "restaurant" ? restaurantSteps : resortSteps;
  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const select = (option: string) => {
    if (current.multi) {
      const cur = (answers[current.key] as string[]) ?? [];
      const next = cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option];
      setAnswers({ ...answers, [current.key]: next });
    } else {
      setAnswers({ ...answers, [current.key]: option });
      setTimeout(() => next(), 250);
    }
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setStage("results");
  };
  const back = () => {
    if (step === 0) setStage("intro");
    else setStep(step - 1);
  };

  const results = useMemo(() => {
    if (stage !== "results") return [];
    const targetCat = track === "restaurant" ? "restaurant" : "resort";
    const budgetMap: Record<string, number> = { Budget: 1, "Mid-range": 2, Premium: 3, Luxury: 4 };
    const desiredBudget = budgetMap[(answers.budget as string) ?? "Mid-range"] ?? 2;
    const area = answers.area as string | undefined;
    const cuisine = answers.cuisine as string | undefined;
    const matters = (answers.matters as string[]) ?? [];

    return places
      .filter((p) => p.category === targetCat || p.category === "cafe")
      .map((p) => {
        let score = 60;
        if (p.category === targetCat) score += 15;
        score -= Math.abs(p.priceLevel - desiredBudget) * 8;
        if (area && area !== "Nearby" && p.area === area) score += 12;
        if (cuisine && p.cuisine?.toLowerCase().includes(cuisine.toLowerCase())) score += 8;
        if (matters.includes("Instagrammable") && p.tags.some((t) => t.includes("Rooftop") || t.includes("Hidden"))) score += 5;
        if (matters.includes("Family Friendly") && p.tags.includes("Family Friendly")) score += 6;
        if (matters.includes("Budget") && p.priceLevel <= 2) score += 5;
        score += Math.round((p.rating - 4) * 8);
        return { ...p, matchScore: Math.max(55, Math.min(99, Math.round(score))) };
      })
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, 6);
  }, [stage, track, answers]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full gradient-brand opacity-20 blur-3xl" />
      </div>

      {/* header */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl md:px-8">
        <button
          onClick={back}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-foreground/10"
          disabled={stage === "intro"}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-brand" />
          AI Discover
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-foreground/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 md:py-16">
        {stage === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Personalized in under 60 seconds
            </div>
            <h1 className="mt-6 font-display text-4xl font-extrabold md:text-6xl">
              Let's find your <span className="text-gradient-brand">perfect spot</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground md:text-lg">
              Answer a few quick questions and we'll match you with places that fit your mood and budget.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  key: "restaurant" as const,
                  title: "Restaurant or Cafe",
                  subtitle: "Find a place to eat or hang out",
                  img: places[0].image,
                },
                {
                  key: "resort" as const,
                  title: "Resort or Getaway",
                  subtitle: "Plan a weekend escape",
                  img: places[2].image,
                },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    setTrack(c.key);
                    setStep(0);
                    setAnswers({});
                    setStage("questions");
                  }}
                  className="group relative overflow-hidden rounded-3xl text-left shadow-card transition hover:-translate-y-1"
                >
                  <div className="aspect-[4/3]">
                    <img src={c.img} alt={c.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="font-display text-xl font-bold">{c.title}</div>
                    <div className="text-sm opacity-90">{c.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "questions" && (
          <div>
            <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full gradient-brand transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step {step + 1} of {steps.length}
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{current.question}</h2>
            {current.multi && (
              <p className="mt-2 text-sm text-muted-foreground">Pick as many as you like.</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {current.options.map((opt) => {
                const sel = current.multi
                  ? ((answers[current.key] as string[]) ?? []).includes(opt)
                  : answers[current.key] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => select(opt)}
                    className={cn(
                      "rounded-2xl border-2 px-5 py-3 text-sm font-semibold transition",
                      sel
                        ? "border-brand bg-brand text-brand-foreground shadow-glow"
                        : "border-border bg-card hover:border-foreground/30 hover:-translate-y-0.5",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {current.multi && (
              <button
                onClick={next}
                className="mt-10 inline-flex items-center gap-2 rounded-full gradient-brand px-7 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {stage === "results" && (
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              Your AI matches
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              We found <span className="text-gradient-brand">{results.length}</span> places for you
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Based on your mood, budget and vibe — ranked by match score.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {results.map((p) => (
                <PlaceCard key={p.id} place={p} showMatch />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setStage("intro");
                  setStep(0);
                  setAnswers({});
                }}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
              >
                Try again
              </button>
              <button
                onClick={() => navigate({ to: "/discover" })}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold"
              >
                Browse all places
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
