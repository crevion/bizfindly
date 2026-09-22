"use client";

import { cn } from "@/lib/utils";

export function DiscoverCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group bg-card shadow-soft ring-border/40 relative block overflow-hidden rounded-3xl ring-1 animate-pulse",
        className,
      )}
    >
      {/* Media Skeleton */}
      <div className="relative aspect-[5/4] bg-muted overflow-hidden">
        {/* Top left badge skeleton */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <div className="h-5 w-20 rounded-full bg-background/70 backdrop-blur" />
        </div>

        {/* Top right favorite button skeleton */}
        <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/70 backdrop-blur" />

        {/* Bottom left open-now pill skeleton */}
        <div className="absolute bottom-3 left-3 h-5 w-18 rounded-full bg-background/70 backdrop-blur" />
      </div>

      {/* Body Skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-5 w-3/4 rounded-md bg-muted" />
            <div className="h-3.5 w-1/2 rounded bg-muted/70" />
          </div>
          <div className="h-6 w-11 rounded-lg bg-muted shrink-0" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-1.5 pt-0.5">
          <div className="h-4.5 w-16 rounded-full bg-muted/80" />
          <div className="h-4.5 w-20 rounded-full bg-muted/80" />
        </div>

        {/* Bottom Details Skeleton */}
        <div className="border-border flex items-center justify-between border-t pt-3">
          <div className="h-3.5 w-24 rounded bg-muted/80" />
          <div className="h-3.5 w-16 rounded bg-muted/70" />
        </div>
      </div>
    </div>
  );
}

export function DiscoverPageSkeleton() {
  return (
    <div className="pb-24 md:pb-12 animate-pulse">
      {/* Sticky Header Skeleton */}
      <div className="border-border/60 bg-background/80 sticky top-14 z-30 border-b backdrop-blur-xl md:top-16">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 md:px-8 md:py-4">
          {/* Search bar skeleton */}
          <div className="h-14 w-full rounded-2xl bg-card border border-border/80 shadow-soft" />
          {/* Category tabs skeleton */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <div className="h-9 w-28 rounded-full bg-card border border-border/60" />
              <div className="h-9 w-24 rounded-full bg-card border border-border/60" />
              <div className="h-9 w-24 rounded-full bg-card border border-border/60" />
            </div>
            <div className="hidden h-9 w-20 rounded-xl bg-card border border-border/60 sm:block" />
          </div>
          {/* Quick filter chips skeleton */}
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-muted/80 shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Areas Carousel Skeleton */}
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-12 w-28 shrink-0 items-center gap-2 rounded-2xl border border-border/60 bg-card p-2"
            >
              <div className="h-8 w-8 rounded-xl bg-muted shrink-0" />
              <div className="h-3.5 w-12 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Trending Section Skeleton */}
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
        <div className="flex items-end justify-between mb-4">
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-6 w-48 rounded bg-muted" />
          </div>
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <DiscoverCardSkeleton key={i} className="w-64 shrink-0 md:w-72" />
          ))}
        </div>
      </div>

      {/* Main Results Grid Skeleton */}
      <div className="mx-auto max-w-7xl px-4 pt-12 md:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-8 w-56 rounded-lg bg-muted" />
            <div className="h-4 w-36 rounded bg-muted/80" />
          </div>
          <div className="hidden h-9 w-44 rounded-full bg-card border border-border md:block" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DiscoverCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
