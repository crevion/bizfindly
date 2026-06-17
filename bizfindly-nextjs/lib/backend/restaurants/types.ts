import type { NamedSlug } from "@/lib/backend/api";

export type BudgetTier = "budget" | "mid_range" | "premium" | "luxury";

export interface RestaurantListItem {
  is_trending: boolean;
  name: string;
  slug: string;
  views?: number;
  cover_photo: string | null;
  city: string;
  rating: string;
  review_count: number;
  cuisine_types: NamedSlug[];
  price_min: number | string | null;
  price_max: number | string | null;
}

export interface GalleryImage {
  id?: number;
  image: string;
  caption: string;
  order: number;
}

export interface RestaurantDetail {
  name: string;
  slug: string;
  views?: number;
  is_verified: boolean;
  is_trending: boolean;
  gallery: GalleryImage[];
  city: string;
  area: string;
  address: string;
  phone: string;
  website: string;
  opening_hours: string;
  rating: string;
  review_count: number;
  cuisine_types: NamedSlug[];
  price_min: number | null;
  price_max: number | null;
  budget_tier: BudgetTier | null;
  description: string;
  ai_summary: string;
  offer_description: string | null;
  offer_code: string | null;
  tags: NamedSlug[];
  facilities: NamedSlug[];
  occasions: NamedSlug[];
  vibes: NamedSlug[];
  group_types: NamedSlug[];
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  is_available: boolean;
}

export interface MenuCategory {
  name: string;
  slug: string;
  items: MenuItem[];
}

export interface RestaurantListParams {
  city?: string;
  area?: string;
  search?: string;
  cuisine?: string;
  occasion?: string;
  vibe?: string;
  group_type?: string;
  budget_tier?: BudgetTier;
  page?: number;
  page_size?: number;
}

export interface MenuParams {
  page?: number;
  page_size?: number;
}

export type SocialLink = Record<string, string>;

export interface RestaurantInput {
  name: string;
  city: string;
  area?: string;
  address?: string;
  phone?: string;
  website?: string;
  opening_hours?: string;
  description?: string;
  ai_summary?: string;
  price_min?: string;
  price_max?: string;
  budget_tier?: BudgetTier;
  offer_description?: string;
  offer_code?: string;
  business_type?: number;
  social_links?: SocialLink[];
  cuisine_types?: number[];
  tags?: number[];
  facilities?: number[];
  occasions?: number[];
  vibes?: number[];
  group_types?: number[];
}
