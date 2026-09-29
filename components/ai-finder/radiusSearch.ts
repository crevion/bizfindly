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
  /** Where the browser says the visitor is, once they have allowed it. */
  userLocation?: MapCenter | null;
  /** Cities and areas as the backend reports them, with their centres. */
  locations?: LocationCity[];
}

/**
 * Where the map sits and what a radius is measured from.
 *
 * An area or city the visitor picked wins, because they said it out loud.
 * Failing that it is wherever the browser says they are, which is the useful
 * default for "what is near me". Then the middle of the listings themselves --
 * centring on the data matters, since listings cluster several kilometres from
 * the generic city point and a small radius around that point would find
 * nothing and look broken -- and only then a fixed fallback.
 */
export const searchCenter = (state: RadiusFilters): MapCenter => {
  const picked = centerOfSelection(
    state.locations ?? [],
    state.selectedCity,
    state.selectedArea,
  );
  if (picked) return picked;
  // Naming a city or area means "not near me", so the visitor's own position
  // is skipped even here -- where that place has no centre yet because the
  // locations payload has not arrived. Falling through to it would quietly
  // search around the visitor while the card said Dhaka.
  if (state.selectedCity || state.selectedArea) {
    return state.placesCenter ?? DEFAULT_MAP_CENTER;
  }
  return state.userLocation ?? state.placesCenter ?? DEFAULT_MAP_CENTER;
};

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
 * the city, area and radius the map is set to.
 *
 * City and area go to the backend rather than being matched in the browser.
 * Only the loaded page could be filtered here -- 20 of possibly hundreds of
 * listings -- so picking an area would appear to find almost nothing, and the
 * result count beside the tabs would still describe the wider search.
 */
export const listQueryString = (state: RadiusFilters & { queryString: string }): string => {
  const params = new URLSearchParams(state.queryString);
  if (state.selectedCity) params.set("city", state.selectedCity);
  if (state.selectedArea) params.set("area", state.selectedArea);
  const search = radiusSearch(state);
  if (search) {
    params.set("lat", String(search.center.lat));
    params.set("lng", String(search.center.lng));
    params.set("radius", search.radiusKm.toFixed(3));
  }
  return params.toString();
};

