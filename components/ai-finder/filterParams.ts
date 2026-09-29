import {
  BUDGET_MAX,
  DEFAULT_LIST_TAB,
  DEFAULT_SORT,
  LIST_TABS,
  SORT_OPTIONS,
  type ListTab,
  type SortOption,
} from "./constants";
import {
  BUSINESS_TYPES,
  DEFAULT_BUSINESS_TYPE,
  FACET_PARAMS,
  type BusinessType,
} from "./businessTypes";

const UNITS = ["km", "miles"] as const;

const MAX_RANGE = 100;
const MAX_RATING = 5;

/** The slice of the finder's state that belongs in the address bar. */
export interface UrlFilters {
  searchPlace: string;
  businessType: BusinessType;
  searchCuisine: string;
  selectedCity: string;
  selectedArea: string;
  range: number;
  unit: (typeof UNITS)[number];
  minRating: number;
  minBudget: number;
  maxBudget: number;
  /** Listing filter parameter -> the slugs picked in that chip group. */
  facets: Record<string, string[]>;
  openNow: boolean;
  listTab: ListTab;
  sortBy: SortOption;
}

/**
 * Filters as query parameters. Only what differs from the default is written,
 * so an untouched page keeps a clean URL and a shared link carries exactly the
 * filters someone chose.
 */
export function filtersToParams(filters: UrlFilters): URLSearchParams {
  const params = new URLSearchParams();
  const put = (key: string, value: string | number, isDefault: boolean) => {
    if (!isDefault) params.set(key, String(value));
  };

  put("q", filters.searchPlace.trim(), !filters.searchPlace.trim());
  put("type", filters.businessType, filters.businessType === DEFAULT_BUSINESS_TYPE);
  put("cuisine", filters.searchCuisine.trim(), !filters.searchCuisine.trim());
  put("city", filters.selectedCity, !filters.selectedCity);
  put("area", filters.selectedArea, !filters.selectedArea);
  put("radius", filters.range, filters.range <= 0);
  // The unit only changes what the radius means, so it travels with it.
  put("unit", filters.unit, filters.unit === "km" || filters.range <= 0);
  put("rating", filters.minRating, filters.minRating <= 0);
  put("budget_min", filters.minBudget, filters.minBudget <= 0);
  put("budget_max", filters.maxBudget, filters.maxBudget >= BUDGET_MAX);
  // Each chip group travels under its own listing filter name, so a shared
  // link reads ?vibe=rooftop&facility=pool -- the words the API uses.
  for (const param of FACET_PARAMS) {
    const slugs = filters.facets[param] ?? [];
    put(param, slugs.join(","), !slugs.length);
  }
  put("open", 1, !filters.openNow);
  put("tab", filters.listTab, filters.listTab === DEFAULT_LIST_TAB);
  put("sort", filters.sortBy, filters.sortBy === DEFAULT_SORT);
  return params;
}

const oneOf = <T extends string>(value: string | null, allowed: readonly T[]): T | undefined =>
  value && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;

const number = (value: string | null, max: number): number | undefined => {
  if (value === null) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.min(parsed, max);
};

/**
 * Filters carried by a URL. Anything missing, malformed or out of range is
 * left out rather than guessed at, so the store keeps its default -- a
 * hand-edited link can't push the UI into a state it has no controls for.
 */
export function paramsToFilters(params: URLSearchParams): Partial<UrlFilters> {
  const filters: Partial<UrlFilters> = {};
  const text = (key: string) => params.get(key)?.trim() || undefined;

  const q = text("q");
  if (q) filters.searchPlace = q;

  // `category` is the parameter this used to be called, back when it also
  // accepted "all"; links carrying it should still open on the right type.
  const type = oneOf(params.get("type") ?? params.get("category"), BUSINESS_TYPES);
  if (type) filters.businessType = type;

  const cuisine = text("cuisine");
  if (cuisine) filters.searchCuisine = cuisine;

  const city = text("city");
  if (city) filters.selectedCity = city;

  const area = text("area");
  if (area) filters.selectedArea = area;

  const range = number(params.get("radius"), MAX_RANGE);
  if (range !== undefined) filters.range = range;

  const unit = oneOf(params.get("unit"), UNITS);
  if (unit) filters.unit = unit;

  const rating = number(params.get("rating"), MAX_RATING);
  if (rating !== undefined) filters.minRating = rating;

  const budgetMin = number(params.get("budget_min"), BUDGET_MAX);
  if (budgetMin !== undefined) filters.minBudget = budgetMin;

  const budgetMax = number(params.get("budget_max"), BUDGET_MAX);
  if (budgetMax !== undefined) filters.maxBudget = budgetMax;

  const facets: Record<string, string[]> = {};
  for (const param of FACET_PARAMS) {
    const slugs = text(param)
      ?.split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);
    if (slugs?.length) facets[param] = slugs;
  }
  if (Object.keys(facets).length) filters.facets = facets;

  if (params.get("open") === "1") filters.openNow = true;

  const tab = oneOf(params.get("tab"), LIST_TABS);
  if (tab) filters.listTab = tab;

  const sort = oneOf(params.get("sort"), SORT_OPTIONS);
  if (sort) filters.sortBy = sort;

  return filters;
}
