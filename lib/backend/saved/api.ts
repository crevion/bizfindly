import { apiClient, type Paginated } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";
import type { RestaurantListItem } from "@/lib/backend/restaurants";
import type { ResortListItem } from "@/lib/backend/resorts";
import { mapRestaurantListItem, mapResortListItem } from "@/lib/backend/places/map";
import { mapGym } from "@/lib/backend/gyms/api";
import type { Category, Place } from "@/types/place";

type SavedItem = { id: number; created_at: string } & (
  | { category: "restaurant"; place: RestaurantListItem }
  | { category: "resort"; place: ResortListItem }
  | { category: "gym"; place: Parameters<typeof mapGym>[0] }
);

const targetPath = (category: Category, slug: string) => `/users/saved-places/${category}/${encodeURIComponent(slug)}/`;
export const savedApi = {
  list: (page = 1) => apiClient<Paginated<SavedItem>>(`/users/saved-places/?page=${page}`, { headers: authHeader() }),
  status: (category: Category, slug: string) => apiClient<{ saved: boolean }>(targetPath(category, slug), { headers: authHeader() }),
  save: (category: Category, slug: string) => apiClient<{ saved: boolean }>(targetPath(category, slug), { method: "PUT", headers: authHeader() }),
  remove: (category: Category, slug: string) => apiClient<void>(targetPath(category, slug), { method: "DELETE", headers: authHeader() }),
};

export function savedItemToPlace(item: SavedItem): Place {
  if (item.category === "restaurant") return mapRestaurantListItem(item.place);
  if (item.category === "resort") return mapResortListItem(item.place);
  return mapGym(item.place);
}
