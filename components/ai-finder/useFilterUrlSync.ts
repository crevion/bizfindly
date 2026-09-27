"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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

  useEffect(() => {
    const store = usePlaceFinderStore;

    const fromUrl = paramsToFilters(new URLSearchParams(window.location.search));
    if (Object.keys(fromUrl).length) store.getState().applyUrlFilters(fromUrl);

    const write = (state: UrlFilters) => {
      const query = filtersToParams(state).toString();
      if (query === window.location.search.replace(/^\?/, "")) return;
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    write(store.getState());
    return store.subscribe(write);
  }, [router, pathname]);
}
