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
import { useFilterUrlSync } from "@/components/ai-finder/useFilterUrlSync";
import { BusinessTypeSelect } from "@/components/ai-finder/BusinessTypeSelect";
import { businessTypeConfig } from "@/components/ai-finder/businessTypes";
import { ScrollArea } from "@/components/common/ScrollArea";

const SCROLL_TOP_THRESHOLD = 320;

function AiFinderInner() {
  // Before anything reads the filters: the URL seeds them on first load, then
  // tracks them. Must stay above the fetch effect below.
  useFilterUrlSync();

  const openAI = usePlaceFinderStore((s) => s.openAI);
  const visiblePlaces = usePlaceFinderStore((s) => s.visiblePlaces);
  const isLoading = usePlaceFinderStore((s) => s.isLoading);
  const initializePlaces = usePlaceFinderStore((s) => s.initializePlaces);
  const error = usePlaceFinderStore((s) => s.error);
  const errorSource = usePlaceFinderStore((s) => s.errorSource);
  const isAiResponding = usePlaceFinderStore((s) => s.isAiResponding);
  const lastQuery = usePlaceFinderStore((s) => s.lastQuery);
  const sendChatMessage = usePlaceFinderStore((s) => s.sendChatMessage);
  const fetchPlaces = usePlaceFinderStore((s) => s.fetchPlaces);
  const hasMore = usePlaceFinderStore((s) => s.hasMore);
  const isLoadingMore = usePlaceFinderStore((s) => s.isLoadingMore);
  const loadMorePlaces = usePlaceFinderStore((s) => s.loadMorePlaces);
  const resultCount = usePlaceFinderStore((s) => s.resultCount);
  const businessType = usePlaceFinderStore((s) => s.businessType);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const typeConfig = businessTypeConfig(businessType);

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
    <div className="mx-auto max-w-[1240px] min-w-0 px-4 py-3 lg:px-6 lg:py-6">
      {/* The business type governs the map, the list and the assistant below,
          so it sits above all three rather than inside the filters. */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-foreground text-xl font-bold sm:text-2xl">
            Discover {typeConfig.label.toLowerCase()}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
            Search with AI, filter by area and see every {typeConfig.noun} on the map.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <label
            htmlFor="business-type"
            className="text-muted-foreground hidden text-xs font-semibold sm:block"
          >
            Business type
          </label>
          <BusinessTypeSelect className="w-[170px]" />
        </div>
      </div>

      <LocationMapComponent />

      <div className="mt-6 grid min-w-0 grid-cols-1 justify-center gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0 lg:sticky lg:top-20 lg:z-20 lg:self-start">
          <ScrollArea type="hover" className="pr-2 lg:max-h-[calc(100dvh-5.5rem)]">
            <div className="space-y-4 pb-2">
              <SearchPlacePanel />
              {!openAI && <PlaceFinderFilters />}
            </div>
          </ScrollArea>
        </div>

        <div className="min-w-0 space-y-4">
          <PlaceListToolbar />

          {error && (
            <div
              role="alert"
              className="border-destructive/30 bg-card rounded-2xl border p-4 text-sm"
            >
              <p>{error}</p>
              <button
                type="button"
                className="text-brand mt-2 font-semibold"
                onClick={() =>
                  void (errorSource === "more"
                    ? loadMorePlaces()
                    : errorSource === "chat" && lastQuery
                      ? sendChatMessage(lastQuery)
                      : fetchPlaces())
                }
              >
                Try again
              </button>
            </div>
          )}
          {isLoading ? (
            <PlaceListSkeleton count={4} />
          ) : error && visiblePlaces.length === 0 ? null : visiblePlaces.length === 0 ? (
            <PlaceListEmpty />
          ) : (
            <div className="space-y-3.5">
              {visiblePlaces.map((place) => (
                <PlaceFinderCard key={place.id} place={place} />
              ))}
            </div>
          )}
          {!isLoading && hasMore && (
            <button
              type="button"
              disabled={isLoadingMore || isAiResponding}
              onClick={() => void loadMorePlaces()}
              className="border-border bg-card w-full rounded-2xl border px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              {isLoadingMore
                ? "Loading…"
                : `Load more ${typeConfig.plural} (${resultCount} results)`}
            </button>
          )}
        </div>
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="bg-foreground text-background shadow-card fixed bottom-8 left-6 z-50 flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-xs font-bold transition hover:opacity-90 md:left-10"
        >
          ↑ Scroll to top
        </button>
      )}
    </div>
  );
}

export default function AiSearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1240px] p-6" />}>
      <AiFinderInner />
    </Suspense>
  );
}
