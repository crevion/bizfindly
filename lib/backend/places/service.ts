import type { Place, PlaceReview } from "@/types/place";
import type { DiscoverCategory } from "@/content/discoverFilters";
import { places as mockPlaces, findPlace as findMockPlace } from "@/content/places";
import { restaurantsApi } from "@/lib/backend/restaurants";
import { resortsApi } from "@/lib/backend/resorts";
import { reviewsApi } from "@/lib/backend/reviews";
import {
  mapResortListItem,
  mapResortDetail,
  mapRestaurantDetail,
  mapRestaurantListItem,
  mapReview,
} from "./map";

import { gymsApi, mapGym } from "@/lib/backend/gyms/api";

const DEFAULT_PAGE_SIZE = 50;

export type BudgetTier = "budget" | "mid_range" | "premium" | "luxury";

export interface PlaceListParams {
  area?: string;
  trending?: boolean;
  pageSize?: number;
  search?: string;
  cuisine?: string;
  vibe?: string;
  occasion?: string;
  groupType?: string;
  budgetTier?: BudgetTier;
  tag?: string;
  facility?: string;
}

const mockGyms = mockPlaces.filter((p) => p.category === "gym");
const mockResorts = mockPlaces.filter((p) => p.category === "resort");
const mockRestaurants = mockPlaces.filter((p) => p.category === "restaurant");

export async function listPlaces(
  category: DiscoverCategory,
  params: PlaceListParams = {},
): Promise<Place[]> {
  const {
    area,
    trending,
    pageSize = DEFAULT_PAGE_SIZE,
    search,
    cuisine,
    vibe,
    occasion,
    groupType,
    budgetTier,
    tag,
    facility,
  } = params;
  const city = area && area !== "All" ? area : undefined;

  if (category === "gym") {
    let list = mockGyms;
    if (city)
      list = list.filter(
        (p) => p.area === city || p.location.toLowerCase().includes(city.toLowerCase()),
      );
    if (trending) list = list.filter((p) => p.trending);
    if (search?.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q),
      );
    }
    return list;
  }

  if (category === "resort") {
    try {
      const res = await resortsApi.list({
        city,
        tag,
        facility,
        search,
        is_trending: trending,
        page_size: pageSize,
      });
      const mapped = res.results.map(mapResortListItem);
      if (mapped.length > 0) return mapped;
    } catch {
      // Backend error or unavailable, fallback to mock resorts
    }

    let list = mockResorts;
    if (city)
      list = list.filter(
        (p) => p.area === city || p.location.toLowerCase().includes(city.toLowerCase()),
      );
    if (trending) list = list.filter((p) => p.trending);
    if (search?.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return list;
  }

  try {
    const res = await restaurantsApi.list({
      area: city,
      search,
      cuisine,
      vibe,
      occasion,
      group_type: groupType,
      budget_tier: budgetTier,
      page_size: pageSize,
    });
    const mapped = res.results.map(mapRestaurantListItem);
    const resultList = trending ? mapped.filter((p) => p.trending) : mapped;
    if (resultList.length > 0) return resultList;
  } catch {
    // Fallback to mock restaurants
  }

  let list = mockRestaurants;
  if (city)
    list = list.filter(
      (p) => p.area === city || p.location.toLowerCase().includes(city.toLowerCase()),
    );
  if (trending) list = list.filter((p) => p.trending);
  if (search?.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.cuisine?.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q),
    );
  }
  return list;
}

export async function getPlace(slug: string): Promise<Place | null> {
  try {
    const detail = await restaurantsApi.detail(slug);
    return mapRestaurantDetail(detail);
  } catch {
    // not a restaurant
  }

  try {
    const detail = await resortsApi.detail(slug);
    return mapResortDetail(detail);
  } catch {
    // not a resort
  }

  try {
    return mapGym(await gymsApi.detail(slug));
  } catch {
    // Not a gym or the backend is unavailable.
  }

  return findMockPlace(slug) ?? null;
}

export async function getPlaceReviews(place: Place): Promise<PlaceReview[]> {
  try {
    const params =
      place.category === "gym"
        ? { gym: place.slug }
        : place.category === "resort"
          ? { resort: place.slug }
          : { restaurant: place.slug };
    const res = await reviewsApi.list(params);
    return res.results.map(mapReview);
  } catch {
    return [];
  }
}
