import type { NamedSlug } from "@/lib/backend/api";

export interface ResortListItem {
  is_trending: boolean;
  is_verified: boolean;
  name: string;
  slug: string;
  city: string;
  cover_photo: string | null;
  rating: string;
  review_count: number;
  price_per_night: string;
}

export interface ResortDetail {
  name: string;
  slug: string;
  is_verified: boolean;
  is_trending: boolean;
  business_type: NamedSlug | null;
  city: string;
  phone: string;
  website: string;
  opening_hours: string;
  rating: string;
  review_count: number;
  price_per_night: string;
  description: string;
  ai_summary: string;
  offer_description: string;
  offer_code: string;
  tags: NamedSlug[];
  facilities: NamedSlug[];
}

export interface OwnerResort {
  name: string;
  slug?: string;
  city: string;
  area: string;
  address: string;
  opening_hours: string;
  description: string;
  ai_summary: string;
  price_per_night: string;
  phone: string;
  website: string;
  offer_description: string;
  offer_code: string;
  cover_photo: string | null;
  business_type: number | null;
  tags: number[];
  facilities: number[];
}

export interface ResortListParams {
  city?: string;
  tag?: string;
  facility?: string;
  search?: string;
  is_trending?: boolean;
  page?: number;
  page_size?: number;
}

export interface ResortInput {
  name: string;
  city: string;
  area?: string;
  address?: string;
  opening_hours?: string;
  description?: string;
  ai_summary?: string;
  price_per_night?: string;
  phone?: string;
  website?: string;
  offer_description?: string;
  offer_code?: string;
  business_type?: number;
  tags?: number[];
  facilities?: number[];
}
