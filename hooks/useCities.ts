import { useMemo } from "react";
import { City, Country, State } from "country-state-city";
import type { ICity } from "country-state-city";
import { DEFAULT_COUNTRY_CODE, stateNameToIsoCode } from "@/hooks/useStates";

export const useCities = (
  stateName: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): string[] => {
  return useMemo(() => {
    if (!stateName) return [];
    const stateIsoCode = stateNameToIsoCode(stateName, countryCode);
    if (!stateIsoCode) return [];
    return City.getCitiesOfState(countryCode, stateIsoCode).map(
      (city) => city.name,
    );
  }, [stateName, countryCode]);
};

export const getCityCoords = (
  cityName: string,
  stateName: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): { lat: number; long: number } | null => {
  if (!cityName || !stateName) return null;
  const stateIsoCode = stateNameToIsoCode(stateName, countryCode);
  if (!stateIsoCode) return null;
  const match = City.getCitiesOfState(countryCode, stateIsoCode).find(
    (city) => city.name === cityName,
  );
  if (!match?.latitude || !match?.longitude) return null;
  const lat = Number(match.latitude);
  const long = Number(match.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(long)) return null;
  return { lat, long };
};

export type WorldCitySuggestion = {
  id: string;
  name: string;
  /** Region / country label shown under the city name */
  subtitle: string;
  countryCode: string;
  stateCode: string;
  lat: number;
  lng: number;
};

let allCitiesCache: ICity[] | null = null;

function getAllCitiesCached(): ICity[] {
  if (!allCitiesCache) {
    allCitiesCache = City.getAllCities();
  }
  return allCitiesCache;
}

function cityRegionLabel(city: ICity): string {
  const country =
    Country.getCountryByCode(city.countryCode)?.name || city.countryCode;
  const state = State.getStateByCodeAndCountry(
    city.stateCode,
    city.countryCode,
  )?.name;
  return [state, country].filter(Boolean).join(", ");
}

/**
 * Search cities worldwide (country-state-city). Requires 2+ characters.
 * Prefers name prefix matches, then substring matches.
 */
export function searchWorldCities(
  query: string,
  limit = 12,
): WorldCitySuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const cities = getAllCitiesCached();
  const prefix: WorldCitySuggestion[] = [];
  const substring: WorldCitySuggestion[] = [];

  for (const city of cities) {
    const name = city.name?.trim();
    if (!name) continue;
    const lower = name.toLowerCase();
    const isPrefix = lower.startsWith(q);
    if (!isPrefix && !lower.includes(q)) continue;

    const lat = Number(city.latitude);
    const lng = Number(city.longitude);
    const suggestion: WorldCitySuggestion = {
      id: `city-${city.countryCode}-${city.stateCode}-${name}`
        .toLowerCase()
        .replace(/\s+/g, "-"),
      name,
      subtitle: cityRegionLabel(city),
      countryCode: city.countryCode,
      stateCode: city.stateCode,
      lat: Number.isFinite(lat) ? lat : 0,
      lng: Number.isFinite(lng) ? lng : 0,
    };

    if (isPrefix) {
      prefix.push(suggestion);
      if (prefix.length >= limit) break;
    } else if (substring.length + prefix.length < limit * 2) {
      substring.push(suggestion);
    }
  }

  if (prefix.length >= limit) return prefix.slice(0, limit);
  return [...prefix, ...substring].slice(0, limit);
}
