"use client";

import type { Place } from "@/types/place";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/backend/auth";
import { savedApi, savedItemToPlace } from "@/lib/backend/saved/api";
import { usePlaceFinderStore } from "./usePlaceFinderStore";

async function fetchSavedPlaces(): Promise<Place[]> {
  const savedPlaces: Place[] = [];
  let pageNumber = 1;

  // Read every page so bookmarks are recognized beyond the first saved page.
  while (true) {
    const page = await savedApi.list(pageNumber);
    for (const item of page.results) {
      savedPlaces.push(savedItemToPlace(item));
    }
    if (!page.next) {
      return savedPlaces;
    }
    pageNumber += 1;
  }
}

export function useSyncSavedPlaces() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setSavedPlaces = usePlaceFinderStore((state) => state.setSavedPlaces);
  const signedIn = Boolean(token && user && hydrated);
  const query = useQuery({
    queryKey: ["saved-places", token, "finder"],
    queryFn: fetchSavedPlaces,
    enabled: signedIn,
    retry: false,
  });

  useEffect(() => {
    // Clear the previous account's bookmarks on sign-out or account changes.
    const savedPlaces = signedIn ? (query.data ?? []) : [];
    setSavedPlaces(savedPlaces);
  }, [signedIn, query.data, setSavedPlaces]);

  return query;
}
