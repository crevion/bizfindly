import { formatOpeningHours } from "@/lib/backend/places/hours";
import type { Place, PlaceReview } from "@/types/place";
import type { RestaurantDetail, RestaurantListItem } from "@/lib/backend/restaurants";
import type { ResortDetail, ResortListItem } from "@/lib/backend/resorts";
import type { Review } from "@/lib/backend/reviews";

const FALLBACK_IMAGE = "/images/place-placeholder.svg";

type PriceLevel = 1 | 2 | 3 | 4;

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

type PriceValue = number | string | null | undefined;

export function toCoords(
  latRaw: string | number | null | undefined,
  lngRaw: string | number | null | undefined,
): { lat: number; lng: number } | undefined {
  if (latRaw === null || latRaw === undefined || lngRaw === null || lngRaw === undefined) {
    return undefined;
  }
  const lat = typeof latRaw === "number" ? latRaw : parseFloat(latRaw);
  const lng = typeof lngRaw === "number" ? lngRaw : parseFloat(lngRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  return { lat, lng };
}

function restaurantPriceLevel(minRaw: PriceValue, maxRaw: PriceValue): PriceLevel {
  const min = toNumber(minRaw);
  const max = toNumber(maxRaw);
  const ref = max || min || 0;
  if (ref <= 0) return 2;
  if (ref <= 400) return 1;
  if (ref <= 900) return 2;
  if (ref <= 1800) return 3;
  return 4;
}

function resortPriceLevel(perNight: number): PriceLevel {
  if (perNight <= 0) return 2;
  if (perNight <= 3000) return 1;
  if (perNight <= 7000) return 2;
  if (perNight <= 12000) return 3;
  return 4;
}

function priceText(level: PriceLevel, range: string): string {
  return `${"৳".repeat(level)} • ${range}`;
}

function restaurantRange(minRaw: PriceValue, maxRaw: PriceValue): string {
  const min = toNumber(minRaw);
  const max = toNumber(maxRaw);
  if (min && max) return `${min}–${max} per person`;
  if (max) return `up to ${max} per person`;
  if (min) return `from ${min} per person`;
  return "Price on request";
}

export function mapRestaurantListItem(r: RestaurantListItem): Place {
  const level = restaurantPriceLevel(r.price_min, r.price_max);
  return {
    id: r.slug,
    slug: r.slug,
    name: r.name,
    category: "restaurant",
    cuisine: r.cuisine_types.map((c) => c.name).join(" • ") || undefined,
    location: r.city,
    area: r.city,
    image: r.cover_photo || FALLBACK_IMAGE,
    gallery: [r.cover_photo || FALLBACK_IMAGE],
    rating: toNumber(r.rating),
    reviews: r.review_count,
    priceLevel: level,
    priceRange: priceText(level, restaurantRange(r.price_min, r.price_max)),
    tags: [],
    facilities: [],
    hours: "",
    phone: "",
    description: "",
    aiSummary: "",
    trending: r.is_trending,
    coords: toCoords(r.latitude, r.longitude),
    distanceKm: r.distance_km ?? undefined,
  };
}

export function mapRestaurantDetail(d: RestaurantDetail): Place {
  const menu = d.menu;
  const level = restaurantPriceLevel(d.price_min, d.price_max);
  // Photos of the place itself: the cover first, then its gallery. Menu item
  // photos stay with the menu -- a plate of food is not a cover shot.
  const photos = [d.cover_photo, ...d.gallery.map((photo) => photo.image)];
  const uniquePhotos = [
    ...new Set(
      photos.filter(
        (photo): photo is string => typeof photo === "string" && photo.trim().length > 0,
      ),
    ),
  ];
  const gallery = uniquePhotos.length ? uniquePhotos : [FALLBACK_IMAGE];
  return {
    id: d.slug,
    slug: d.slug,
    name: d.name,
    category: "restaurant",
    cuisine: d.cuisine_types.map((c) => c.name).join(" • ") || undefined,
    location: [d.area, d.city].filter(Boolean).join(", ") || d.city,
    area: d.area || d.city,
    image: gallery[0],
    gallery,
    rating: toNumber(d.rating),
    reviews: d.review_count,
    priceLevel: level,
    priceRange: priceText(level, restaurantRange(d.price_min, d.price_max)),
    tags: d.tags.map((t) => t.name),
    facilities: d.facilities.map((f) => f.name),
    hours: formatOpeningHours(d.opening_hours),
    phone: d.phone,
    website: d.website || undefined,
    offerCode: d.offer_code?.trim() || undefined,
    offerDescription: d.offer_description?.trim() || undefined,
    description: d.description,
    aiSummary: d.ai_summary,
    trending: d.is_trending,
    verified: d.is_verified,
    coords: toCoords(d.latitude, d.longitude),
    mapUrl: d.google_map_url || undefined,
    menu: menu?.length
      ? menu.map((c) => ({
          category: c.name,
          items: c.items.map((i) => ({
            name: i.name,
            price: `৳ ${i.discount_price ?? i.price}`,
            originalPrice: i.discount_price != null ? `৳ ${i.price}` : undefined,
            description: i.description,
            available: i.is_available,
            image: i.image,
          })),
        }))
      : undefined,
  };
}

export function mapResortListItem(r: ResortListItem): Place {
  const perNight = toNumber(r.price_per_night);
  const level = resortPriceLevel(perNight);
  return {
    id: r.slug,
    slug: r.slug,
    name: r.name,
    category: "resort",
    location: r.city,
    area: r.city,
    image: r.cover_photo || FALLBACK_IMAGE,
    gallery: [r.cover_photo || FALLBACK_IMAGE],
    rating: toNumber(r.rating),
    reviews: r.review_count,
    priceLevel: level,
    priceRange: priceText(level, perNight ? `${perNight}/night` : "Price on request"),
    tags: [],
    facilities: [],
    hours: "",
    phone: "",
    description: "",
    aiSummary: "",
    trending: r.is_trending,
    verified: r.is_verified,
    coords: toCoords(r.latitude, r.longitude),
    distanceKm: r.distance_km ?? undefined,
  };
}

export function mapResortDetail(d: ResortDetail): Place {
  const perNight = toNumber(d.price_per_night);
  const level = resortPriceLevel(perNight);
  return {
    id: d.slug,
    slug: d.slug,
    name: d.name,
    category: "resort",
    location: [d.area, d.city].filter(Boolean).join(", ") || d.city,
    area: d.area || d.city,
    image: FALLBACK_IMAGE,
    gallery: [FALLBACK_IMAGE],
    rating: toNumber(d.rating),
    reviews: d.review_count,
    priceLevel: level,
    priceRange: priceText(level, perNight ? `${perNight}/night` : "Price on request"),
    tags: d.tags.map((t) => t.name),
    facilities: d.facilities.map((f) => f.name),
    hours: formatOpeningHours(d.opening_hours),
    phone: d.phone,
    website: d.website || undefined,
    offerCode: d.offer_code?.trim() || undefined,
    offerDescription: d.offer_description?.trim() || undefined,
    description: d.description,
    aiSummary: d.ai_summary,
    trending: d.is_trending,
    verified: d.is_verified,
    coords: toCoords(d.latitude, d.longitude),
    mapUrl: d.google_map_url || undefined,
  };
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "U";
}

function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function mapReview(r: Review): PlaceReview {
  return {
    user: r.user_name,
    rating: r.star,
    date: formatReviewDate(r.created_at),
    text: r.comment,
    ownerReply: r.owner_reply,
    avatar: initials(r.user_name),
  };
}
