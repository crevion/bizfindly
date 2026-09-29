import { apiClient, buildQuery, type Paginated } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";
import type {
  CreateReviewInput,
  MyReviewsParams,
  Review,
  ReviewListParams,
  UpdateReviewInput,
} from "./types";

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

  update: (id: number, data: UpdateReviewInput) =>
    apiClient<Review>(`/reviews/${id}/`, {
      method: "PATCH",
      body: data,
      headers: authHeader(),
    }),

  remove: (id: number) =>
    apiClient<void>(`/reviews/${id}/`, {
      method: "DELETE",
      headers: authHeader(),
    }),
};
