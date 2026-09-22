"use client";

import { PlaceCard } from "@/components/common/PlaceCard";
import type { Place } from "@/types/place";

export function SimilarPlaces({ places }: { places: Place[] }) {
  if (places.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold md:text-3xl">You might also love</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {places.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>
    </section>
  );
}
