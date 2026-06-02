"use client";

import Link from "next/link";
import { Check, ChevronRight, MapPin } from "lucide-react";
import type { CategoryConfig, ListingDraft } from "@/types/listing";

export function SuccessScreen({
  draft,
  cfg,
  listingId,
}: {
  draft: ListingDraft;
  cfg: CategoryConfig;
  listingId: string | null;
}) {
  const hero = Object.values(draft.images).flat()[0] || cfg.image;

  return (
    <div className="bg-background fixed inset-0 z-[60] flex flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.6)]">
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Your business has been submitted successfully.
        </h1>
        <p className="text-muted-foreground mt-3 max-w-md text-sm md:text-base">
          Our team will review your listing shortly. You&apos;ll get a notification the moment it
          goes live.
        </p>

        <div className="border-border bg-card shadow-card mt-8 w-full overflow-hidden rounded-3xl border">
          <div className="relative h-40 w-full">
            <img src={hero} alt={draft.name} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-white">
              <div className="text-[10px] font-semibold tracking-wider uppercase opacity-90">
                {cfg.label} · Pending review
              </div>
              <div className="font-display text-lg leading-tight font-bold">
                {draft.name || "Your business"}
              </div>
              <div className="flex items-center gap-1 text-xs opacity-90">
                <MapPin className="h-3 w-3" /> {draft.location || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="gradient-brand text-brand-foreground shadow-glow inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
          >
            View Dashboard <ChevronRight className="h-4 w-4" />
          </Link>
          {listingId && (
            <Link
              href="/list-business"
              className="border-border bg-surface inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-sm font-semibold"
            >
              Edit Listing
            </Link>
          )}
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
