"use client";

import dynamic from "next/dynamic";

const RichDescription = dynamic(() => import("@/components/common/RichDescription"), {
  ssr: false,
});

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
      <RichDescription value={description} />
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
                  <div className="flex min-w-0 items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-xl object-cover hidden"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
                      )}
                      {item.available === false && (
                        <p className="text-muted-foreground text-xs">Currently unavailable</p>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 shrink-0 text-right">
                    <p className="text-brand font-semibold">{item.price}</p>
                    {item.originalPrice && (
                      <s className="text-muted-foreground text-xs">{item.originalPrice}</s>
                    )}
                  </div>
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
    <div>
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
              {r.ownerReply && (
                <div className="border-brand mt-3 border-l-2 pl-3">
                  <p className="text-sm font-semibold">Response from the owner</p>
                  <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
                    {r.ownerReply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
