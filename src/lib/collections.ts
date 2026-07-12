import { places, type Place } from "./mockData";

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  followers: number;
  filter: (p: Place) => boolean;
  emoji?: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const collections: Collection[] = [
  {
    id: "rooftop",
    slug: "best-rooftop-restaurants",
    title: "Best Rooftop Restaurants",
    description: "Skyline views, warm lights and unforgettable dinners across Dhaka.",
    cover: img("photo-1414235077428-338989a2e8c0"),
    followers: 4820,
    emoji: "🌆",
    filter: (p) => p.tags.some((t) => /rooftop/i.test(t)) || p.facilities.some((f) => /rooftop/i.test(f)),
  },
  {
    id: "romantic",
    slug: "romantic-date-places",
    title: "Romantic Date Places",
    description: "Intimate settings and couple-friendly picks — perfect for date nights.",
    cover: img("photo-1519671482749-fd09be7ccebf"),
    followers: 6210,
    emoji: "❤️",
    filter: (p) => p.tags.includes("Couple Spot") || p.tags.includes("Fine Dining"),
  },
  {
    id: "family",
    slug: "family-friendly-restaurants",
    title: "Family Friendly Restaurants",
    description: "Kid-safe seating, big menus and welcoming spaces for the whole family.",
    cover: img("photo-1552566626-52f8b828add9"),
    followers: 3140,
    emoji: "👨‍👩‍👧",
    filter: (p) => p.tags.includes("Family Friendly") || p.facilities.includes("Family Section"),
  },
  {
    id: "weekend",
    slug: "weekend-getaways-near-dhaka",
    title: "Weekend Getaways Near Dhaka",
    description: "Quick escapes within a few hours of the city — resorts, lakes and hills.",
    cover: img("photo-1520250497591-112f2f40a3f4"),
    followers: 5480,
    emoji: "🏞️",
    filter: (p) => p.category === "resort" && (p.tags.includes("Near Dhaka") || p.area === "Gazipur"),
  },
  {
    id: "luxury",
    slug: "luxury-dining",
    title: "Luxury Dining",
    description: "Fine dining, premium omakase and celebration-worthy experiences.",
    cover: img("photo-1546069901-ba9599a7e63c"),
    followers: 2210,
    emoji: "🥂",
    filter: (p) => p.category === "restaurant" && p.priceLevel >= 3,
  },
  {
    id: "hidden",
    slug: "hidden-gems",
    title: "Hidden Gems",
    description: "Under-the-radar spots loved by locals but missed by search.",
    cover: img("photo-1543007630-9710e4a00a20"),
    followers: 3890,
    emoji: "💎",
    filter: (p) => !!p.hiddenGem,
  },
  {
    id: "budget",
    slug: "budget-friendly-eats",
    title: "Budget Friendly Eats",
    description: "Great food, real portions, under ৳500 per person.",
    cover: img("photo-1631515243349-e0cb75fb8d3a"),
    followers: 7120,
    emoji: "💸",
    filter: (p) => p.category === "restaurant" && p.priceLevel <= 2,
  },
  {
    id: "women-gyms",
    slug: "women-friendly-gyms",
    title: "Women Friendly Gyms",
    description: "Private, supportive fitness spaces with certified female trainers.",
    cover: img("photo-1518611012118-696072aa579a"),
    followers: 1680,
    emoji: "💪",
    filter: (p) => p.category === "gym" && (p.tags.includes("Women Friendly") || p.facilities.includes("Female Trainer")),
  },
];

export const getCollectionPlaces = (c: Collection) =>
  places.filter(c.filter).slice(0, 12);
