export const LIST_TABS = ["All", "Trending", "Saved"] as const;
export type ListTab = (typeof LIST_TABS)[number];
export const DEFAULT_LIST_TAB: ListTab = "All";

export const SORT_OPTIONS = [
  "Rating: High to Low",
  "Price: Low to High",
  "Price: High to Low",
  "Most Reviews",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];
export const DEFAULT_SORT: SortOption = "Rating: High to Low";

export const PLACES_PAGE_SIZE = 8;
export const BUDGET_MAX = 10000;

export const PLACE_VIBES = [
  { label: "Rooftop", icon: "🌆" },
  { label: "Couple Spot", icon: "❤️" },
  { label: "Family Friendly", icon: "👨‍👩‍👧" },
  { label: "Fine Dining", icon: "🥂" },
  { label: "Budget Friendly", icon: "💸" },
  { label: "Live Music", icon: "🎵" },
  { label: "Swimming Pool", icon: "🏊" },
  { label: "Beachfront", icon: "🏖️" },
  { label: "AC", icon: "❄️" },
  { label: "Wifi", icon: "📶" },
  { label: "Female Trainer", icon: "💪" },
];

export const CUISINES_LIST = [
  "Bangla",
  "Biryani",
  "Continental",
  "Italian",
  "Japanese",
  "Sushi",
  "Thai",
  "Chinese",
  "Indian",
  "Cafe & Bakery",
  "Fast Food",
  "Seafood",
  "Steakhouse",
];

export interface MapCenter {
  lat: number;
  lng: number;
}

export const DEFAULT_MAP_CENTER: MapCenter = { lat: 23.8103, lng: 90.4125 };

export const MILES_TO_KM = 1.60934;
