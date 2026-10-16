"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { BUDGET_MAX, DEFAULT_LIST_TAB, DEFAULT_SORT } from "./constants";
import { DEFAULT_BUSINESS_TYPE } from "./businessTypes";
import { filtersToParams, paramsToFilters, type UrlFilters } from "./filterParams";
import { usePlaceFinderStore } from "./usePlaceFinderStore";

/**
 * Keeps the address bar and the finder's filters in step.
 *
 * On mount the URL wins, so a shared or reloaded link opens showing what it
 * describes. From then on every filter change rewrites the query string. It
 * uses replace(), not push(): dragging the radius slider would otherwise bury
 * the previous page under a hundred history entries.
 *
 * Call this above any effect that fetches. Effects in a component run in the
 * order they are declared, so hydrating here lands before the first request
 * goes out and that request already carries the URL's filters.
 */
export function useFilterUrlSync() {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const lastWrittenQuery = useRef<string | null>(null);
  const readingUrl = useRef(false);

  useEffect(() => {
    // Our own filter updates already changed the store. Only read navigation.
    if (queryString === lastWrittenQuery.current) return;
    lastWrittenQuery.current = queryString;
    readingUrl.current = true;
    const state = usePlaceFinderStore.getState();
    state.stopChat();
    state.applyUrlFilters({
      businessType: DEFAULT_BUSINESS_TYPE,
      searchPlace: "", searchCuisine: "", selectedCity: "", selectedArea: "",
      range: 0, unit: "km", minRating: 0, minBudget: 0, maxBudget: BUDGET_MAX,
      facets: {}, openNow: false, listTab: DEFAULT_LIST_TAB, sortBy: DEFAULT_SORT,
      ...paramsToFilters(new URLSearchParams(queryString)),
    });
    readingUrl.current = false;
    if (state.initialized) {
      void usePlaceFinderStore.getState().fetchPlaces();
      void usePlaceFinderStore.getState().loadLocations();
    }
  }, [queryString]);

  useEffect(() => {
    const write = (state: UrlFilters) => {
      if (readingUrl.current) return;
      const query = filtersToParams(state).toString();
      if (query === lastWrittenQuery.current) return;
      lastWrittenQuery.current = query;
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };
    return usePlaceFinderStore.subscribe(write);
  }, [router, pathname]);
}
