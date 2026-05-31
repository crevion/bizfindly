import type { LucideIcon } from "lucide-react";

export type ListingCategory = "restaurant" | "resort" | "gym";

export type ListingStepId =
  | "category"
  | "basics"
  | "details"
  | "facilities"
  | "tags"
  | "images"
  | "description"
  | "preview"
  | "done";

export interface CategoryFacility {
  key: string;
  label: string;
}

export interface CategoryImageGroup {
  key: string;
  label: string;
}

export interface CategoryConfig {
  id: ListingCategory;
  label: string;
  tagline: string;
  icon: LucideIcon;
  image: string;
  gradient: string;
  facilities: CategoryFacility[];
  tags: string[];
  imageGroups: CategoryImageGroup[];
  pricingLabel: string;
  pricingPlaceholder: string;
  priceMinPlaceholder: string;
  priceMaxPlaceholder: string;
  nameLabel: string;
}

export interface ListingDraft {
  id?: string;
  category: ListingCategory | null;
  name: string;
  location: string;
  area: string;
  mapUrl: string;
  phone: string;
  hours: string;
  pricing: string;
  priceMin: string;
  priceMax: string;
  cuisine?: string;
  rooms?: string;
  checkIn?: string;
  checkOut?: string;
  facilities: Record<string, boolean>;
  tags: string[];
  description: string;
  images: Record<string, string[]>;
  createdAt?: string;
}
