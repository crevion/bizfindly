"use client";

import { Sparkles, Star } from "lucide-react";
import type { Place, PlaceReview } from "@/types/place";

export function AiSummary({ summary }: { summary: string }) {
  return (
    <div className="border-border from-brand-soft to-card shadow-soft mt-8 overflow-hidden rounded-3xl border bg-gradient-to-br p-6">
      <div className="text-brand flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
        <Sparkles className="h-4 w-4" /> BizFindly AI summary
      </div>
      <p className="mt-3 text-lg leading-snug font-medium">{summary}</p>
    </div>
  );
}

export function AboutSection({ description }: { description: string }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold">About</h2>
      <p className="text-muted-foreground mt-3 leading-relaxed">{description}</p>
    </section>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold">Why people love it</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="border-border bg-card rounded-full border px-4 py-2 text-sm font-semibold"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

export function FacilityList({ facilities }: { facilities: string[] }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold">Facilities</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {facilities.map((f) => (
          <div
            key={f}
            className="bg-card shadow-soft flex items-center gap-2 rounded-2xl p-3 text-sm"
          >
            <span className="bg-brand h-2 w-2 rounded-full" />
            {f}
          </div>
        ))}
      </div>
    </section>
  );
}

export function MenuSection({ menu }: { menu: NonNullable<Place["menu"]> }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold">Menu highlights</h2>
      <div className="mt-4 space-y-6">
        {menu.map((cat) => (
          <div key={cat.category}>
            <h3 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
              {cat.category}
            </h3>
            <div className="divide-border bg-card shadow-soft mt-2 divide-y rounded-2xl">
              {cat.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-4">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-brand font-semibold">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReviewList({ reviews }: { reviews: PlaceReview[] }) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">
          Reviews
          {reviews.length > 0 && <span className="text-muted-foreground"> ({reviews.length})</span>}
        </h2>
        <button className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-semibold">
          Write a review
        </button>
      </div>
      {reviews.length === 0 ? (
        <div className="border-border bg-card mt-4 rounded-3xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            No reviews yet. Be the first to share your experience.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((r, i) => (
            <div key={`${r.user}-${i}`} className="bg-card shadow-soft rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <div className="gradient-brand text-brand-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                  {r.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{r.user}</div>
                  <div className="text-muted-foreground text-xs">{r.date}</div>
                </div>
                <div className="inline-flex items-center gap-0.5">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star key={idx} className="fill-brand text-brand h-3.5 w-3.5" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
