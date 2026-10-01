"use client";

import { create } from "zustand";
import type { Place } from "@/types/place";
import { streamChat } from "@/lib/backend/ai/chat";
import { aiPlacesApi, mapPlaceListItem } from "@/lib/backend/ai/api";
import {
  businessTypeConfig,
  DEFAULT_BUSINESS_TYPE,
  type BusinessType,
} from "./businessTypes";
import {
  BUDGET_MAX,
  DEFAULT_LIST_TAB,
  DEFAULT_SORT,
  type ListTab,
  type SortOption,
} from "./constants";
import { centerOfPlaces, radiusSearch } from "./radiusSearch";
import { listQueryString } from "./listQuery";
import {
  geolocationAvailable,
  geolocationPermission,
  requestGeolocation,
  type GeoStatus,
} from "./geolocation";
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
  /** Which listings the page is showing: restaurants, resorts or gyms. */
  businessType: BusinessType;
  searchCuisine: string;
  selectedArea: string;
  selectedCity: string;
  minBudget: number;
  maxBudget: number;
  minRating: number;
  openNow: boolean;
  /** Listing filter parameter -> the slugs picked in that chip group. */
  facets: Record<string, string[]>;
  range: number;
  unit: "km" | "miles";
  /** Middle of the unfiltered listings; the map and radius centre on it. */
  placesCenter: MapCenter | null;
  /** Where the browser says the visitor is, once they have allowed it. */
  userLocation: MapCenter | null;
  geoStatus: GeoStatus;
  /** Why locating failed, in the browser's own words, when it said. */
  geoMessage: string | null;
  /** Cities and areas that actually have listings, for the current type. */
  locations: LocationCity[];
  /** The type `locations` was loaded for, so a type change reloads them. */
  locationsType: BusinessType | null;
  listTab: ListTab;
  sortBy: SortOption;
  allPlaces: Place[];
  visiblePlaces: Place[];
  /** Every match for the current search (up to 500), for the map pins. */
  mapPlaces: Place[];
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
  setBusinessType: (val: BusinessType) => void;
  setSearchCuisine: (val: string) => void;
  setSelectedArea: (val: string) => void;
  setSelectedCity: (val: string) => void;
  setMinBudget: (val: number) => void;
  setMaxBudget: (val: number) => void;
  setMinRating: (val: number) => void;
  setOpenNow: (val: boolean) => void;
  toggleFacet: (param: string, slug: string) => void;
  clearFacets: () => void;
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
  /** Ask the browser where the visitor is, and centre the map there. */
  locateUser: (options?: { prompt?: boolean }) => Promise<void>;
  clearUserLocation: () => void;
  fetchPlaces: () => Promise<void>;
  /** Load the map pins for a listing query string, separately from the list. */
  fetchMapPlaces: (queryString: string) => Promise<void>;
  loadMorePlaces: () => Promise<void>;
}

/**
 * The loaded listings, narrowed by what only this browser knows.
 *
 * Everything else -- the business type, place, text search, cuisine, chips,
 * rating, budget, Open now, Trending and the sort order -- is decided by the
 * request (see listQueryString), so the loaded page already matches it and
 * re-checking it here could only disagree. Saved places are a set of slugs
 * held locally and nothing the backend can filter on, so that tab is applied
 * here.
 */
const visibleFor = (state: PlaceFinderState, rawList: Place[]): Place[] =>
  state.listTab === "Saved"
    ? rawList.filter((place) => state.savedPlaceIds.has(place.id))
    : rawList;

/**
 * What the map pins: the unpaginated map response, or the loaded list while
 * that is missing. Saved narrows it the same way it narrows the list.
 */
export const mapPinsFor = (
  state: Pick<PlaceFinderState, "mapPlaces" | "allPlaces" | "listTab" | "savedPlaceIds">,
): Place[] => {
  const pins = state.mapPlaces.length ? state.mapPlaces : state.allPlaces;
  return state.listTab === "Saved"
    ? pins.filter((place) => state.savedPlaceIds.has(place.id))
    : pins;
};

/** Whether the current request is scoped to a place rather than the whole type. */
const isNarrowedSearch = (state: PlaceFinderState): boolean =>
  Boolean(radiusSearch(state) || state.selectedCity || state.selectedArea);

/** Every filter back to its default, for "Clear all" and a type switch. */
const CLEARED_FILTERS = {
  searchPlace: "",
  searchCuisine: "",
  selectedArea: "",
  selectedCity: "",
  minBudget: 0,
  maxBudget: BUDGET_MAX,
  minRating: 0,
  openNow: false,
  facets: {} as Record<string, string[]>,
  range: 0,
  listTab: DEFAULT_LIST_TAB,
  sortBy: DEFAULT_SORT,
} as const;

// Typing and dragging fire continuously; only the resting value deserves a
// request. Every such control shares one timer, so settling two of them at
// once costs one request rather than two.
const SETTLE_MS = 350;
let settleTimer: ReturnType<typeof setTimeout> | null = null;
const refetchAfterPause = (run: () => void) => {
  if (settleTimer) clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    settleTimer = null;
    run();
  }, SETTLE_MS);
};

/**
 * How many places the current search matches, for the count beside the tabs.
 *
 * The server's total, not the size of the page in memory: the API returns 20
 * at a time, so 27 matches would otherwise read as 20. Saved is the exception,
 * being a set of slugs this browser holds and the backend never counted.
 */
export const selectResultCount = (state: PlaceFinderState): number =>
  state.listTab === "Saved" ? state.visiblePlaces.length : state.resultCount;

// Ignore older requests when a new search or reset replaces them.
let requestVersion = 0;
// The map pins load on their own, so a slow list cannot hold them back.
let mapRequestVersion = 0;
let chatController: AbortController | null = null;
const nextQueryString = (next: string | null) =>
  next ? new URL(next, "http://localhost").search.slice(1) : null;

export const usePlaceFinderStore = create<PlaceFinderState>((set, get) => ({
  openAI: true,
  searchPlace: "",
  businessType: DEFAULT_BUSINESS_TYPE,
  searchCuisine: "",
  selectedArea: "",
  selectedCity: "",
  minBudget: 0,
  maxBudget: BUDGET_MAX,
  minRating: 0,
  openNow: false,
  facets: {},
  range: 0,
  unit: "km",
  placesCenter: null,
  userLocation: null,
  geoStatus: "idle",
  geoMessage: null,
  locations: [],
  locationsType: null,
  listTab: DEFAULT_LIST_TAB,
  sortBy: DEFAULT_SORT,
  allPlaces: [],
  visiblePlaces: [],
  mapPlaces: [],
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

  /**
   * Switch between the assistant and the manual filter panel.
   *
   * The two own different query parameters (see listQueryString), so the
   * listing has to be asked for again: leaving the assistant's search in place
   * would show results the panel on screen does not describe.
   */
  setOpenAI: (val) => {
    if (val === get().openAI) return;
    set({ openAI: val });
    void get().fetchPlaces();
  },
  // Searched server-side, so it settles before asking rather than firing a
  // request per keystroke.
  setSearchPlace: (val) => {
    set({ searchPlace: val });
    refetchAfterPause(() => void get().fetchPlaces());
  },
  /**
   * Switch the page to another business type.
   *
   * This is a change of source, not a filter: the listings, the map pins and
   * the assistant's grounding all come from the new type's endpoint, so the
   * loaded results, the conversation about the old type and the filters that
   * only made sense there are all dropped. City, area and radius survive --
   * "resorts in Sylhet" after "restaurants in Sylhet" is what someone means.
   */
  setBusinessType: (val) => {
    if (val === get().businessType) return;
    get().stopChat();
    set({
      businessType: val,
      allPlaces: [],
      visiblePlaces: [],
      mapPlaces: [],
      resultCount: 0,
      hasMore: false,
      nextQuery: null,
      queryString: "",
      placesCenter: null,
      selectedPlaceId: null,
      chatMessages: [],
      chatInput: "",
      lastQuery: "",
      error: null,
      errorSource: null,
      searchPlace: "",
      searchCuisine: "",
      facets: {},
      minRating: 0,
      minBudget: 0,
      maxBudget: BUDGET_MAX,
      openNow: false,
      listTab: DEFAULT_LIST_TAB,
      sortBy: DEFAULT_SORT,
      isLoading: true,
    });
    void get().loadLocations();
    void get().fetchPlaces();
  },
  setSearchCuisine: (val) => {
    set({ searchCuisine: val });
    void get().fetchPlaces();
  },
  setSelectedArea: (val) => {
    set({ selectedArea: val });
    void get().fetchPlaces();
  },
  setSelectedCity: (val) => {
    set({ selectedCity: val, selectedArea: "" });
    void get().fetchPlaces();
  },
  // Both budget handles slide continuously, so they settle before asking.
  setMinBudget: (val) => {
    set({ minBudget: val });
    refetchAfterPause(() => void get().fetchPlaces());
  },
  setMaxBudget: (val) => {
    set({ maxBudget: val });
    refetchAfterPause(() => void get().fetchPlaces());
  },
  setMinRating: (val) => {
    set({ minRating: val });
    void get().fetchPlaces();
  },
  setOpenNow: (val) => {
    set({ openNow: val });
    void get().fetchPlaces();
  },
  toggleFacet: (param, slug) => {
    const current = get().facets[param] ?? [];
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    // Empty groups are dropped rather than kept as [], so the URL and the
    // request carry only the groups that are actually narrowing anything.
    const facets = { ...get().facets };
    if (next.length) facets[param] = next;
    else delete facets[param];
    set({ facets });
    void get().fetchPlaces();
  },
  clearFacets: () => {
    if (!Object.keys(get().facets).length) return;
    set({ facets: {} });
    void get().fetchPlaces();
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
    const previous = get().listTab;
    if (tab === previous) return;
    set({ listTab: tab });
    // Saved is filtered from what is already loaded; the other two are
    // different searches, so leaving Saved refetches as well as entering
    // Trending does.
    if (tab === "Saved") {
      set({ visiblePlaces: visibleFor(get(), get().allPlaces) });
      return;
    }
    if (previous === "Saved" && tab === "All") {
      set({ visiblePlaces: get().allPlaces });
      return;
    }
    void get().fetchPlaces();
  },
  setSortBy: (sort) => {
    set({ sortBy: sort });
    void get().fetchPlaces();
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
      set({ visiblePlaces: visibleFor(get(), get().allPlaces) });
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
          category: before.businessType,
          history,
          selected_slug: selected?.slug,
          business_slugs: before.visiblePlaces.slice(0, 10).map((place) => place.slug),
          previous_query_string: before.queryString,
        },
        (event) => {
          if (version !== requestVersion) return;
          if (event.type === "status") {
            set({ chatStatus: event.text });
            // The backend names the type it is searching, e.g. "Looking for
            // gyms…"; any of them means results are on their way.
            if (event.text.startsWith("Looking for")) set({ isLoading: true });
          }
          if (event.type === "delta") {
            set((state) => ({
              chatMessages: state.chatMessages.map((message, index) =>
                index === replyIndex ? { ...message, text: message.text + event.text } : message,
              ),
            }));
          }
          if (event.type === "results") {
            const places = event.results.map((item) =>
              mapPlaceListItem(before.businessType, item),
            );
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
              searchCuisine: "",
              selectedCity: "",
              selectedArea: "",
              facets: {},
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
            void get().fetchMapPlaces(event.query_string);
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
    // Every filter is part of the request now, so clearing any of them means
    // the widened search has to be asked for again.
    const before = get();
    const wasNarrowed =
      listQueryString(before) !== listQueryString({ ...before, ...CLEARED_FILTERS });
    set(CLEARED_FILTERS);
    set({ visiblePlaces: get().allPlaces });
    if (wasNarrowed) void get().fetchPlaces();
  },

  applyUrlFilters: (filters) => {
    // One batched set: going through the individual setters would fire a
    // request per filter before the page has fetched anything at all.
    set(filters);
    set({ visiblePlaces: visibleFor(get(), get().allPlaces) });
  },

  loadLocations: async () => {
    const type = get().businessType;
    if (get().locationsType === type) return;
    try {
      const { cities } = await locationsApi.list(type);
      // A type switch can resolve after another; only the current one counts.
      if (get().businessType !== type) return;
      set({ locations: cities, locationsType: type });
    } catch {
      // The selects fall back to being empty; the map still works off the
      // centre of whatever listings loaded.
    }
  },

  /**
   * Centre the map on the visitor.
   *
   * With `prompt: false` -- how the page loads -- the browser is only asked if
   * it can answer without a dialog, so arriving at the finder does not throw a
   * permission prompt in anyone's face. The button in the Location card passes
   * `prompt: true`, because then they have asked for it.
   *
   * A radius already in play is measured from this centre, so granting it
   * changes the results and they have to be fetched again. An area or city the
   * visitor picked still wins over it -- see searchCenter.
   */
  locateUser: async ({ prompt = true } = {}) => {
    if (get().geoStatus === "prompting") return;
    if (!geolocationAvailable()) {
      set({ geoStatus: "unsupported", geoMessage: null });
      return;
    }
    if (!prompt && (await geolocationPermission()) !== "granted") return;

    set({ geoStatus: "prompting", geoMessage: null });
    const { status, center, message } = await requestGeolocation();
    if (!center && !prompt) {
      // Nobody asked for this one, so nobody should be told it failed. The
      // button stays as an invitation rather than turning into an error.
      set({ geoStatus: "idle", geoMessage: null });
      return;
    }
    set({ geoStatus: status, userLocation: center, geoMessage: message ?? null });
    if (!center) return;
    // Only a radius search reads the centre; without one the map just moves.
    if (radiusSearch(get())) void get().fetchPlaces();
  },

  clearUserLocation: () => {
    if (!get().userLocation) return;
    set({ userLocation: null, geoStatus: "idle", geoMessage: null });
    if (radiusSearch(get())) void get().fetchPlaces();
  },

  initializePlaces: async () => {
    if (get().initialized) return;
    set({ initialized: true, isLoading: true });
    const locations = get().loadLocations();
    // Silent: a visitor who allowed this before is centred straight away,
    // everyone else is left alone until they press the button. Deliberately
    // not awaited -- a position can take seconds, and the results should not
    // wait on it; if one arrives while a radius is set, locateUser refetches.
    void get().locateUser({ prompt: false });
    // A radius around a city or area from the URL is measured from a centre
    // that only the locations payload knows, so that one request is worth
    // waiting for rather than searching the wrong place and correcting.
    const { selectedCity, selectedArea, range } = get();
    if (range > 0 && (selectedCity || selectedArea)) await locations;
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
      const type = get().businessType;
      const queryString = listQueryString(get());
      void get().fetchMapPlaces(queryString);
      const response = await aiPlacesApi.list(type, queryString);
      if (version !== requestVersion) return;
      const places = response.results.map((item) => mapPlaceListItem(type, item));
      set({
        allPlaces: places,
        visiblePlaces: visibleFor(get(), places),
        resultCount: response.count,
        nextQuery: nextQueryString(response.next),
        hasMore: Boolean(response.next),
        // Only an unnarrowed response describes where this type's listings
        // really are. A city, area or radius result would re-centre the
        // fallback on itself and drift away from the rest of the data.
        placesCenter: isNarrowedSearch(get())
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
        error:
          error instanceof Error
            ? error.message
            : `Could not load ${businessTypeConfig(get().businessType).plural}.`,
      });
    } finally {
      if (version === requestVersion) set({ isLoading: false });
    }
  },

  fetchMapPlaces: async (queryString) => {
    const version = ++mapRequestVersion;
    const type = get().businessType;
    try {
      const items = await aiPlacesApi.map(type, queryString);
      if (version !== mapRequestVersion || get().businessType !== type) return;
      set({ mapPlaces: items.map((item) => mapPlaceListItem(type, item)) });
    } catch {
      // The map falls back to the loaded page of the list (see mapPinsFor),
      // so a failed pin request is not worth an error of its own.
      if (version === mapRequestVersion) set({ mapPlaces: [] });
    }
  },

  loadMorePlaces: async () => {
    const { nextQuery, isLoading, isLoadingMore } = get();
    if (!nextQuery || isLoading || isLoadingMore || get().isAiResponding) return;
    const version = requestVersion;
    set({ isLoadingMore: true, error: null });
    try {
      const type = get().businessType;
      const response = await aiPlacesApi.list(type, nextQuery);
      if (version !== requestVersion) return;
      const places = [
        ...new Map(
          [
            ...get().allPlaces,
            ...response.results.map((item) => mapPlaceListItem(type, item)),
          ].map((place) => [place.id, place]),
        ).values(),
      ];
      set({
        allPlaces: places,
        visiblePlaces: visibleFor(get(), places),
        nextQuery: nextQueryString(response.next),
        hasMore: Boolean(response.next),
        resultCount: response.count,
      });
    } catch (error) {
      if (version === requestVersion)
        set({
          error:
            error instanceof Error
              ? error.message
              : `Could not load more ${businessTypeConfig(get().businessType).plural}.`,
        });
    } finally {
      if (version === requestVersion) set({ isLoadingMore: false });
    }
  },
}));
