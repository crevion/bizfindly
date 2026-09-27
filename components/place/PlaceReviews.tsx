"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/backend/auth";
import { reviewsApi } from "@/lib/backend/reviews";
import { mapReview } from "@/lib/backend/places";
import type { Place } from "@/types/place";
import { ReviewList } from "./PlaceBodySections";

export function PlaceReviews({ place }: { place: Place }) {
  const { user, token, hydrated } = useAuthStore();
  const router = useRouter();
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const key = ["place-reviews", place.category, place.slug];
  const query = useInfiniteQuery({
    queryKey: key,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => reviewsApi.list({ [place.category]: place.slug, page: pageParam }),
    getNextPageParam: (last, pages) => (last.next ? pages.length + 1 : undefined),
    retry: false,
  });
  const mutation = useMutation({
    mutationFn: () =>
      reviewsApi.create({
        star: rating,
        comment: comment.trim(),
        [`${place.category}_slug`]: place.slug,
      }),
    onSuccess: async () => {
      setOpen(false);
      setRating(0);
      setComment("");
      setError("");
      toast.success("Your review has been published.");
      await Promise.all([
        client.invalidateQueries({ queryKey: key }),
        client.invalidateQueries({ queryKey: ["place-detail", place.slug] }),
        client.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    },
    onError: (failure: Error) => setError(failure.message),
  });
  const signIn = () =>
    router.push(`/join?next=${encodeURIComponent(`/place/${place.slug}#reviews`)}`);
  return (
    <section id="reviews" className="mt-10 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">
          Reviews
          {query.data && (
            <span className="text-muted-foreground"> ({query.data.pages[0].count})</span>
          )}
        </h2>
        <button
          type="button"
          disabled={!hydrated || mutation.isPending}
          onClick={() => {
            if (!user || !token) {
              signIn();
              return;
            }
            setOpen(true);
            setError("");
          }}
          className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          Write a review
        </button>
      </div>
      {open && user && token && (
        <form
          className="border-border bg-card mt-4 space-y-4 rounded-3xl border p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            if (submitting.current) return;
            if (!user || !token) {
              signIn();
              return;
            }
            if (rating < 1 || rating > 5) {
              setError("Please select a rating from 1 to 5 stars.");
              return;
            }
            setError("");
            submitting.current = true;
            try {
              await mutation.mutateAsync();
            } catch {
              /* Error is shown by the mutation. */
            } finally {
              submitting.current = false;
            }
          }}
        >
          <fieldset disabled={mutation.isPending} className="space-y-4">
            <legend className="font-semibold">Your experience at {place.name}</legend>
            <fieldset>
              <legend className="text-sm font-medium">Rating *</legend>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      checked={rating === value}
                      onChange={() => setRating(value)}
                      required
                      className="peer sr-only"
                      aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                    />
                    <span className="block rounded-lg p-1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                      <Star
                        className={`h-7 w-7 ${value <= rating ? "fill-brand text-brand" : "text-muted-foreground"}`}
                      />
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-medium">
              Review (optional)
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                className="border-border bg-background mt-2 w-full rounded-xl border px-3 py-2 font-normal"
                placeholder="Share what you liked or what could be better…"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <button className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50">
                {mutation.isPending ? "Submitting…" : "Submit review"}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="text-sm underline">
                Cancel
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {query.isPending && (
        <p role="status" className="text-muted-foreground mt-4 text-sm">
          Loading reviews…
        </p>
      )}
      {query.isError && (
        <p role="alert" className="mt-4 text-sm">
          {query.error.message}{" "}
          <button onClick={() => void query.refetch()} className="underline">
            Try again
          </button>
        </p>
      )}
      {query.data && (
        <ReviewList reviews={query.data.pages.flatMap((page) => page.results).map(mapReview)} />
      )}
      {query.hasNextPage && (
        <button
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
          className="mt-4 text-sm underline"
        >
          {query.isFetchingNextPage ? "Loading…" : "Load more reviews"}
        </button>
      )}
    </section>
  );
}
