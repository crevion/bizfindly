import { apiClient, buildQuery } from "@/lib/backend/api";
import type { BusinessType } from "@/components/ai-finder/businessTypes";

/** A city or an area, with the middle of its own listings. */
export interface LocationPlace {
  name: string;
  count: number;
  latitude: number | null;
  longitude: number | null;
}

export interface LocationCity extends LocationPlace {
  areas: LocationPlace[];
}

export const locationsApi = {
  /**
   * The cities and areas a visitor can filter by.
   *
   * With a `category` the counts and centres cover only that business type,
   * which is what the finder wants: the centre a gym search measures its
   * radius from should be where the gyms are, not where every listing is.
   */
  list: (category?: BusinessType) =>
    apiClient<{ cities: LocationCity[] }>(`/locations/${buildQuery({ category })}`),
};

/**
 * Coordinates for the chosen area, else the chosen city, else null.
 *
 * Both come from the listings themselves, so "Dhanmondi" means where the
 * Dhanmondi listings actually are -- which is what the radius is measured from.
 */
export function centerOfSelection(
  cities: LocationCity[],
  city: string,
  area: string,
): { lat: number; lng: number } | null {
  const match = cities.find((entry) => entry.name.toLowerCase() === city.toLowerCase());
  const place =
    (area && match?.areas.find((a) => a.name.toLowerCase() === area.toLowerCase())) || match;
  if (!place || place.latitude === null || place.longitude === null) return null;
  return { lat: place.latitude, lng: place.longitude };
}
