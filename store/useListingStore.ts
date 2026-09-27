"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ListingDraft } from "@/types/listing";
import { emptyDraft } from "@/content/listingCategories";

function normalizeDraft(draft: Partial<ListingDraft> | undefined): ListingDraft {
  return { ...emptyDraft(), ...(draft ?? {}) };
}

interface ListingState {
  draft: ListingDraft;
  listings: ListingDraft[];
  stepIdx: number;
  hydrated: boolean;
  setDraft: (d: ListingDraft) => void;
  updateDraft: (patch: Partial<ListingDraft>) => void;
  clearDraft: () => void;
  setStepIdx: (i: number) => void;
  publishListing: () => ListingDraft;
  setHydrated: (v: boolean) => void;
}

export const useListingStore = create<ListingState>()(
  persist(
    (set, get) => ({
      draft: emptyDraft(),
      listings: [],
      stepIdx: 0,
      hydrated: false,

      setDraft: (d) => set({ draft: d }),
      updateDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
      clearDraft: () => set({ draft: emptyDraft(), stepIdx: 0 }),

      setStepIdx: (i) => set({ stepIdx: i }),

      publishListing: () => {
        const d = get().draft;
        const final: ListingDraft = {
          ...d,
          id: `biz_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({
          listings: [final, ...get().listings],
          draft: emptyDraft(),
          stepIdx: 0,
        });
        return final;
      },

      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "bizfindly:listings-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        draft: s.draft,
        listings: s.listings,
        stepIdx: s.stepIdx,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.draft = normalizeDraft(state.draft);
          state.listings = (state.listings ?? []).map(normalizeDraft);
        }
        state?.setHydrated(true);
      },
    },
  ),
);
