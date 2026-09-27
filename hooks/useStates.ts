import { useMemo } from "react";
import { State } from "country-state-city";

// Default country to source state/province lists from.
// Change this single constant (or pass a country code per call) to go worldwide.
export const DEFAULT_COUNTRY_CODE = "US";

export interface StateOption {
  name: string;
  isoCode: string;
}

export const useStates = (
  countryCode: string = DEFAULT_COUNTRY_CODE,
): StateOption[] => {
  return useMemo(
    () =>
      State.getStatesOfCountry(countryCode).map(({ name, isoCode }) => ({
        name,
        isoCode,
      })),
    [countryCode],
  );
};

export const stateNameToIsoCode = (
  stateName: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): string | null => {
  if (!stateName) return null;
  const match = State.getStatesOfCountry(countryCode).find(
    (state) => state.name === stateName,
  );
  return match?.isoCode ?? null;
};

export const getStateCoords = (
  stateName: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): { lat: number; long: number } | null => {
  if (!stateName) return null;
  const match = State.getStatesOfCountry(countryCode).find(
    (state) => state.name === stateName,
  );
  if (!match?.latitude || !match?.longitude) return null;
  const lat = Number(match.latitude);
  const long = Number(match.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(long)) return null;
  return { lat, long };
};
