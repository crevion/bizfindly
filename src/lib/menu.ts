// Restaurant menu storage (frontend MVP — localStorage)

export type ProductStatus = "available" | "out" | "seasonal";

export interface MenuProduct {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string; // data URL
  images?: string[];
  status: ProductStatus;
  flags: {
    veg?: boolean;
    spicy?: boolean;
    bestseller?: boolean;
    chef?: boolean;
    new?: boolean;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  products: MenuProduct[];
}

export type RestaurantMenu = MenuCategory[];

const key = (restaurantId: string) => `bizfindly:menu:${restaurantId}`;

export function loadMenu(restaurantId: string): RestaurantMenu {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key(restaurantId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RestaurantMenu;
    return parsed.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export function saveMenu(restaurantId: string, menu: RestaurantMenu) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key(restaurantId), JSON.stringify(menu));
  } catch {
    /* quota */
  }
}

export const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const discountPercent = (price: number, original?: number) => {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
};

export const formatPrice = (n: number) => `৳${n.toLocaleString()}`;
