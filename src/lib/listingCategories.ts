import type { LucideIcon } from "lucide-react";
import { Dumbbell, Palmtree, UtensilsCrossed } from "lucide-react";

export type ListingCategory = "restaurant" | "resort" | "gym";

export interface CategoryConfig {
  id: ListingCategory;
  label: string;
  tagline: string;
  icon: LucideIcon;
  image: string;
  gradient: string;
  facilities: { key: string; label: string }[];
  tags: string[];
  imageGroups: { key: string; label: string }[];
  pricingLabel: string;
  pricingPlaceholder: string;
  nameLabel: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const CATEGORIES: Record<ListingCategory, CategoryConfig> = {
  restaurant: {
    id: "restaurant",
    label: "Restaurant",
    tagline: "Cafés, fine dining, rooftops & more",
    icon: UtensilsCrossed,
    image: img("photo-1517248135467-4c7edcad34c4"),
    gradient: "from-orange-500/80 via-rose-500/70 to-amber-500/80",
    nameLabel: "Restaurant name",
    pricingLabel: "Average meal price (per person)",
    pricingPlaceholder: "৳ 800",
    facilities: [
      { key: "rooftop", label: "Rooftop" },
      { key: "buffet", label: "Buffet" },
      { key: "reservation", label: "Reservation" },
      { key: "kids", label: "Kids friendly" },
      { key: "parking", label: "Parking" },
      { key: "liveMusic", label: "Live music" },
      { key: "delivery", label: "Delivery" },
      { key: "ac", label: "Air conditioned" },
    ],
    tags: [
      "Family Friendly",
      "Couple Friendly",
      "Rooftop Dining",
      "Buffet",
      "Cafe Hangout",
      "Fine Dining",
      "Instagrammable",
      "Budget Friendly",
    ],
    imageGroups: [
      { key: "food", label: "Food photos" },
      { key: "interior", label: "Interior" },
      { key: "exterior", label: "Exterior" },
      { key: "menu", label: "Menu" },
    ],
  },
  resort: {
    id: "resort",
    label: "Resort",
    tagline: "Beach, hill, lake & luxury stays",
    icon: Palmtree,
    image: img("photo-1566073771259-6a8506099945"),
    gradient: "from-emerald-500/80 via-teal-500/70 to-cyan-500/80",
    nameLabel: "Resort name",
    pricingLabel: "Starting room price (per night)",
    pricingPlaceholder: "৳ 6,500",
    facilities: [
      { key: "pool", label: "Swimming pool" },
      { key: "villa", label: "Private villa" },
      { key: "bbq", label: "BBQ facilities" },
      { key: "wifi", label: "WiFi" },
      { key: "parking", label: "Parking" },
      { key: "family", label: "Family friendly" },
      { key: "couple", label: "Couple friendly" },
      { key: "spa", label: "Spa" },
    ],
    tags: [
      "Staycation",
      "Couple Retreat",
      "Family Resort",
      "Luxury Resort",
      "Nature Resort",
      "Beachfront",
      "Hill View",
    ],
    imageGroups: [
      { key: "rooms", label: "Rooms" },
      { key: "property", label: "Property" },
      { key: "facilities", label: "Facilities" },
    ],
  },
  gym: {
    id: "gym",
    label: "Gym",
    tagline: "Fitness studios, CrossFit & training",
    icon: Dumbbell,
    image: img("photo-1534438327276-14e5300c3a48"),
    gradient: "from-indigo-500/80 via-violet-500/70 to-fuchsia-500/80",
    nameLabel: "Gym name",
    pricingLabel: "Monthly membership price",
    pricingPlaceholder: "৳ 2,500",
    facilities: [
      { key: "trainer", label: "Trainer available" },
      { key: "femaleTrainer", label: "Female trainer" },
      { key: "cardio", label: "Cardio section" },
      { key: "weights", label: "Weight training" },
      { key: "ac", label: "Air conditioned" },
      { key: "parking", label: "Parking" },
      { key: "shower", label: "Shower room" },
      { key: "locker", label: "Lockers" },
    ],
    tags: [
      "Men Only",
      "Women Only",
      "Mixed Gym",
      "Beginner Friendly",
      "Premium Fitness",
      "CrossFit",
      "24/7 Access",
    ],
    imageGroups: [
      { key: "gym", label: "Gym floor" },
      { key: "trainers", label: "Trainers" },
      { key: "equipment", label: "Equipment" },
    ],
  },
};

export const CATEGORY_LIST: CategoryConfig[] = [
  CATEGORIES.restaurant,
  CATEGORIES.resort,
  CATEGORIES.gym,
];

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
  cuisine?: string;
  rooms?: string;
  checkIn?: string;
  checkOut?: string;
  facilities: Record<string, boolean>;
  tags: string[];
  description: string;
  images: Record<string, string[]>; // group -> dataURLs
  createdAt?: string;
}

export const emptyDraft = (): ListingDraft => ({
  category: null,
  name: "",
  location: "",
  area: "",
  mapUrl: "",
  phone: "",
  hours: "",
  pricing: "",
  cuisine: "",
  rooms: "",
  checkIn: "",
  checkOut: "",
  facilities: {},
  tags: [],
  description: "",
  images: {},
});

const STORAGE_KEY = "bizfindly:draft";
const LISTINGS_KEY = "bizfindly:listings";

export const loadDraft = (): ListingDraft => {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDraft();
    return { ...emptyDraft(), ...JSON.parse(raw) };
  } catch {
    return emptyDraft();
  }
};

export const saveDraft = (d: ListingDraft) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    /* quota — images may be too large */
  }
};

export const clearDraft = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

export const loadListings = (): ListingDraft[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LISTINGS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const publishListing = (d: ListingDraft) => {
  const listings = loadListings();
  const final: ListingDraft = {
    ...d,
    id: `biz_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  listings.unshift(final);
  try {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  } catch {
    /* ignore */
  }
  clearDraft();
  return final;
};
