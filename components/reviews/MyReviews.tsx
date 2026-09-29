"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/backend/auth";
import { reviewsApi, useReviewActions } from "@/lib/backend/reviews";
import { MyReviewCard } from "./MyReviewCard";

export function MyReviews() {
  const { token, user, hydrated } = useAuthStore();
  // Session-specific key: one account's reviews must never be served to the next.
  const key = ["my-reviews", token];
  const signedIn = Boolean(token && user);
  const actions = useReviewActions();

  const query = useInfiniteQuery({
    queryKey: key,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => reviewsApi.mine({ page: pageParam }),
    getNextPageParam: (last, pages) => (last.next ? pages.length + 1 : undefined),
    enabled: hydrated && signedIn,
    retry: false,
  });

  const reviews = signedIn ? (query.data?.pages.flatMap((page) => page.results) ?? []) : [];
  const loading = !hydrated || (signedIn && query.isPending);

  return (
    <section id="my-reviews" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">My reviews</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Everything you have rated — edit or remove a review at any time.
          </p>
        </div>
        {signedIn && query.data && (
          <span className="bg-muted rounded-full px-3 py-1 text-xs font-semibold">
            {query.data.pages[0].count} {query.data.pages[0].count === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {loading ? (
        <p role="status" className="py-12 text-center">
          Loading your reviews…
        </p>
      ) : !signedIn ? (
        <div className="py-12 text-center">
          <p>Sign in to see the reviews you have written.</p>
          <Link
            href="/join?next=%2Fmy-reviews"
            className="text-brand mt-4 inline-block font-semibold"
          >
            Sign in
          </Link>
        </div>
      ) : query.isError ? (
        <div role="alert" className="py-12 text-center">
          <p>{query.error.message}</p>
          <button
            type="button"
            onClick={() => void query.refetch()}
            className="text-brand mt-4 font-semibold"
          >
            Try again
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="border-border bg-card mt-8 rounded-3xl border border-dashed p-12 text-center">
          <Star className="text-muted-foreground mx-auto h-10 w-10" />
          <p className="mt-4 text-lg font-semibold">You haven&apos;t reviewed anywhere yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Rate a place you have been to and it will show up here.
          </p>
          <Link href="/ai-discover" className="text-brand mt-3 inline-block text-sm font-semibold">
            Find somewhere to review →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <MyReviewCard
              key={review.id}
              review={review}
              error={actions.errorFor(review.id)}
              saving={actions.isSaving(review.id)}
              deleting={actions.isDeleting(review.id)}
              onSave={(values) => actions.save(review, values)}
              onDelete={() => actions.remove(review)}
            />
          ))}
        </div>
      )}

      {signedIn && query.hasNextPage && (
        <button
          type="button"
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
          className="border-border mt-6 rounded-xl border px-5 py-3"
        >
          {query.isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      )}
    </section>
  );
}
