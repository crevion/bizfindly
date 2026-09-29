"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/backend/auth";
import { reviewsApi } from "./api";
import type { MyReviewsParams, Review, ReviewBusinessCategory, UpdateReviewInput } from "./types";

/** `?restaurant=`, `?resort=` or `?gym=`, spelled out so the type survives. */
export function businessFilter(category: ReviewBusinessCategory, slug: string): MyReviewsParams {
  if (category === "restaurant") return { restaurant: slug };
  if (category === "resort") return { resort: slug };
  return { gym: slug };
}

export const myReviewKey = (
  token: string | null,
  category: ReviewBusinessCategory,
  slug: string,
) => ["my-review", token, category, slug];

/**
 * The caller's own review of one business, or null when they have not written one.
 *
 * Everybody gets a single review per business, so this is what decides whether a
 * business page offers the review form or the review they already left.
 */
export function useMyReviewFor(category: ReviewBusinessCategory, slug: string) {
  const { token, user, hydrated } = useAuthStore();
  const signedIn = Boolean(token && user);
  const query = useQuery({
    queryKey: myReviewKey(token, category, slug),
    queryFn: async () => {
      const page = await reviewsApi.mine({ ...businessFilter(category, slug), page_size: 1 });
      return page.results[0] ?? null;
    },
    enabled: hydrated && signedIn,
    retry: false,
  });
  return {
    review: signedIn ? (query.data ?? null) : null,
    // Until this settles the page cannot tell the two states apart, so it waits
    // rather than flashing a form the person is not allowed to use.
    loading: !hydrated || (signedIn && query.isPending),
  };
}

/**
 * Editing and deleting your own reviews, wherever they are listed.
 *
 * Both change the business's rating, so the place pages showing it are refetched
 * alongside every list the review appears in. Failures are kept per review id:
 * one review's error must not be reported on another's card.
 */
export function useReviewActions() {
  const client = useQueryClient();
  const [errors, setErrors] = useState<Record<number, string>>({});

  const setError = (id: number, message: string) =>
    setErrors((current) => ({ ...current, [id]: message }));
  const clearError = (id: number) =>
    setErrors((current) => {
      if (!(id in current)) return current;
      const rest = { ...current };
      delete rest[id];
      return rest;
    });

  const refresh = async (review: Review) => {
    const business = review.business;
    await Promise.all([
      client.invalidateQueries({ queryKey: ["my-reviews"] }),
      client.invalidateQueries({ queryKey: ["my-review"] }),
      ...(business
        ? [
            client.invalidateQueries({ queryKey: ["place-detail", business.slug] }),
            client.invalidateQueries({
              queryKey: ["place-reviews", business.category, business.slug],
            }),
          ]
        : []),
      client.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
  };

  const update = useMutation({
    mutationFn: ({ review, values }: { review: Review; values: UpdateReviewInput }) =>
      reviewsApi.update(review.id, values),
    onSuccess: async (_updated, { review }) => {
      clearError(review.id);
      toast.success("Your review has been updated.");
      await refresh(review);
    },
    onError: (failure: Error, { review }) => setError(review.id, failure.message),
  });

  const remove = useMutation({
    mutationFn: (review: Review) => reviewsApi.remove(review.id),
    onSuccess: async (_void, review) => {
      clearError(review.id);
      toast.success("Your review has been deleted.");
      await refresh(review);
    },
    onError: (failure: Error, review) => setError(review.id, failure.message),
  });

  return {
    save: async (review: Review, values: UpdateReviewInput) => {
      clearError(review.id);
      try {
        await update.mutateAsync({ review, values });
      } catch {
        /* Reported on the card through errorFor(). */
      }
    },
    remove: async (review: Review) => {
      clearError(review.id);
      try {
        await remove.mutateAsync(review);
      } catch {
        /* Reported on the card through errorFor(). */
      }
    },
    errorFor: (id: number) => errors[id],
    isSaving: (id: number) => update.isPending && update.variables?.review.id === id,
    isDeleting: (id: number) => remove.isPending && remove.variables?.id === id,
  };
}
