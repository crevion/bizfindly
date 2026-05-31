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

const DEFAULT_PAGE_SIZE = 50;

export interface PlaceListParams {
  area?: string;
  trending?: boolean;
  pageSize?: number;
}

const mockGyms = mockPlaces.filter((p) => p.category === "gym");

export async function listPlaces(
  category: DiscoverCategory,
  { area, trending, pageSize = DEFAULT_PAGE_SIZE }: PlaceListParams = {},
): Promise<Place[]> {
  const city = area && area !== "All" ? area : undefined;

  if (category === "gym") {
    let list = mockGyms;
    if (city) list = list.filter((p) => p.area === city);
    if (trending) list = list.filter((p) => p.trending);
    return list;
  }

  if (category === "resort") {
    const res = await resortsApi.list({ city, is_trending: trending, page_size: pageSize });
    return res.results.map(mapResortListItem);
  }

  const res = await restaurantsApi.list({ area: city, page_size: pageSize });
  const mapped = res.results.map(mapRestaurantListItem);
  return trending ? mapped.filter((p) => p.trending) : mapped;
}

export async function getPlace(slug: string): Promise<Place | null> {
  try {
    const detail = await restaurantsApi.detail(slug);
    let menu;
    try {
      const menuRes = await restaurantsApi.menu(slug, { page_size: 100 });
      menu = menuRes.results;
    } catch {
      menu = undefined;
    }
    return mapRestaurantDetail(detail, menu);
  } catch {
    // not a restaurant
  }

  try {
    const detail = await resortsApi.detail(slug);
    return mapResortDetail(detail);
  } catch {
    // not a resort
  }

  return findMockPlace(slug) ?? null;
}

export async function getPlaceReviews(place: Place): Promise<PlaceReview[]> {
  if (place.category === "gym") return [];
  try {
    const params =
      place.category === "resort" ? { resort: place.slug } : { restaurant: place.slug };
    const res = await reviewsApi.list(params);
    return res.results.map(mapReview);
  } catch {
    return [];
  }
}
