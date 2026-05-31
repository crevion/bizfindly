import { apiClient, buildQuery, type Paginated } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";
import type { CreateReviewInput, MyReviewsParams, Review, ReviewListParams } from "./types";

export const reviewsApi = {
  create: (data: CreateReviewInput) =>
    apiClient<Review>("/reviews/", {
      method: "POST",
      body: data,
      headers: authHeader(),
    }),

  list: (params: ReviewListParams) =>
    apiClient<Paginated<Review>>(`/reviews/${buildQuery(params)}`),

  mine: (params: MyReviewsParams = {}) =>
    apiClient<Paginated<Review>>(`/reviews/my/${buildQuery(params)}`, {
      headers: authHeader(),
    }),
};
