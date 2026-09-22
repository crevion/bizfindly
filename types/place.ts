export type Category = "restaurant" | "resort" | "gym";

export interface Place {
  id: string;
  slug: string;
  name: string;
  category: Category;
  cuisine?: string;
  location: string;
  area: string;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  priceLevel: 1 | 2 | 3 | 4;
  priceRange: string;
  tags: string[];
  facilities: string[];
  hours: string;
  phone: string;
  website?: string;
  description: string;
  aiSummary: string;
  matchScore?: number;
  trending?: boolean;
  hiddenGem?: boolean;
  verified?: boolean;
  coords?: { lat: number; lng: number };
  menu?: { category: string; items: { name: string; price: string }[] }[];
}

export interface PlaceReview {
  user: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
}
