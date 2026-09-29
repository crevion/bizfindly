import { formatOpeningHours } from "@/lib/backend/places/hours";
import { toCoords } from "@/lib/backend/places/map";
import { apiClient, buildQuery, type NamedSlug, type Paginated } from "@/lib/backend/api";
import type { Place } from "@/types/place";

export interface GymListItem {
  is_open_now: boolean | null;
  has_offer: boolean;
  name: string;
  slug: string;
  cover_photo: string | null;
  city: string;
  area: string;
  rating: string;
  review_count: number;
  is_trending: boolean;
  is_verified: boolean;
  price_min: string | null;
  price_max: string | null;
  budget_tier: string;
  gender_targets: NamedSlug[];
  main_goals: NamedSlug[];
  latitude: string | null;
  longitude: string | null;
  distance_km: number | null;
}

export interface GymDetail extends GymListItem {
  address: string;
  google_map_url: string;
  latitude: string | null;
  longitude: string | null;
  gallery: { image: string }[];
  tags: NamedSlug[];
  facilities: NamedSlug[];
  opening_hours: string;
  phone: string;
  website: string;
  description: string;
  ai_summary: string;
  offer_code: string;
  offer_description: string;
}

export const gymsApi = {
  list: (params: { page_size?: number; search?: string } = {}) =>
    apiClient<Paginated<GymListItem>>(`/gyms/${buildQuery(params)}`),
  detail: (slug: string) => apiClient<GymDetail>(`/gyms/${slug}/`),
};

export function mapGym(gym: GymListItem | GymDetail): Place {
  const detail = "gallery" in gym ? gym : undefined;
  const image = gym.cover_photo || detail?.gallery[0]?.image || "/images/place-placeholder.svg";
  const min = Number(gym.price_min);
  const max = Number(gym.price_max);
  const priceLevel =
    ({ budget: 1, mid_range: 2, premium: 3, luxury: 4 } as const)[gym.budget_tier] ?? 2;
  return {
    id: gym.slug,
    slug: gym.slug,
    name: gym.name,
    category: "gym",
    location: [gym.area, gym.city].filter(Boolean).join(", ") || gym.city,
    area: gym.area || gym.city,
    image,
    gallery: detail?.gallery.length ? detail.gallery.map((item) => item.image) : [image],
    rating: Number(gym.rating) || 0,
    reviews: gym.review_count,
    priceLevel,
    priceRange:
      min && max ? `৳ ${min}–${max}` : min || max ? `৳ ${min || max}` : "Price on request",
    tags:
      detail?.tags.map((tag) => tag.name) ??
      [...gym.gender_targets, ...gym.main_goals].map((tag) => tag.name),
    facilities: detail?.facilities.map((facility) => facility.name) ?? [],
    hours: formatOpeningHours(detail?.opening_hours),
    phone: detail?.phone ?? "",
    website: detail?.website || undefined,
    offerCode: detail?.offer_code?.trim() || undefined,
    offerDescription: detail?.offer_description?.trim() || undefined,
    description: detail?.description ?? "",
    aiSummary: detail?.ai_summary ?? "",
    trending: gym.is_trending,
    verified: gym.is_verified,
    coords: toCoords(gym.latitude, gym.longitude),
    distanceKm: gym.distance_km ?? undefined,
    openNow: gym.is_open_now,
    hasOffer: gym.has_offer,
    mapUrl: detail?.google_map_url || undefined,
  };
}
