"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiTrack } from "@/types/ai";
import { TRACKS } from "@/content/aiTracks";

export function AiIntro({ track, onStart }: { track: AiTrack; onStart: (t: AiTrack) => void }) {
  return (
    <div className="text-center">
      <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
        <Sparkles className="text-brand h-3.5 w-3.5" />
        Personalized in under 60 seconds
      </div>
      <h1 className="font-display mt-6 text-4xl font-extrabold md:text-6xl">
        Let&apos;s find your <span className="text-gradient-brand">perfect spot</span>
      </h1>
      <p className="text-muted-foreground mx-auto mt-4 max-w-lg md:text-lg">
        Answer a few quick questions and we&apos;ll match you with places that fit your mood and
        budget.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {TRACKS.map((c) => {
          const selected = track === c.key;
          const Icon = c.Icon;
          return (
            <button
              key={c.key}
              onClick={() => onStart(c.key)}
              className={cn(
                "group bg-card hover:shadow-card relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border-2 p-6 text-left transition hover:-translate-y-1",
                selected ? `border-foreground shadow-glow ring-4 ${c.ring}` : "border-border",
              )}
            >
              <span
                className={cn(
                  "shadow-soft flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white",
                  c.accent,
                )}
              >
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <div className="font-display text-xl font-bold">{c.title}</div>
                <div className="text-muted-foreground mt-1 text-sm">{c.subtitle}</div>
              </div>
              <span className="text-brand mt-1 inline-flex items-center gap-1 text-xs font-semibold">
                Start <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
