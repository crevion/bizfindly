"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ClaimRecord, VerificationStatus } from "@/types/verification";

interface VerificationState {
  claims: ClaimRecord[];
  hydrated: boolean;
  submitClaim: (rec: Omit<ClaimRecord, "id" | "submittedAt" | "status">) => ClaimRecord;
  updateClaimStatus: (id: string, status: VerificationStatus, note?: string) => void;
  setHydrated: (v: boolean) => void;
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set, get) => ({
      claims: [],
      hydrated: false,

      submitClaim: (rec) => {
        const final: ClaimRecord = {
          ...rec,
          id: `clm_${Date.now()}`,
          status: "pending",
          submittedAt: new Date().toISOString(),
        };
        set({ claims: [final, ...get().claims] });
        return final;
      },

      updateClaimStatus: (id, status, note) => {
        const list = get().claims.slice();
        const idx = list.findIndex((c) => c.id === id);
        if (idx === -1) return;
        list[idx] = {
          ...list[idx],
          status,
          reviewerNote: note,
          reviewedAt: new Date().toISOString(),
        };
        set({ claims: list });
      },

      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "bizfindly:claims-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ claims: s.claims }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
