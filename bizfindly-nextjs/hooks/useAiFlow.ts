"use client";

import { useMemo, useState } from "react";
import { places } from "@/content/places";
import { gymSteps, resortSteps, restaurantSteps } from "@/content/aiQuestions";
import type { AiTrack } from "@/types/ai";
import type { Place } from "@/types/place";

type Stage = "intro" | "questions" | "results";

const budgetMap: Record<string, number> = {
  Budget: 1,
  "Mid-range": 2,
  Premium: 3,
  Luxury: 4,
};

export function useAiFlow() {
  const [stage, setStage] = useState<Stage>("intro");
  const [track, setTrack] = useState<AiTrack>("restaurant");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const steps =
    track === "restaurant" ? restaurantSteps : track === "resort" ? resortSteps : gymSteps;
  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const startTrack = (t: AiTrack) => {
    setTrack(t);
    setStep(0);
    setAnswers({});
    setStage("questions");
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setStage("results");
  };

  const back = () => {
    if (stage === "questions" && step === 0) {
      setStage("intro");
    } else if (stage === "questions") {
      setStep(step - 1);
    } else if (stage === "results") {
      setStage("questions");
      setStep(steps.length - 1);
    }
  };

  const select = (option: string) => {
    if (!current) return;
    if (current.multi) {
      const cur = (answers[current.key] as string[]) ?? [];
      const nextValue = cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option];
      setAnswers({ ...answers, [current.key]: nextValue });
    } else {
      setAnswers({ ...answers, [current.key]: option });
      setTimeout(() => next(), 250);
    }
  };

  const reset = () => {
    setStage("intro");
    setStep(0);
    setAnswers({});
  };

  const results: (Place & { matchScore: number })[] = useMemo(() => {
    if (stage !== "results") return [];
    const desiredBudget = budgetMap[(answers.budget as string) ?? "Mid-range"] ?? 2;
    const area = answers.area as string | undefined;
    const cuisine = answers.cuisine as string | undefined;
    const matters = (answers.matters as string[]) ?? [];

    return places
      .filter((p) => p.category === track)
      .map((p) => {
        let score = 60;
        if (p.category === track) score += 15;
        score -= Math.abs(p.priceLevel - desiredBudget) * 8;
        if (area && area !== "Nearby" && p.area === area) score += 12;
        if (cuisine && p.cuisine?.toLowerCase().includes(cuisine.toLowerCase())) score += 8;
        if (
          matters.includes("Instagrammable") &&
          p.tags.some((t) => t.includes("Rooftop") || t.includes("Hidden"))
        )
          score += 5;
        if (matters.includes("Family Friendly") && p.tags.includes("Family Friendly")) score += 6;
        if (matters.includes("Budget") && p.priceLevel <= 2) score += 5;
        score += Math.round((p.rating - 4) * 8);
        return { ...p, matchScore: Math.max(55, Math.min(99, Math.round(score))) };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }, [stage, track, answers]);

  return {
    stage,
    track,
    step,
    answers,
    current,
    steps,
    progress,
    results,
    startTrack,
    select,
    next,
    back,
    reset,
    setStage,
  };
}
