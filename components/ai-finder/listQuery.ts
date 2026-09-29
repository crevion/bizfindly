import { BUDGET_MAX, ORDERING_BY_SORT, type ListTab, type SortOption } from "./constants";
import { radiusSearch, type RadiusFilters } from "./radiusSearch";

/** Params the manual filter panel owns, and so replaces rather than adds to. */
const PANEL_OWNED = [
  "search",
  "cuisine",
  "min_rating",
  "min_price",
  "max_price",
  "open_now",
] as const;

/** Everything the manual filter panel, the toolbar and the map can narrow by. */
export interface ListQueryFilters extends RadiusFilters {
  /** Query params the AI search settled on. */
  queryString: string;
  /** Whether the assistant is driving the search rather than the panel. */
  openAI: boolean;
  searchPlace: string;
  searchCuisine: string;
  /** Listing filter parameter -> the slugs picked in that chip group. */
  facets: Record<string, string[]>;
  minRating: number;
  minBudget: number;
  maxBudget: number;
  openNow: boolean;
  listTab: ListTab;
  sortBy: SortOption;
}

/**
 * The query string for a listing request.
 *
 * Every filter goes to the backend. Narrowing in the browser instead only ever
 * saw the loaded page -- 20 of however many matched -- so a filter appeared to
 * find almost nothing while the count beside the tabs still described the
 * wider search. Several had no data to work on at all: the list payload
 * carries no tags or facilities, and the budget and Open now controls were
 * never read.
 *
 * Two things can narrow a search, so each owns its own parameters:
 *
 * - the assistant, through the query string its search produced;
 * - the manual panel, whose controls are only on screen in manual mode, and
 *   which there replaces the parameters it has controls for. Leaving the
 *   assistant's values underneath would mean the panel showed "Any rating"
 *   while the request still asked for four stars.
 *
 * The map and the toolbar sit above both panels and always apply.
 *
 * The Saved tab is the exception to all of it, being a set of slugs held in
 * this browser and nothing the backend knows about.
 */
export const listQueryString = (state: ListQueryFilters): string => {
  const params = new URLSearchParams(state.queryString);
  const set = (key: string, value: string | number) => params.set(key, String(value));

  if (!state.openAI) {
    for (const key of PANEL_OWNED) params.delete(key);
    for (const param of Object.keys(state.facets)) params.delete(param);

    const search = state.searchPlace.trim();
    if (search) set("search", search);
    if (state.searchCuisine) set("cuisine", state.searchCuisine);

    // Chip groups: one parameter each, comma-separated, matching any.
    for (const [param, slugs] of Object.entries(state.facets)) {
      if (slugs.length) set(param, slugs.join(","));
    }

    if (state.minRating > 0) set("min_rating", state.minRating);
    if (state.minBudget > 0) set("min_price", state.minBudget);
    // At the top of the slider the upper bound is "no limit", not ৳10,000.
    if (state.maxBudget < BUDGET_MAX) set("max_price", state.maxBudget);
    if (state.openNow) set("open_now", "true");
  }

  // The toolbar and the map are outside both panels, so they always apply.
  if (state.listTab === "Trending") set("is_trending", "true");
  else params.delete("is_trending");

  const ordering = ORDERING_BY_SORT[state.sortBy];
  if (ordering) set("ordering", ordering);
  else params.delete("ordering");

  const nearby = radiusSearch(state);
  if (nearby) {
    set("lat", nearby.center.lat);
    set("lng", nearby.center.lng);
    set("radius", nearby.radiusKm.toFixed(3));
  }

  if (state.selectedCity) set("city", state.selectedCity);
  if (state.selectedArea) set("area", state.selectedArea);

  return params.toString();
};
