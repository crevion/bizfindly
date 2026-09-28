import { apiClient, ApiError, type Paginated } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";

export interface DashboardListing {
  id: string;
  category: "restaurant" | "resort" | "gym";
  slug: string;
  name: string;
  city: string;
  area: string;
  cover_photo: string | null;
  views: number;
  saves: number;
  rating: string;
  review_count: number;
}
export interface DashboardDetail extends DashboardListing {
  address: string;
  google_map_url: string;
  latitude: string | null;
  longitude: string | null;
  description: string;
  phone: string;
  website: string;
  opening_hours: string | Record<string, unknown>;
  offer_description: string;
  offer_code: string;
  promotion_status: string | null;
  saves_week: { date: string; count: number }[];
}
export interface OwnerReview {
  id: number;
  user_name: string;
  star: number;
  comment: string;
  created_at: string;
  owner_reply: string;
}
export interface AiDescription {
  slug: string;
  category: string;
  description: string;
}
export interface OwnerPhoto {
  id: number;
  image: string;
  caption: string;
}
export const dashboardPath = (listing: Pick<DashboardListing, "category" | "slug">) =>
  `/owner/dashboard/${listing.category}/${encodeURIComponent(listing.slug)}/`;
export const dashboardApi = {
  isMine: async (listing: Pick<DashboardListing, "category" | "slug">): Promise<boolean> => {
    try {
      await apiClient(dashboardPath(listing), { headers: authHeader() });
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return false;
      throw error;
    }
  },
  listings: (page: number) =>
    apiClient<Paginated<DashboardListing>>(`/owner/dashboard/?page=${page}`, {
      headers: authHeader(),
    }),
  detail: (listing: DashboardListing) =>
    apiClient<DashboardDetail>(dashboardPath(listing), { headers: authHeader() }),
  reviews: (listing: DashboardListing, page: number) =>
    apiClient<Paginated<OwnerReview>>(`${dashboardPath(listing)}reviews/?page=${page}`, {
      headers: authHeader(),
    }),
  photos: (listing: DashboardListing, page: number) =>
    apiClient<Paginated<OwnerPhoto>>(`${dashboardPath(listing)}gallery/?page=${page}`, {
      headers: authHeader(),
    }),
  // Writes nothing: the owner reviews the text and saves the listing themselves.
  aiDescription: (listing: Pick<DashboardListing, "slug">) =>
    apiClient<AiDescription>(
      `/owner/businesses/${encodeURIComponent(listing.slug)}/ai-description/`,
      { method: "POST", headers: authHeader() },
    ),
  change: (
    listing: DashboardListing,
    suffix: string,
    method: "PATCH" | "POST" | "PUT" | "DELETE",
    body?: unknown,
  ) => apiClient(`${dashboardPath(listing)}${suffix}`, { method, body, headers: authHeader() }),
};
