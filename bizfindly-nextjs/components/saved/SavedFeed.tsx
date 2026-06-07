"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Place } from "@/types/place";
import { listPlaces } from "@/lib/backend/places";
import { PlaceCard } from "@/components/common/PlaceCard";

export function SavedFeed() {
  const [saved, setSaved] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([listPlaces("restaurant").catch(() => []), listPlaces("resort").catch(() => [])])
      .then(([restaurants, resorts]) => {
        if (!active) return;
        setSaved([...restaurants.slice(0, 2), ...resorts.slice(0, 1)]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Your saved places</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quick access to spots you bookmarked.
          </p>
        </div>
        <span className="bg-muted rounded-full px-3 py-1 text-xs font-semibold">
          {saved.length} saved
        </span>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card h-72 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div className="border-border bg-card mt-12 rounded-3xl border border-dashed p-12 text-center">
          <Heart className="text-muted-foreground mx-auto h-10 w-10" />
          <p className="font-display mt-4 text-lg font-semibold">Nothing saved yet</p>
          <Link href="/discover" className="text-brand mt-3 inline-block text-sm font-semibold">
            Start browsing →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {saved.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </div>
  );
}
