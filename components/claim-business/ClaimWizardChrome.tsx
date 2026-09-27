"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLAIM_STEPS } from "@/content/claimSteps";
import type { ClaimStepId } from "@/types/verification";

export function ClaimWizardChrome({
  stepId,
  stepIdx,
  canContinue,
  submitting,
  submitError,
  onBack,
  onNext,
  onSubmit,
  children,
}: {
  stepId: ClaimStepId | undefined;
  stepIdx: number;
  canContinue: boolean;
  submitting: boolean;
  submitError?: string | null;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  children: ReactNode;
}) {
  const progress = ((stepIdx + 1) / CLAIM_STEPS.length) * 100;
  const isReview = stepId === "review";

  return (
    <div className="bg-background fixed inset-0 z-[60] flex flex-col">
      <header className="border-border/60 flex items-center justify-between gap-4 border-b px-4 py-3 md:px-8">
        <button
          onClick={onBack}
          className="bg-muted hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center gap-3 px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-sm font-semibold">Claim your business</div>
          </div>
          <div className="text-muted-foreground ml-auto hidden items-center gap-2 text-xs md:flex">
            <Lock className="h-3.5 w-3.5" /> Secure verification
          </div>
        </div>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground hidden text-sm md:inline-flex"
        >
          Save & exit
        </Link>
      </header>

      <div className="border-border/60 border-b px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="flex flex-1 items-center gap-1.5">
            {CLAIM_STEPS.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  i <= stepIdx ? "bg-gradient-to-r from-sky-500 to-blue-600" : "bg-muted",
                )}
              />
            ))}
          </div>
          <div className="text-muted-foreground text-xs font-semibold">
            {stepIdx + 1}/{CLAIM_STEPS.length} · {Math.round(progress)}%
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8 md:py-12">{children}</div>
      </div>

      <footer className="border-border/60 bg-card/80 border-t backdrop-blur">
        {isReview && submitError && (
          <div className="mx-auto max-w-3xl px-4 pt-3 md:px-8">
            <div className="text-destructive bg-destructive/10 rounded-xl px-4 py-2 text-sm">
              {submitError}
            </div>
          </div>
        )}
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <button
            onClick={onBack}
            className="border-border bg-surface rounded-full border px-5 py-2.5 text-sm font-semibold"
          >
            Back
          </button>
          {isReview ? (
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Submitting…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Submit for verification
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!canContinue}
              className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-40"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
