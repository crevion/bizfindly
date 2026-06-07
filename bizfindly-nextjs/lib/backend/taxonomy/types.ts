import type { NamedSlug } from "@/lib/backend/api";

export type { NamedSlug };

export type BusinessTypeSlug = "restaurant" | "resort" | "gym" | string;

export interface BusinessType extends NamedSlug {
  cover_photo: string | null;
  description: string;
}

export interface TaxonomyParams {
  page?: number;
  page_size?: number;
}

export interface BusinessScopedParams extends TaxonomyParams {
  business_type?: BusinessTypeSlug;
}
