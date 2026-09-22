"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LISTING_STEPS } from "@/content/listingSteps";
import type { ListingStepId } from "@/types/listing";

export function WizardChrome({
  stepId,
  stepIdx,
  publishState,
  canContinue,
  onBack,
  onNext,
  onPublish,
  children,
}: {
  stepId: ListingStepId;
  stepIdx: number;
  publishState: "idle" | "publishing" | "done" | "error";
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
  onPublish: () => void;
  children: ReactNode;
}) {
  const step = LISTING_STEPS[stepIdx] ?? LISTING_STEPS[LISTING_STEPS.length - 1];
  const progress = ((stepIdx + 1) / LISTING_STEPS.length) * 100;
  const isPreview = stepId === "preview";

  return (
    <div className="bg-background fixed inset-0 z-[60] flex flex-col">
      <header className="border-border/60 flex items-center justify-between gap-4 border-b px-4 py-3 md:px-8">
        <button
          onClick={onBack}
          className="bg-muted text-foreground hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full transition"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="gradient-brand flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="text-brand-foreground h-4 w-4" />
          </span>
          <span className="font-display text-base font-bold">List your business</span>
        </div>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground rounded-full px-3 py-2 text-xs font-medium"
        >
          <X className="h-4 w-4" />
        </Link>
      </header>

      <div className="px-4 pt-3 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs font-medium">
            <span>
              Step {stepIdx + 1} of {LISTING_STEPS.length} · {step.label}
            </span>
            <span>Autosaved</span>
          </div>
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="gradient-brand h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-12">
        <div
          key={step.id}
          className="animate-in fade-in slide-in-from-bottom-2 mx-auto max-w-2xl duration-300"
        >
          {children}
        </div>
      </div>

      <footer className="border-border/60 bg-background/95 border-t px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            onClick={onBack}
            disabled={publishState === "publishing"}
            className="text-muted-foreground hover:text-foreground rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            Back
          </button>
          {isPreview ? (
            <button
              onClick={onPublish}
              disabled={publishState === "publishing"}
              className="gradient-brand text-brand-foreground shadow-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition hover:opacity-95 disabled:opacity-80"
            >
              {publishState === "publishing" ? (
                <>
                  <span className="border-brand-foreground/40 border-t-brand-foreground h-4 w-4 animate-spin rounded-full border-2" />
                  Publishing your business…
                </>
              ) : (
                <>
                  Publish listing <Check className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!canContinue}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition",
                canContinue
                  ? "gradient-brand text-brand-foreground shadow-glow hover:opacity-95"
                  : "bg-muted text-muted-foreground",
              )}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
