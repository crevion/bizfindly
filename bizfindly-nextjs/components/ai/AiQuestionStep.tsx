"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiStep } from "@/types/ai";

export function AiQuestionStep({
  step,
  totalSteps,
  current,
  answers,
  progress,
  onSelect,
  onNext,
}: {
  step: number;
  totalSteps: number;
  current: AiStep;
  answers: Record<string, string | string[]>;
  progress: number;
  onSelect: (option: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="bg-muted mb-6 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="gradient-brand h-full transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        Step {step + 1} of {totalSteps}
      </div>
      <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">{current.question}</h2>
      {current.multi && (
        <p className="text-muted-foreground mt-2 text-sm">Pick as many as you like.</p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {current.options.map((opt) => {
          const sel = current.multi
            ? ((answers[current.key] as string[]) ?? []).includes(opt)
            : answers[current.key] === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
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
          onClick={onNext}
          className="gradient-brand text-brand-foreground shadow-glow mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
