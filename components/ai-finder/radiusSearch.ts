import { DEFAULT_MAP_CENTER, MILES_TO_KM, type MapCenter } from "./constants";
import { centerOfSelection, type LocationCity } from "@/lib/backend/locations/api";

/** The filters that decide what the map asks the backend for. */
export interface RadiusFilters {
  selectedCity: string;
  selectedArea: string;
  range: number;
  unit: "km" | "miles";
  /** Middle of the listings on screen, used when nothing has been picked. */
  placesCenter?: MapCenter | null;
  /** Cities and areas as the backend reports them, with their centres. */
  locations?: LocationCity[];
}

/**
 * Where the map sits and what a radius is measured from: an explicit area or
 * city first, otherwise the middle of the listings themselves, and only then a
 * fixed fallback. Centring on the data matters -- the listings cluster several
 * kilometres from the generic city point, so a small radius around that point
 * would find nothing and look broken.
 */
export const searchCenter = (state: RadiusFilters): MapCenter =>
  centerOfSelection(state.locations ?? [], state.selectedCity, state.selectedArea) ??
  state.placesCenter ??
  DEFAULT_MAP_CENTER;

/** Mean position of the places that have been pinned; null if none are. */
export const centerOfPlaces = (
  places: { coords?: { lat: number; lng: number } }[],
): MapCenter | null => {
  const points = places.map((place) => place.coords).filter((c) => !!c);
  if (!points.length) return null;
  return {
    lat: points.reduce((sum, c) => sum + c.lat, 0) / points.length,
    lng: points.reduce((sum, c) => sum + c.lng, 0) / points.length,
  };
};

/**
 * The radius search the current filters describe, or null when the map should
 * not constrain the results.
 *
 * The centre falls back to the same default the map falls back to, so moving
 * the slider filters straight away: the circle drawn on the map and the circle
 * the backend filters by are always the one circle. Coordinates are only sent
 * alongside a radius -- sending them on their own would re-sort everything by
 * distance, which is not what an untouched slider implies.
 */
export const radiusSearch = (
  state: RadiusFilters,
): { center: MapCenter; radiusKm: number } | null => {
  if (state.range <= 0) return null;
  return {
    center: searchCenter(state),
    radiusKm: state.unit === "miles" ? state.range * MILES_TO_KM : state.range,
  };
};

/**
 * Query string for a listing request: whatever the AI search settled on, plus
 * the map's radius when one is set.
 */
export const listQueryString = (state: RadiusFilters & { queryString: string }): string => {
  const params = new URLSearchParams(state.queryString);
  const search = radiusSearch(state);
  if (search) {
    params.set("lat", String(search.center.lat));
    params.set("lng", String(search.center.lng));
    params.set("radius", search.radiusKm.toFixed(3));
  }
  return params.toString();
};

