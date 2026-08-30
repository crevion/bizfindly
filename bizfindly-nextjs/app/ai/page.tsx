"use client";

import { Suspense, useEffect, useState } from "react";
import { LocationMapComponent } from "@/components/ai-finder/LocationMapComponent";
import { SearchPlacePanel } from "@/components/ai-finder/SearchPlacePanel";
import { PlaceFinderFilters } from "@/components/ai-finder/PlaceFinderFilters";
import { PlaceListToolbar } from "@/components/ai-finder/PlaceListToolbar";
import { PlaceFinderCard } from "@/components/ai-finder/PlaceFinderCard";
import { PlaceListSkeleton } from "@/components/ai-finder/PlaceCardSkeleton";
import { PlaceListEmpty } from "@/components/ai-finder/PlaceListEmpty";
import { usePlaceFinderStore } from "@/components/ai-finder/usePlaceFinderStore";
import { ScrollArea } from "@/components/common/ScrollArea";

const SCROLL_TOP_THRESHOLD = 320;

function AiFinderInner() {
  const openAI = usePlaceFinderStore((s) => s.openAI);
  const visiblePlaces = usePlaceFinderStore((s) => s.visiblePlaces);
  const isLoading = usePlaceFinderStore((s) => s.isLoading);
  const initializePlaces = usePlaceFinderStore((s) => s.initializePlaces);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    initializePlaces();
  }, [initializePlaces]);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-[1240px] mx-auto lg:px-6 px-4 lg:py-6 py-3 min-w-0">
      <LocationMapComponent />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] justify-center mt-6 min-w-0 lg:items-start">
        <div className="min-w-0 lg:sticky lg:top-20 lg:z-20 lg:self-start">
          <ScrollArea
            type="hover"
            className="lg:max-h-[calc(100dvh-5.5rem)] pr-2"
          >
            <div className="space-y-4 pb-2">
              <SearchPlacePanel />
              {!openAI && <PlaceFinderFilters />}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4 min-w-0">
          <PlaceListToolbar />

          {isLoading ? (
            <PlaceListSkeleton count={4} />
          ) : visiblePlaces.length === 0 ? (
            <PlaceListEmpty />
          ) : (
            <div className="space-y-3.5">
              {visiblePlaces.map((place) => (
                <PlaceFinderCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 left-6 z-50 flex h-10 px-4 items-center justify-center gap-1.5 rounded-full bg-foreground text-xs font-bold text-background shadow-card transition hover:opacity-90 md:left-10 cursor-pointer"
        >
          ↑ Scroll to top
        </button>
      )}
    </div>
  );
}

export default function AiSearchPage() {
  return (
    <Suspense fallback={<div className="max-w-[1240px] mx-auto p-6" />}>
      <AiFinderInner />
    </Suspense>
  );
}
