"use client";

import { create } from "zustand";
import type { Place } from "@/types/place";
import { listPlaces } from "@/lib/backend/places";
import { places as mockPlaces } from "@/content/places";
import {
  BUDGET_MAX,
  DEFAULT_LIST_TAB,
  DEFAULT_SORT,
  BD_CITIES,
  DHAKA_AREAS,
  type ListTab,
  type SortOption,
} from "./constants";

export interface ChatMessage {
  type: "user" | "ai";
  text: string;
  recommendedPlaces?: Place[];
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
  listTab: ListTab;
  sortBy: SortOption;
  allPlaces: Place[];
  visiblePlaces: Place[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  initialized: boolean;
  chatInput: string;
  chatMessages: ChatMessage[];
  isAiResponding: boolean;
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
  sendChatMessage: (customText?: string) => void;
  clearChat: () => void;
  clearFilters: () => void;
  initializePlaces: () => Promise<void>;
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

  if (state.selectedArea) {
    list = list.filter(
      (p) =>
        p.area?.toLowerCase() === state.selectedArea.toLowerCase() ||
        p.location?.toLowerCase().includes(state.selectedArea.toLowerCase()),
    );
  } else if (state.selectedCity) {
    list = list.filter((p) => p.location?.toLowerCase().includes(state.selectedCity.toLowerCase()));
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
    list = list.filter((p) => p.trending || p.rating >= 4.7);
  } else if (state.listTab === "Saved") {
    list = list.filter((p) => state.savedPlaceIds.has(p.id));
  }

  return sortPlacesList(list, state.sortBy);
};

export const usePlaceFinderStore = create<PlaceFinderState>((set, get) => ({
  openAI: false,
  searchPlace: "",
  searchCategory: "all",
  searchCuisine: "",
  selectedArea: "",
  selectedCity: "Dhaka",
  minBudget: 0,
  maxBudget: BUDGET_MAX,
  minRating: 0,
  openNow: false,
  selectedVibes: [],
  range: 0,
  unit: "km",
  listTab: DEFAULT_LIST_TAB,
  sortBy: DEFAULT_SORT,
  allPlaces: [],
  visiblePlaces: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: false,
  initialized: false,
  chatInput: "",
  chatMessages: [],
  isAiResponding: false,
  selectedPlaceId: null,
  savedPlaceIds: new Set<string>(["1", "4"]),

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
    set({ selectedArea: val });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
  },
  setSelectedCity: (val) => {
    set({ selectedCity: val, selectedArea: "" });
    const filtered = filterPlacesList(get(), get().allPlaces);
    set({ visiblePlaces: filtered });
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
    set({ range: val });
  },
  setUnit: (val) => set({ unit: val }),
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
        isAiResponding: false,
      });
      const selected = get().allPlaces.find((p) => p.id === placeId);
      if (selected) {
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              type: "ai",
              text: `I've pinned **${selected.name}** (${selected.area}). Ask me anything about its menu, pricing, timings, or vibe!`,
            },
          ],
        }));
      }
    }
  },
  clearSelectedPlace: () => set({ selectedPlaceId: null }),
  setChatInput: (val) => set({ chatInput: val }),

  sendChatMessage: (customText?: string) => {
    const text = (customText || get().chatInput).trim();
    if (!text) return;

    set((state) => ({
      chatMessages: [...state.chatMessages, { type: "user", text }],
      chatInput: "",
      openAI: true,
      isAiResponding: true,
    }));

    setTimeout(() => {
      const state = get();
      const q = text.toLowerCase();
      const all = state.allPlaces;

      // Smart AI response logic
      let matched: Place[] = [];
      let responseText = "";

      if (state.selectedPlaceId) {
        const place = all.find((p) => p.id === state.selectedPlaceId);
        if (place) {
          responseText = `Here is what you need to know about **${place.name}** in ${place.area}:\n\n` +
            `• **Category/Cuisine:** ${place.cuisine || place.category}\n` +
            `• **Rating:** ⭐ ${place.rating} (${place.reviews || 0} reviews)\n` +
            `• **Pricing:** ${place.priceRange || "Mid-range"}\n` +
            `• **Hours:** ${place.hours || "12:00 PM – 11:00 PM"}\n` +
            `• **Facilities:** ${place.facilities?.join(", ") || "AC, WiFi, Parking"}\n\n` +
            `${place.aiSummary || place.description || "A highly rated local spot recommended for great experiences."}`;
        }
      } else {
        if (q.includes("rooftop") || q.includes("view")) {
          matched = all.filter((p) => p.tags?.some((t) => /rooftop/i.test(t)) || p.name.toLowerCase().includes("rooftop"));
          responseText = `Here are the best rooftop venues with scenic skyline views across Dhaka:`;
        } else if (q.includes("biryani") || q.includes("kacchi")) {
          matched = all.filter((p) => p.cuisine?.toLowerCase().includes("biryani") || p.name.toLowerCase().includes("biryani") || p.name.toLowerCase().includes("kacchi"));
          responseText = `Here are top-rated Biryani and Kacchi joints:`;
        } else if (q.includes("resort") || q.includes("getaway") || q.includes("pool") || q.includes("weekend")) {
          matched = all.filter((p) => p.category === "resort" || p.facilities?.includes("Pool"));
          responseText = `Here are scenic weekend resorts with serene surroundings and pools:`;
        } else if (q.includes("gym") || q.includes("fitness") || q.includes("workout")) {
          matched = all.filter((p) => p.category === "gym");
          responseText = `Here are top fitness centers and gyms with premium equipment:`;
        } else if (q.includes("budget") || q.includes("cheap") || q.includes("500")) {
          matched = all.filter((p) => (p.priceLevel || 1) <= 2);
          responseText = `Here are budget-friendly spots with great food for under ৳500–৳800 per person:`;
        } else if (q.includes("gulshan") || q.includes("banani") || q.includes("dhanmondi") || q.includes("uttara")) {
          const area = q.includes("gulshan") ? "gulshan" : q.includes("banani") ? "banani" : q.includes("dhanmondi") ? "dhanmondi" : "uttara";
          matched = all.filter((p) => p.area?.toLowerCase().includes(area) || p.location?.toLowerCase().includes(area));
          responseText = `Found these top recommendations around ${area.charAt(0).toUpperCase() + area.slice(1)}:`;
        } else {
          matched = all.slice(0, 4);
          responseText = `I've found places that match your request. Check out these popular choices:`;
        }

        if (matched.length > 0) {
          set({ visiblePlaces: matched });
        }
      }

      set((s) => ({
        chatMessages: [
          ...s.chatMessages,
          {
            type: "ai",
            text: responseText,
            recommendedPlaces: matched.slice(0, 3),
          },
        ],
        isAiResponding: false,
      }));
    }, 700);
  },

  clearChat: () => {
    set({
      chatMessages: [],
      chatInput: "",
      isAiResponding: false,
      selectedPlaceId: null,
    });
    get().clearFilters();
  },

  clearFilters: () => {
    set({
      searchPlace: "",
      searchCategory: "all",
      searchCuisine: "",
      selectedArea: "",
      selectedCity: "Dhaka",
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
  },

  initializePlaces: async () => {
    if (get().initialized) return;
    set({ initialized: true, isLoading: true });
    await get().fetchPlaces();
  },

  fetchPlaces: async () => {
    set({ isLoading: true });
    try {
      const [restaurants, resorts, gyms] = await Promise.all([
        listPlaces("restaurant", { pageSize: 50 }).catch(() => []),
        listPlaces("resort", { pageSize: 50 }).catch(() => []),
        listPlaces("gym", { pageSize: 50 }).catch(() => []),
      ]);

      const combined = [
        ...restaurants,
        ...resorts,
        ...gyms,
      ];

      // If backend returns empty (or partial), fill with mockPlaces to guarantee great data
      const mergedMap = new Map<string, Place>();
      mockPlaces.forEach((p) => mergedMap.set(p.id, p));
      combined.forEach((p) => mergedMap.set(p.id, p));
      const all = Array.from(mergedMap.values());

      set({
        allPlaces: all,
        visiblePlaces: filterPlacesList(get(), all),
        isLoading: false,
      });
    } catch {
      set({
        allPlaces: mockPlaces,
        visiblePlaces: mockPlaces,
        isLoading: false,
      });
    }
  },

  loadMorePlaces: async () => {
    // pagination placeholder
  },
}));
