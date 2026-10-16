"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/backend/auth";
import { savedApi, savedItemToPlace } from "@/lib/backend/saved/api";
import { usePlaceFinderStore } from "./usePlaceFinderStore";

async function fetchSavedPlaceIds(): Promise<string[]> {
  const savedPlaceIds: string[] = [];
  let pageNumber = 1;

  // Read every page so bookmarks are recognized beyond the first saved page.
  while (true) {
    const page = await savedApi.list(pageNumber);
    for (const item of page.results) {
      savedPlaceIds.push(savedItemToPlace(item).id);
    }
    if (!page.next) {
      return savedPlaceIds;
    }
    pageNumber += 1;
  }
}

export function useSyncSavedPlaces() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setSavedPlaceIds = usePlaceFinderStore((state) => state.setSavedPlaceIds);
  const signedIn = Boolean(token && user && hydrated);
  const query = useQuery({
    queryKey: ["saved-places", token, "finder"],
    queryFn: fetchSavedPlaceIds,
    enabled: signedIn,
    retry: false,
  });

  useEffect(() => {
    // Clear the previous account's bookmarks on sign-out or account changes.
    const savedPlaceIds = signedIn ? (query.data ?? []) : [];
    setSavedPlaceIds(savedPlaceIds);
  }, [signedIn, query.data, setSavedPlaceIds]);

  return query;
}
