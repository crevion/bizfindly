import type { Category } from "@/types/place";

export type DiscoverCategory = Extract<Category, "restaurant" | "resort" | "gym">;

export const POPULAR_AREAS = [
  "Dhanmondi",
  "Gulshan",
  "Banani",
  "Uttara",
  "Bashundhara",
  "Gazipur",
  "Cox's Bazar",
  "Sajek",
];
