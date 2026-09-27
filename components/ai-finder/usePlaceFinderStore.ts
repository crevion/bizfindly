"use client";

import { create } from "zustand";
import type { Place } from "@/types/place";
import { streamChat } from "@/lib/backend/ai/chat";
import { aiRestaurantsApi } from "@/lib/backend/ai/api";
import { mapRestaurantListItem } from "@/lib/backend/places/map";
import {
  BUDGET_MAX,
  DEFAULT_LIST_TAB,
  DEFAULT_SORT,
  type ListTab,
  type SortOption,
} from "./constants";
import { centerOfPlaces, listQueryString, radiusSearch } from "./radiusSearch";
import type { UrlFilters } from "./filterParams";
import { locationsApi, type LocationCity } from "@/lib/backend/locations/api";
import type { MapCenter } from "./constants";

export interface ChatMessage {
  type: "user" | "ai";
  text: string;
  recommendedPlaces?: Place[];
  incomplete?: boolean;
}

interface PlaceFinderState {
  openAI: boolean;
  searchPlace: string;
  searchCategory: "all" | "restaurant" | "resort" | "gym";
  searchCuisine: string;
  selectedArea: string;
  selectedCity: string;
  minBudget: number;
  maxBudget: number;
  minRating: number;
  openNow: boolean;
  selectedVibes: string[];
  range: number;
  unit: "km" | "miles";
  /** Middle of the unfiltered listings; the map and radius centre on it. */
  placesCenter: MapCenter | null;
  /** Cities and areas that actually have listings. */
  locations: LocationCity[];
  listTab: ListTab;
  sortBy: SortOption;
  allPlaces: Place[];
  visiblePlaces: Place[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  initialized: boolean;
  error: string | null;
  errorSource: "chat" | "list" | "more" | null;
  lastQuery: string;
  nextQuery: string | null;
  resultCount: number;
  chatInput: string;
  chatMessages: ChatMessage[];
  isAiResponding: boolean;
  chatStatus: string;
  queryString: string;
  stopChat: () => void;
  selectedPlaceId: string | null;
  savedPlaceIds: Set<string>;

  setOpenAI: (val: boolean) => void;
  setSearchPlace: (val: string) => void;
  setSearchCategory: (val: "all" | "restaurant" | "resort" | "gym") => void;
  setSearchCuisine: (val: string) => void;
  setSelectedArea: (val: string) => void;
  setSelectedCity: (val: string) => void;
  setMinBudget: (val: number) => void;
  setMaxBudget: (val: number) => void;
  setMinRating: (val: number) => void;
  setOpenNow: (val: boolean) => void;
  toggleVibe: (vibe: string) => void;
  setRange: (val: number) => void;
  setUnit: (val: "km" | "miles") => void;
  setListTab: (tab: ListTab) => void;
  setSortBy: (sort: SortOption) => void;
  toggleSavedPlace: (placeId: string) => void;
  toggleSelectedPlace: (placeId: string) => void;
  clearSelectedPlace: () => void;
  setChatInput: (val: string) => void;
  sendChatMessage: (customText?: string) => Promise<void>;
  clearChat: () => void;
  clearFilters: () => void;
  applyUrlFilters: (filters: Partial<UrlFilters>) => void;
  initializePlaces: () => Promise<void>;
  loadLocations: () => Promise<void>;
  fetchPlaces: () => Promise<void>;
  loadMorePlaces: () => Promise<void>;
}

const sortPlacesList = (list: Place[], sortBy: SortOption): Place[] => {
  const arr = [...list];
  switch (sortBy) {
    case "Rating: High to Low":
      return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "Price: Low to High":
      return arr.sort((a, b) => (a.priceLevel || 1) - (b.priceLevel || 1));
    case "Price: High to Low":
      return arr.sort((a, b) => (b.priceLevel || 1) - (a.priceLevel || 1));
    case "Most Reviews":
      return arr.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    default:
      return arr;
  }
};

const filterPlacesList = (state: PlaceFinderState, rawList: Place[]): Place[] => {
  let list = rawList;

  if (state.searchCategory !== "all") {
    list = list.filter((p) => p.category === state.searchCategory);
  }

  if (state.searchPlace.trim()) {
    const q = state.searchPlace.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.area?.toLowerCase().includes(q) ||
        p.cuisine?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (state.searchCuisine) {
    const c = state.searchCuisine.toLowerCase();
    list = list.filter((p) => p.cuisine?.toLowerCase().includes(c));
  }

  // With a radius active the backend already decided what is nearby, and a
  // place 2 km away may well sit in a neighbouring area -- so only fall back to
  // matching the area/city text when no radius is in play.
  if (!radiusSearch(state)) {
    if (state.selectedArea) {
      list = list.filter(
        (p) =>
          p.area?.toLowerCase() === state.selectedArea.toLowerCase() ||
          p.location?.toLowerCase().includes(state.selectedArea.toLowerCase()),
      );
    } else if (state.selectedCity) {
      list = list.filter((p) =>
        p.location?.toLowerCase().includes(state.selectedCity.toLowerCase()),
      );
    }
  }

  if (state.selectedVibes.length > 0) {
    list = list.filter((p) =>
      state.selectedVibes.some(
        (v) =>
          p.tags?.some((t) => t.toLowerCase().includes(v.toLowerCase())) ||
          p.facilities?.some((f) => f.toLowerCase().includes(v.toLowerCase())),
      ),
    );
  }

  if (state.minRating > 0) {
    list = list.filter((p) => p.rating >= state.minRating);
  }

  if (state.listTab === "Trending") {
    list = list.filter((p) => p.trending);
  } else if (state.listTab === "Saved") {
    list = list.filter((p) => state.savedPlaceIds.has(p.id));
  }

  return sortPlacesList(list, state.sortBy);
};

// Dragging the slider fires continuously; only the resting value deserves a request.
const RADIUS_DEBOUNCE_MS = 350;
let radiusTimer: ReturnType<typeof setTimeout> | null = null;
const refetchAfterPause = (run: () => void) => {
  if (radiusTimer) clearTimeout(radiusTimer);
  radiusTimer = setTimeout(() => {
    radiusTimer = null;
    run();
  }, RADIUS_DEBOUNCE_MS);
};

/**
 * How many places the current search matches, for the count beside the "All"
 * tab.
 *
 * Two things it must not do: follow the open tab (switching to Trending would
 * otherwise relabel "All" with the trending count), and report the size of the
 * page in memory (the API returns 20 at a time, so 27 matches read as 20).
 * When no client-side filter has narrowed the loaded page, the server's total
 * is the honest answer because the rest simply has not been fetched yet.
 */
export const selectAllCount = (state: PlaceFinderState): number => {
  const matching = filterPlacesList(
    { ...state, listTab: "All" },
    state.allPlaces,
  ).length;
  return matching === state.allPlaces.length
    ? Math.max(state.resultCount, matching)
    : matching;
};

// Ignore older requests when a new search or reset replaces them.
let requestVersion = 0;
let chatController: AbortController | null = null;
const nextQueryString = (next: string | null) =>
  next ? new URL(next, "http://localhost").search.slice(1) : null;

export const usePlaceFinderStore = create<PlaceFinderState>((set, get) => ({
  openAI: true,
  searchPlace: "",
  searchCategory: "all",
  searchCuisine: "",
  selectedArea: "",
  selectedCity: "",
  minBudget: 0,
  maxBudget: BUDGET_MAX,
  minRating: 0,
  openNow: false,
  selectedVibes: [],
  range: 0,
  unit: "km",
  placesCenter: null,
  locations: [],
  listTab: DEFAULT_LIST_TAB,
  sortBy: DEFAULT_SORT,
  allPlaces: [],
  visiblePlaces: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: false,
  initialized: false,
  error: null,
  errorSource: null,
  lastQuery: "",
  nextQuery: null,
  resultCount: 0,
  chatInput: "",
  chatMessages: [],
  isAiResponding: false,
  chatStatus: "",
  queryString: "",
  selectedPlaceId: null,
  savedPlaceIds: new Set<string>(),

  setOpenAI: (val) => set({ openAI: val }),
  setSearchPlace: (val) => {
    set({ searchPlace: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setSearchCategory: (val) => {
    set({ searchCategory: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setSearchCuisine: (val) => {
    set({ searchCuisine: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setSelectedArea: (val) => {
    const before = radiusSearch(get());
    set({ selectedArea: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
    if (before || radiusSearch(get())) void get().fetchPlaces();
  },
  setSelectedCity: (val) => {
    const before = radiusSearch(get());
    set({ selectedCity: val, selectedArea: "" });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
    if (before || radiusSearch(get())) void get().fetchPlaces();
  },
  setMinBudget: (val) => {
    set({ minBudget: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setMaxBudget: (val) => {
    set({ maxBudget: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setMinRating: (val) => {
    set({ minRating: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setOpenNow: (val) => {
    set({ openNow: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  toggleVibe: (vibe) => {
    const current = get().selectedVibes;
    const next = current.includes(vibe) ? current.filter((v) => v !== vibe) : [...current, vibe];
    set({ selectedVibes: next });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setRange: (val) => {
    const before = radiusSearch(get());
    set({ range: val });
    if (before || radiusSearch(get())) refetchAfterPause(() => void get().fetchPlaces());
  },
  setUnit: (val) => {
    const before = radiusSearch(get());
    set({ unit: val });
    if (before || radiusSearch(get())) refetchAfterPause(() => void get().fetchPlaces());
  },
  setListTab: (tab) => {
    set({ listTab: tab });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setSortBy: (sort) => {
    set({ sortBy: sort });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  toggleSavedPlace: (placeId) => {
    const current = new Set(get().savedPlaceIds);
    if (current.has(placeId)) {
      current.delete(placeId);
    } else {
      current.add(placeId);
    }
    set({ savedPlaceIds: current });
    if (get().listTab === "Saved") {
      const filtered = filterPlacesList(get(), get().allPlaces);
      set({ visiblePlaces: filtered });
    }
  },
  toggleSelectedPlace: (placeId) => {
    const current = get().selectedPlaceId;
    if (current === placeId) {
      set({ selectedPlaceId: null });
    } else {
      set({
        selectedPlaceId: placeId,
        openAI: true,
      });
      const selected = get().allPlaces.find((p) => p.id === placeId);
      if (selected) {
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              type: "ai",
              text: `I've pinned **${selected.name}** (${selected.area}). Open its details to see the menu, pricing and hours.`,
            },
          ],
        }));
      }
    }
  },
  clearSelectedPlace: () => set({ selectedPlaceId: null }),
  setChatInput: (val) => set({ chatInput: val }),

  sendChatMessage: async (customText?: string) => {
    const text = (customText ?? get().chatInput).trim();
    if (!text || get().isAiResponding) return;
    const version = ++requestVersion;
    chatController?.abort();
    const controller = new AbortController();
    chatController = controller;
    const before = get();
    const history = before.chatMessages
      .filter((message) => message.text && !message.incomplete)
      .slice(-12)
      .map((message) => ({
        role: message.type === "user" ? ("user" as const) : ("assistant" as const),
        content: message.text.slice(0, 8000),
      }));
    const selected = before.allPlaces.find((place) => place.id === before.selectedPlaceId);
    const replyIndex = before.chatMessages.length + 1;
    set({
      chatMessages: [
        ...before.chatMessages,
        { type: "user", text },
        { type: "ai", text: "", incomplete: true },
      ],
      chatInput: "",
      lastQuery: text,
      openAI: true,
      isAiResponding: true,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      chatStatus: "Thinking…",
    });
    try {
      await streamChat(
        {
          message: text,
          history,
          selected_slug: selected?.slug,
          restaurant_slugs: before.visiblePlaces.slice(0, 10).map((place) => place.slug),
          previous_query_string: before.queryString,
        },
        (event) => {
          if (version !== requestVersion) return;
          if (event.type === "status") {
            set({ chatStatus: event.text });
            if (event.text === "Looking for restaurants…") set({ isLoading: true });
          }
          if (event.type === "delta") {
            set((state) => ({
              chatMessages: state.chatMessages.map((message, index) =>
                index === replyIndex ? { ...message, text: message.text + event.text } : message,
              ),
            }));
          }
          if (event.type === "results") {
            const places = event.results.map(mapRestaurantListItem);
            set((state) => ({
              allPlaces: places,
              visiblePlaces: places,
              isLoading: false,
              selectedPlaceId: places.some((place) => place.id === state.selectedPlaceId)
                ? state.selectedPlaceId
                : null,
              resultCount: event.count,
              queryString: event.query_string,
              nextQuery: nextQueryString(event.next),
              hasMore: Boolean(event.next),
              searchPlace: "",
              searchCategory: "restaurant",
              searchCuisine: "",
              selectedCity: "",
              selectedArea: "",
              selectedVibes: [],
              minRating: 0,
              minBudget: 0,
              maxBudget: BUDGET_MAX,
              openNow: false,
              listTab: DEFAULT_LIST_TAB,
              sortBy: DEFAULT_SORT,
              chatMessages: state.chatMessages.map((message, index) =>
                index === replyIndex
                  ? { ...message, recommendedPlaces: places.slice(0, 3) }
                  : message,
              ),
            }));
          }
          if (event.type === "done") {
            set((state) => ({
              chatMessages: state.chatMessages.map((message, index) =>
                index === replyIndex ? { ...message, incomplete: false } : message,
              ),
            }));
          }
        },
        controller.signal,
      );
    } catch (error) {
      if (version !== requestVersion || controller.signal.aborted) return;
      set({
        errorSource: "chat",
        error: error instanceof Error ? error.message : "Chat failed. Please try again.",
      });
    } finally {
      if (version === requestVersion) {
        chatController = null;
        set({ isLoading: false, isAiResponding: false, chatStatus: "" });
      }
    }
  },

  stopChat: () => {
    ++requestVersion;
    chatController?.abort();
    chatController = null;
    set({ isAiResponding: false, isLoading: false, chatStatus: "" });
  },

  clearChat: () => {
    get().stopChat();
    set({
      chatMessages: [],
      queryString: "",
      chatInput: "",
      isAiResponding: false,
      selectedPlaceId: null,
    });
    get().clearFilters();
    void get().fetchPlaces();
  },

  clearFilters: () => {
    const hadRadius = Boolean(radiusSearch(get()));
    set({
      searchPlace: "",
      searchCategory: "all",
      searchCuisine: "",
      selectedArea: "",
      selectedCity: "",
      minBudget: 0,
      maxBudget: BUDGET_MAX,
      minRating: 0,
      openNow: false,
      selectedVibes: [],
      range: 0,
      listTab: DEFAULT_LIST_TAB,
      sortBy: DEFAULT_SORT,
    });
    set({ visiblePlaces: get().allPlaces });
    // The list was narrowed server-side, so it needs refetching to widen again.
    if (hadRadius) void get().fetchPlaces();
  },

  applyUrlFilters: (filters) => {
    // One batched set: going through the individual setters would fire a
    // request per filter before the page has fetched anything at all.
    set(filters);
    set({ visiblePlaces: filterPlacesList(get(), get().allPlaces) });
  },

  loadLocations: async () => {
    if (get().locations.length) return;
    try {
      const { cities } = await locationsApi.list();
      set({ locations: cities });
    } catch {
      // The selects fall back to being empty; the map still works off the
      // centre of whatever listings loaded.
    }
  },

  initializePlaces: async () => {
    if (get().initialized) return;
    set({ initialized: true, isLoading: true });
    void get().loadLocations();
    await get().fetchPlaces();
  },

  fetchPlaces: async () => {
    const version = ++requestVersion;
    set({
      isLoading: true,
      isLoadingMore: false,
      isAiResponding: false,
      error: null,
      lastQuery: "",
      hasMore: false,
      nextQuery: null,
    });
    try {
      const response = await aiRestaurantsApi.list(listQueryString(get()));
      if (version !== requestVersion) return;
      const places = response.results.map(mapRestaurantListItem);
      set({
        allPlaces: places,
        visiblePlaces: filterPlacesList(get(), places),
        resultCount: response.count,
        nextQuery: nextQueryString(response.next),
        hasMore: Boolean(response.next),
        // Only an unfiltered response describes where the listings really are;
        // a radius result would just re-centre on itself and drift.
        placesCenter: radiusSearch(get())
          ? get().placesCenter
          : (centerOfPlaces(places) ?? get().placesCenter),
      });
    } catch (error) {
      if (version !== requestVersion) return;
      set({
        allPlaces: [],
        visiblePlaces: [],
        resultCount: 0,
        errorSource: "list",
        error: error instanceof Error ? error.message : "Could not load restaurants.",
      });
    } finally {
      if (version === requestVersion) set({ isLoading: false });
    }
  },

  loadMorePlaces: async () => {
    const { nextQuery, isLoading, isLoadingMore } = get();
    if (!nextQuery || isLoading || isLoadingMore || get().isAiResponding) return;
    const version = requestVersion;
    set({ isLoadingMore: true, error: null });
    try {
      const response = await aiRestaurantsApi.list(nextQuery);
      if (version !== requestVersion) return;
      const places = [
        ...new Map(
          [...get().allPlaces, ...response.results.map(mapRestaurantListItem)].map((place) => [
            place.id,
            place,
          ]),
        ).values(),
      ];
      set({
        allPlaces: places,
        visiblePlaces: filterPlacesList(get(), places),
        nextQuery: nextQueryString(response.next),
        hasMore: Boolean(response.next),
        resultCount: response.count,
      });
    } catch (error) {
      if (version === requestVersion)
        set({ error: error instanceof Error ? error.message : "Could not load more restaurants." });
    } finally {
      if (version === requestVersion) set({ isLoadingMore: false });
    }
  },
}));
