import type { Category } from "@/types/place";

export type DiscoverCategory = Extract<Category, "restaurant" | "resort" | "gym">;

export const DISCOVER_CATEGORIES: { key: DiscoverCategory; label: string; emoji: string }[] = [
  { key: "restaurant", label: "Restaurants", emoji: "🍽️" },
  { key: "resort", label: "Resorts", emoji: "🌴" },
  { key: "gym", label: "Gyms", emoji: "🏋️" },
];

export const QUICK_FILTERS: Record<DiscoverCategory, string[]> = {
  restaurant: [
    "Rooftop",
    "Buffet",
    "Family Friendly",
    "Couple Friendly",
    "Fine Dining",
    "Budget Friendly",
    "Live Music",
    "Delivery",
    "Open Now",
    "Trending",
  ],
  resort: [
    "Swimming Pool",
    "Couple Resort",
    "Family Resort",
    "Luxury",
    "Near Dhaka",
    "BBQ",
    "Nature",
    "Private Villa",
  ],
  gym: [
    "AC Gym",
    "Female Trainer",
    "Weight Training",
    "Cardio",
    "Women Friendly",
    "Budget Gym",
    "Premium Gym",
  ],
};

export const PRICE_BOUNDS: Record<DiscoverCategory, [number, number, string]> = {
  restaurant: [200, 3000, "per person"],
  resort: [1000, 15000, "per night"],
  gym: [800, 8000, "per month"],
};

export const TRENDING_SEARCHES = [
  "Rooftop dinner",
  "Couple resort Gazipur",
  "Female trainer gym",
  "Buffet Dhanmondi",
];

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

export const SORT_OPTIONS = ["Recommended", "Top rated", "Most reviewed", "Budget first"] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];
