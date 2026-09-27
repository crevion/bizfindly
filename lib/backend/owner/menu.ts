import { apiClient, type Paginated } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";

export interface OwnerMenuItem {
  id: number;
  category: number | null;
  category_name?: string;
  name: string;
  description: string;
  image: string | null;
  price: string;
  discount_price: string | null;
  is_available: boolean;
}
export interface MenuCategory {
  id: number;
  name: string;
}
async function page<T>(path: string): Promise<Paginated<T>> {
  const data = await apiClient<Paginated<T> | T[]>(path, { headers: authHeader() });
  return Array.isArray(data)
    ? { count: data.length, next: null, previous: null, results: data }
    : data;
}
const base = (slug: string) => `/owner/restaurants/${encodeURIComponent(slug)}/menu-items/`;
export const ownerMenuApi = {
  list: (slug: string, number: number) => page<OwnerMenuItem>(`${base(slug)}?page=${number}`),
  categories: async () => {
    const results: MenuCategory[] = [];
    let number = 1;
    while (true) {
      const data = await page<MenuCategory>(`/owner/menu-categories/?page=${number}`);
      results.push(...data.results);
      if (!data.next) return results;
      number++;
    }
  },
  createCategory: (name: string) =>
    apiClient<MenuCategory>("/owner/menu-categories/", {
      method: "POST",
      body: { name },
      headers: authHeader(),
    }),
  save: (slug: string, id: number | undefined, body: FormData) =>
    apiClient<OwnerMenuItem>(`${base(slug)}${id ? `${id}/` : ""}`, {
      method: id ? "PATCH" : "POST",
      body,
      headers: authHeader(),
    }),
  remove: (slug: string, id: number) =>
    apiClient(`${base(slug)}${id}/`, { method: "DELETE", headers: authHeader() }),
};
