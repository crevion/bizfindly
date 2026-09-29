import { apiClient, buildQuery, type Paginated } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";
import type {
  GalleryImage,
  OwnerResort,
  ResortDetail,
  ResortInput,
  ResortListItem,
  ResortListParams,
} from "./types";

export const resortsApi = {
  list: (params: ResortListParams = {}) =>
    apiClient<Paginated<ResortListItem>>(`/resorts/${buildQuery(params)}`),

  detail: (slug: string) => apiClient<ResortDetail>(`/resorts/${slug}/`),

  listMine: () => apiClient<OwnerResort[]>("/owner/resorts/", { headers: authHeader() }),

  create: (data: ResortInput | FormData) =>
    apiClient<OwnerResort>("/owner/resorts/", {
      method: "POST",
      body: data,
      headers: authHeader(),
    }),

  update: (slug: string, data: ResortInput | FormData) =>
    apiClient<OwnerResort>(`/owner/resorts/${slug}/`, {
      method: "PUT",
      body: data,
      headers: authHeader(),
    }),

  patch: (slug: string, data: Partial<ResortInput> | FormData) =>
    apiClient<OwnerResort>(`/owner/resorts/${slug}/`, {
      method: "PATCH",
      body: data,
      headers: authHeader(),
    }),

  remove: (slug: string) =>
    apiClient<void>(`/owner/resorts/${slug}/`, {
      method: "DELETE",
      headers: authHeader(),
    }),

  uploadCoverPhoto: (slug: string, data: FormData) =>
    apiClient<{ cover_photo: string }>(`/owner/resorts/${slug}/cover-photo/`, {
      method: "POST",
      body: data,
      headers: authHeader(),
    }),

  listGalleryImages: (slug: string) =>
    apiClient<GalleryImage[]>(`/owner/resorts/${slug}/gallery/`, {
      headers: authHeader(),
    }),

  uploadGalleryImage: (slug: string, data: FormData) =>
    apiClient<GalleryImage>(`/owner/resorts/${slug}/gallery/`, {
      method: "POST",
      body: data,
      headers: authHeader(),
    }),

  deleteGalleryImage: (slug: string, id: number) =>
    apiClient<void>(`/owner/resorts/${slug}/gallery/${id}/`, {
      method: "DELETE",
      headers: authHeader(),
    }),
};
