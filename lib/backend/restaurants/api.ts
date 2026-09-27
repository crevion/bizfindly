import { apiClient, buildQuery, type Paginated } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";
import type {
  GalleryImage,
  RestaurantDetail,
  RestaurantInput,
  RestaurantListItem,
  RestaurantListParams,
} from "./types";

export const restaurantsApi = {
  list: (params: RestaurantListParams = {}) =>
    apiClient<Paginated<RestaurantListItem>>(`/restaurants/${buildQuery(params)}`),

  detail: (slug: string) => apiClient<RestaurantDetail>(`/restaurants/${slug}/`),

  listMine: () => apiClient<RestaurantDetail[]>("/owner/restaurants/", { headers: authHeader() }),

  create: (data: FormData | RestaurantInput) =>
    apiClient<RestaurantDetail>("/owner/restaurants/", {
      method: "POST",
      body: data,
      headers: authHeader(),
    }),

  update: (slug: string, data: FormData | Record<string, unknown>) =>
    apiClient<RestaurantDetail>(`/owner/restaurants/${slug}/`, {
      method: "PUT",
      body: data,
      headers: authHeader(),
    }),

  patch: (slug: string, data: FormData | Record<string, unknown>) =>
    apiClient<RestaurantDetail>(`/owner/restaurants/${slug}/`, {
      method: "PATCH",
      body: data,
      headers: authHeader(),
    }),

  remove: (slug: string) =>
    apiClient<void>(`/owner/restaurants/${slug}/`, {
      method: "DELETE",
      headers: authHeader(),
    }),

  listGalleryImages: (slug: string) =>
    apiClient<GalleryImage[]>(`/owner/restaurants/${slug}/gallery/`, {
      headers: authHeader(),
    }),

  uploadGalleryImage: (slug: string, data: FormData) =>
    apiClient<GalleryImage>(`/owner/restaurants/${slug}/gallery/`, {
      method: "POST",
      body: data,
      headers: authHeader(),
    }),

  deleteGalleryImage: (slug: string, id: number) =>
    apiClient<void>(`/owner/restaurants/${slug}/gallery/${id}/`, {
      method: "DELETE",
      headers: authHeader(),
    }),
};
