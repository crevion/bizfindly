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
import {
  Map,
  Navigation,
  Expand,
  Sparkles,
  SlidersHorizontal,
  LayoutGrid,
  List,
} from "lucide-react";
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
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mapExpanded, setMapExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const setOpenAI = usePlaceFinderStore((s) => s.setOpenAI);
  const locateUser = usePlaceFinderStore((s) => s.locateUser);
  const mapPlaces = usePlaceFinderStore((s) => s.mapPlaces);
  const allPlaces = usePlaceFinderStore((s) => s.allPlaces);
  const listTab = usePlaceFinderStore((s) => s.listTab);
  const savedPlaceIds = usePlaceFinderStore((s) => s.savedPlaceIds);
  const pinnedCount = (mapPlaces.length ? mapPlaces : allPlaces).filter(
    (p) => p.coords && (listTab !== "Saved" || savedPlaceIds.has(p.id)),
  ).length;

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
    <div className="discover-page bg-background min-h-screen">
      <div className="mx-auto grid max-w-[1600px] items-start gap-5 px-4 py-5 lg:grid-cols-[346px_minmax(0,1fr)] lg:gap-8 lg:px-6">
        <aside className="min-w-0 lg:sticky lg:top-[96px]">
          <ScrollArea type="auto" className="lg:h-[calc(100dvh-112px)] lg:pr-3">
            <div className="space-y-4 pb-4">
              <div className="shadow-soft flex rounded-full border bg-white p-1">
                {[
                  { ai: true, label: "AI Search", icon: Sparkles },
                  { ai: false, label: "Manual Filters", icon: SlidersHorizontal },
                ].map(({ ai, label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={openAI === ai}
                    onClick={() => {
                      setOpenAI(ai);
                      setFiltersExpanded(true);
                    }}
                    className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold transition ${openAI === ai ? "bg-brand text-white" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    {ai ? (
                      <img
                        src="/images/logo/bizfindly-icon.png"
                        alt=""
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 object-contain ${openAI ? "brightness-0 invert" : ""}`}
                      />
                    ) : (
                      <Icon size={14} />
                    )}
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-expanded={filtersExpanded}
                aria-controls="discover-search-controls"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="border-border bg-card flex min-h-11 w-full items-center justify-between rounded-2xl border px-4 text-sm font-semibold lg:hidden"
              >
                {filtersExpanded ? "Hide" : "Show"} {openAI ? "AI assistant" : "filters"}
                <span aria-hidden="true">{filtersExpanded ? "−" : "+"}</span>
              </button>
              <div
                id="discover-search-controls"
                className={`${filtersExpanded ? "block" : "hidden"} space-y-4 lg:block`}
              >
                {openAI ? (
                  <>
                    <SearchPlacePanel />
                    <LocationMapComponent variant="filters" />
                  </>
                ) : (
                  <PlaceFinderFilters />
                )}
              </div>
            </div>
          </ScrollArea>
        </aside>
        <section className="min-w-0 space-y-5" aria-label="Discovery results">
          <div
            className={`shadow-soft overflow-hidden rounded-[26px] border bg-white ${mapExpanded ? "fixed inset-4 z-50 flex flex-col" : ""}`}
          >
            <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-2 gap-y-1 px-3 py-1 sm:px-5">
              <h1 className="flex items-center gap-2 text-sm font-bold">
                <Map size={16} className="text-brand" /> Live map{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  · {pinnedCount} pinned
                </span>
              </h1>
              <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs sm:gap-4">
                <button
                  type="button"
                  onClick={() => void locateUser()}
                  className="flex min-h-11 cursor-pointer items-center gap-1.5 px-2"
                >
                  <Navigation size={14} />
                  Nearby
                </button>
                <button
                  type="button"
                  aria-label={mapExpanded ? "Collapse map" : "Expand map"}
                  aria-pressed={mapExpanded}
                  onClick={() => setMapExpanded(!mapExpanded)}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center"
                >
                  <Expand size={16} />
                </button>
              </div>
            </div>
            <div className={mapExpanded ? "discover-expanded-map relative flex-1" : ""}>
              <LocationMapComponent />
            </div>
          </div>
          <div
            role="status"
            className="shadow-soft flex items-center gap-3 rounded-[22px] border border-[#d4dbef] bg-gradient-to-r from-[#f2eef1] to-[#fff4ef] px-4 py-4 text-sm"
          >
            <span className="bg-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
              <Sparkles size={18} />
            </span>
            <p className="min-w-0 break-words">
              {isAiResponding ? (
                "AI is finding places for you…"
              ) : lastQuery ? (
                <>
                  <strong>AI searched listings</strong> and found{" "}
                  <strong className="text-brand">{resultCount}</strong> matches for{" "}
                  <em className="text-muted-foreground">“{lastQuery}”</em>.
                </>
              ) : (
                <>
                  <strong>Find your next favorite place.</strong> Search with AI or explore{" "}
                  {typeConfig.plural} using the filters.
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground mr-2 text-xl">
                {listTab === "Saved" ? visiblePlaces.length : resultCount}
              </strong>
              Businesses found
            </p>
            <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto">
              <PlaceListToolbar />
              <div className="flex items-center rounded-full border bg-white p-1">
                {[
                  { value: "grid" as const, label: "Grid view", icon: LayoutGrid },
                  { value: "list" as const, label: "List view", icon: List },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={label}
                    aria-pressed={view === value}
                    onClick={() => setView(value)}
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full ${view === value ? "bg-brand text-white" : "text-muted-foreground"}`}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>
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
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-4"
              }
            >
              {visiblePlaces.map((place) => (
                <PlaceFinderCard
                  key={place.id}
                  place={place}
                  layout={view}
                  onAskAi={() => setFiltersExpanded(true)}
                />
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
        </section>
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
