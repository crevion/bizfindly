"use client";

import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/backend/auth";
import { savedApi } from "./api";
import type { Category } from "@/types/place";

export function useSavedPlace(category: Category, slug: string) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const router = useRouter();
  const cache = useQueryClient();
  // Session-specific keys prevent cached status leaking between signed-in accounts.
  const key = ["saved-place", token, category, slug];
  const status = useQuery({ queryKey: key, queryFn: () => savedApi.status(category, slug), enabled: Boolean(token && user && hydrated), retry: false });
  const pending = useIsMutating({ mutationKey: key }) > 0;
  const mutation = useMutation({
    mutationKey: key,
    mutationFn: async (save: boolean) => {
      if (save) await savedApi.save(category, slug);
      else await savedApi.remove(category, slug);
      return save;
    },
    onSuccess: (saved) => {
      cache.setQueryData(key, { saved });
      void cache.invalidateQueries({ queryKey: ["saved-places", token] });
      toast.success(saved ? "Saved to your places" : "Removed from saved places");
    },
    onError: (error) => toast.error(error.message || "Could not update saved places."),
  });
  const toggle = async () => {
    if (!hydrated || pending) return;
    if (!token || !user) {
      router.push(`/join?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    let saved = status.data?.saved;
    if (saved === undefined) {
      const result = await status.refetch();
      if (!result.data) { toast.error("Could not check saved status. Please try again."); return; }
      saved = result.data.saved;
    }
    mutation.mutate(!saved);
  };
  return { saved: Boolean(token && user && status.data?.saved), pending: pending || !hydrated || Boolean(token && status.isFetching), toggle };
}
