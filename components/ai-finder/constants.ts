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

export const BD_CITIES = [
  { name: "Dhaka", lat: 23.8103, long: 90.4125 },
  { name: "Chittagong", lat: 22.3569, long: 91.7832 },
  { name: "Sylhet", lat: 24.8949, long: 91.8687 },
  { name: "Cox's Bazar", lat: 21.4272, long: 92.0058 },
  { name: "Gazipur", lat: 23.9999, long: 90.4203 },
  { name: "Sreemangal", lat: 24.3065, long: 91.7296 },
  { name: "Rajshahi", lat: 24.3745, long: 88.6042 },
  { name: "Khulna", lat: 22.8456, long: 89.5403 },
];

export const DHAKA_AREAS = [
  { name: "Gulshan", lat: 23.7925, long: 90.4078 },
  { name: "Banani", lat: 23.7937, long: 90.4066 },
  { name: "Dhanmondi", lat: 23.7465, long: 90.376 },
  { name: "Uttara", lat: 23.8759, long: 90.3795 },
  { name: "Bashundhara", lat: 23.8191, long: 90.4284 },
  { name: "Mirpur", lat: 23.8223, long: 90.3654 },
  { name: "Mohakhali", lat: 23.7781, long: 90.3995 },
  { name: "Baily Road", lat: 23.7412, long: 90.4087 },
  { name: "Old Dhaka", lat: 23.7104, long: 90.4074 },
];

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
