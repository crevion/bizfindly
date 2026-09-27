import { formatOpeningHours } from "@/lib/backend/places/hours";
import { restaurantsApi, type RestaurantDetail } from "@/lib/backend/restaurants";
import { resortsApi, type OwnerResort } from "@/lib/backend/resorts";
import { emptyDraft } from "@/content/listingCategories";
import type { ListingDraft } from "@/types/listing";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function facilitiesRecord(items: { slug: string }[]): Record<string, boolean> {
  return items.reduce<Record<string, boolean>>((acc, f) => {
    acc[f.slug] = true;
    return acc;
  }, {});
}

function mapRestaurant(r: RestaurantDetail): ListingDraft {
  const images = r.gallery?.map((g) => g.image).filter(Boolean) ?? [];
  return {
    ...emptyDraft(),
    id: r.slug,
    slug: r.slug,
    remote: true,
    category: "restaurant",
    name: r.name,
    location: [r.area, r.city].filter(Boolean).join(", ") || r.city,
    area: r.area || r.city,
    phone: r.phone || "",
    website: r.website || "",
    hours: formatOpeningHours(r.opening_hours),
    priceMin: r.price_min != null ? String(r.price_min) : "",
    priceMax: r.price_max != null ? String(r.price_max) : "",
    pricing: r.price_min != null && r.price_max != null ? `৳${r.price_min} – ৳${r.price_max}` : "",
    description: r.description || "",
    tags: r.tags?.map((t) => t.name) ?? [],
    facilities: facilitiesRecord(r.facilities ?? []),
    images: images.length ? { gallery: images } : {},
    views: r.views,
    rating: toNumber(r.rating),
    reviewCount: r.review_count,
    verified: r.is_verified,
  };
}

function mapResort(r: OwnerResort): ListingDraft {
  return {
    ...emptyDraft(),
    id: r.slug ?? r.name,
    slug: r.slug,
    remote: true,
    category: "resort",
    name: r.name,
    location: [r.area, r.city].filter(Boolean).join(", ") || r.city,
    area: r.area || r.city,
    phone: r.phone || "",
    website: r.website || "",
    hours: formatOpeningHours(r.opening_hours),
    priceMin: r.price_per_night ? String(r.price_per_night) : "",
    pricing: r.price_per_night ? `৳${r.price_per_night}/night` : "",
    description: r.description || "",
    images: r.cover_photo ? { property: [r.cover_photo] } : {},
  };
}

export async function listOwnerListings(): Promise<ListingDraft[]> {
  const [restaurants, resorts] = await Promise.allSettled([
    restaurantsApi.listMine(),
    resortsApi.listMine(),
  ]);

  const out: ListingDraft[] = [];
  if (restaurants.status === "fulfilled") {
    out.push(...restaurants.value.map(mapRestaurant));
  }
  if (resorts.status === "fulfilled") {
    out.push(...resorts.value.map(mapResort));
  }
  return out;
}
