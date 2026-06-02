"use client";

import { useEffect, useState } from "react";
import type { Place } from "@/types/place";
import { listPlaces } from "@/lib/backend/places";
import { PlaceCard } from "@/components/common/PlaceCard";
import { HomeSection, ScrollRow } from "@/components/homepage/HomeSection";

function SkeletonRow() {
  return (
    <ScrollRow>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-card ring-border/40 h-72 w-[260px] flex-none animate-pulse rounded-3xl ring-1"
        />
      ))}
    </ScrollRow>
  );
}

export function HomeFeed() {
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [resorts, setResorts] = useState<Place[]>([]);
  const [gyms, setGyms] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      listPlaces("restaurant").catch(() => []),
      listPlaces("resort").catch(() => []),
      listPlaces("gym").catch(() => []),
    ])
      .then(([r, rs, g]) => {
        if (!active) return;
        setRestaurants(r);
        setResorts(rs);
        setGyms(g);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const all = [...restaurants, ...resorts];
  const trending = all.filter((p) => p.trending || p.rating >= 4.7).slice(0, 10);
  const hidden = all
    .filter((p) => !p.trending && p.rating >= 4.5)
    .slice(0, 8);

  if (loading) {
    return (
      <>
        <HomeSection title="🔥 Trending now" subtitle="What everyone's saving this week">
          <SkeletonRow />
        </HomeSection>
        <HomeSection title="Popular restaurants" subtitle="Rooftops, fine dining and family favourites">
          <SkeletonRow />
        </HomeSection>
      </>
    );
  }

  return (
    <>
      {trending.length > 0 && (
        <HomeSection
          title="🔥 Trending now"
          subtitle="What everyone's saving this week"
          cta={{ label: "See all", to: "/discover" }}
        >
          <ScrollRow>
            {trending.map((p) => (
              <PlaceCard key={p.id} place={p} className="w-[260px] flex-none snap-start" />
            ))}
          </ScrollRow>
        </HomeSection>
      )}

      {restaurants.length > 0 && (
        <HomeSection
          title="Popular restaurants"
          subtitle="Rooftops, fine dining and family favourites"
          cta={{ label: "See all", to: "/discover?cat=restaurant" }}
        >
          <ScrollRow>
            {restaurants.map((p) => (
              <PlaceCard key={p.id} place={p} className="w-[260px] flex-none snap-start" />
            ))}
          </ScrollRow>
        </HomeSection>
      )}

      {resorts.length > 0 && (
        <HomeSection
          title="Weekend resorts"
          subtitle="Quick escapes from Dhaka and beyond"
          cta={{ label: "See all", to: "/discover?cat=resort" }}
        >
          <ScrollRow>
            {resorts.map((p) => (
              <PlaceCard key={p.id} place={p} className="w-[260px] flex-none snap-start" />
            ))}
          </ScrollRow>
        </HomeSection>
      )}

      {gyms.length > 0 && (
        <HomeSection
          title="Top gyms"
          subtitle="Premium training spaces and trusted trainers"
          cta={{ label: "See all", to: "/discover?cat=gym" }}
        >
          <ScrollRow>
            {gyms.map((p) => (
              <PlaceCard key={p.id} place={p} className="w-[260px] flex-none snap-start" />
            ))}
          </ScrollRow>
        </HomeSection>
      )}

      {hidden.length > 0 && (
        <HomeSection title="💎 Hidden gems" subtitle="Locally loved, under-the-radar finds">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {hidden.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        </HomeSection>
      )}
    </>
  );
}
