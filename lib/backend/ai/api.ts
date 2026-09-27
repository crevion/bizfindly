import { apiClient, type Paginated } from "@/lib/backend/api";
import type { RestaurantListItem } from "@/lib/backend/restaurants";

export interface AiRestaurantQuery {
  query: string;
  params: Record<string, string | number | boolean>;
  query_string: string;
}

export const aiRestaurantsApi = {
  interpret: (query: string) =>
    apiClient<AiRestaurantQuery>("/ai-query/restaurants/", { method: "POST", body: { query } }),
  list: (queryString = "") =>
    apiClient<Paginated<RestaurantListItem>>(
      `/restaurants/${queryString ? `?${queryString.replace(/^\?/, "")}` : ""}`,
    ),
};
