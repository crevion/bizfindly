import { apiClient, type Paginated } from "@/lib/backend/api";
import type { RestaurantListItem } from "@/lib/backend/restaurants";
import type { ResortListItem } from "@/lib/backend/resorts";
import { mapGym, type GymListItem } from "@/lib/backend/gyms/api";
import { mapResortListItem, mapRestaurantListItem } from "@/lib/backend/places/map";
import {
  businessTypeConfig,
  type BusinessType,
} from "@/components/ai-finder/businessTypes";
import type { Place } from "@/types/place";

export interface AiPlaceQuery {
  query: string;
  category: BusinessType;
  /** Listing path the query string belongs to, e.g. "/resorts/". */
  path: string;
  params: Record<string, string | number | boolean>;
  query_string: string;
}

/** One page of listings, whichever business type it came from. */
export type PlaceListItem = RestaurantListItem | ResortListItem | GymListItem;

const MAPPERS: Record<BusinessType, (item: PlaceListItem) => Place> = {
  restaurant: (item) => mapRestaurantListItem(item as RestaurantListItem),
  resort: (item) => mapResortListItem(item as ResortListItem),
  gym: (item) => mapGym(item as GymListItem),
};

/**
 * A listing from any of the three endpoints, as the one shape the UI renders.
 *
 * The caller knows the type because it asked for it -- the payloads
 * themselves carry no category field, so this cannot be inferred.
 */
export const mapPlaceListItem = (type: BusinessType, item: PlaceListItem): Place =>
  MAPPERS[type](item);

const listingPath = (type: BusinessType) => `/${businessTypeConfig(type).plural}/`;

export const aiPlacesApi = {
  /** Turn a natural language search into query params for this type's listing. */
  interpret: (query: string, category: BusinessType) =>
    apiClient<AiPlaceQuery>("/ai-query/search/", {
      method: "POST",
      body: { query, category },
    }),

  list: (type: BusinessType, queryString = "") =>
    apiClient<Paginated<PlaceListItem>>(
      `${listingPath(type)}${queryString ? `?${queryString.replace(/^\?/, "")}` : ""}`,
    ),
};
