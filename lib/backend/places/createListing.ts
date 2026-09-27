import { restaurantsApi } from "@/lib/backend/restaurants";
import { resortsApi } from "@/lib/backend/resorts";
import { loadTaxonomy } from "@/lib/backend/taxonomy/useTaxonomy";
import type { BusinessType } from "@/lib/backend/taxonomy";
import type { ListingCategory, ListingDraft } from "@/types/listing";

const BUSINESS_TYPE_SLUG: Record<ListingCategory, string> = {
  restaurant: "restaurant",
  resort: "resorts",
  gym: "gyms",
};

async function resolveBusinessTypeId(category: ListingCategory): Promise<number | undefined> {
  try {
    const types = await loadTaxonomy<BusinessType>("businessTypes");
    return types.find((t) => t.slug === BUSINESS_TYPE_SLUG[category])?.id;
  } catch {
    return undefined;
  }
}

const clean = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export interface CreatedListing {
  slug?: string;
}

export async function createListingFromDraft(draft: ListingDraft): Promise<CreatedListing | null> {
  if (draft.category === "restaurant") {
    const business_type = await resolveBusinessTypeId("restaurant");
    const detail = await restaurantsApi.create({
      name: draft.name.trim(),
      city: clean(draft.area) ?? draft.location.trim(),
      area: clean(draft.area),
      address: clean(draft.location),
      google_map_url: clean(draft.mapUrl),
      latitude: clean(draft.latitude),
      longitude: clean(draft.longitude),
      phone: clean(draft.phone),
      website: clean(draft.website),
      opening_hours: clean(draft.hours),
      description: clean(draft.description),
      price_min: clean(draft.priceMin),
      price_max: clean(draft.priceMax),
      business_type,
      cuisine_types: draft.cuisineIds,
      tags: draft.tagIds,
      facilities: draft.facilityIds,
      occasions: draft.occasionIds,
      vibes: draft.vibeIds,
      group_types: draft.groupTypeIds,
    });
    return { slug: detail.slug };
  }

  if (draft.category === "resort") {
    const business_type = await resolveBusinessTypeId("resort");
    const created = await resortsApi.create({
      name: draft.name.trim(),
      city: clean(draft.area) ?? draft.location.trim(),
      area: clean(draft.area),
      address: clean(draft.location),
      google_map_url: clean(draft.mapUrl),
      latitude: clean(draft.latitude),
      longitude: clean(draft.longitude),
      opening_hours: clean(draft.hours),
      description: clean(draft.description),
      price_per_night: clean(draft.priceMin),
      phone: clean(draft.phone),
      website: clean(draft.website),
      business_type,
      tags: draft.tagIds,
      facilities: draft.facilityIds,
    });
    return { slug: created.slug };
  }

  return null;
}
