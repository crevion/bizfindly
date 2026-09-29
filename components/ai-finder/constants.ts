export const LIST_TABS = ["All", "Trending", "Saved"] as const;
export type ListTab = (typeof LIST_TABS)[number];
export const DEFAULT_LIST_TAB: ListTab = "All";

export const SORT_OPTIONS = [
  "Rating: High to Low",
  "Price: Low to High",
  "Price: High to Low",
  "Most Reviews",
  "Nearest First",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];
export const DEFAULT_SORT: SortOption = "Rating: High to Low";

/**
 * The `ordering` value each sort option asks the backend for.
 *
 * Sorting happens server-side: done in the browser it only ever reordered the
 * loaded page, so "Price: Low to High" put the cheapest of 20 first rather
 * than the cheapest of all matches.
 *
 * "Nearest First" has no ordering of its own -- distance ordering is what a
 * radius search already does, and sending nothing lets it stand.
 */
export const ORDERING_BY_SORT: Record<SortOption, string> = {
  "Rating: High to Low": "-rating",
  "Price: Low to High": "price",
  "Price: High to Low": "-price",
  "Most Reviews": "-review_count",
  "Nearest First": "",
};

export const PLACES_PAGE_SIZE = 8;
export const BUDGET_MAX = 10000;

export interface MapCenter {
  lat: number;
  lng: number;
}

export const DEFAULT_MAP_CENTER: MapCenter = { lat: 23.8103, lng: 90.4125 };

export const MILES_TO_KM = 1.60934;
