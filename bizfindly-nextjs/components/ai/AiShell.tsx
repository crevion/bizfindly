"use client";

import type { ReactNode } from "react";
import { ArrowLeft, Sparkles, X } from "lucide-react";

export function AiShell({
  onBack,
  onClose,
  backDisabled,
  children,
}: {
  onBack: () => void;
  onClose: () => void;
  backDisabled?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-background fixed inset-0 z-50 overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="gradient-brand absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="border-border/60 bg-background/70 sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 backdrop-blur-xl md:px-8">
        <button
          onClick={onBack}
          disabled={backDisabled}
          className="bg-muted text-foreground hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full transition disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="text-brand h-4 w-4" />
          AI Discover
        </div>
        <button
          onClick={onClose}
          className="bg-muted text-foreground hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 md:py-16">{children}</div>
    </div>
  );
}
