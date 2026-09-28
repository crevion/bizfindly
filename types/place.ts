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
  offerCode?: string;
  offerDescription?: string;
  description: string;
  aiSummary: string;
  matchScore?: number;
  trending?: boolean;
  hiddenGem?: boolean;
  verified?: boolean;
  coords?: { lat: number; lng: number };
  mapUrl?: string;
  /** Kilometres from the search centre, when the request had one. */
  distanceKm?: number;
  /**
   * Whether the place is open at this moment, per its opening hours.
   *
   * null when it records none that can be read -- which is not the same as
   * being shut, so the card shows no badge rather than "Closed".
   */
  openNow?: boolean | null;
  /** Whether it is running an offer, without the list payload carrying one. */
  hasOffer?: boolean;
  menu?: {
    category: string;
    items: {
      name: string;
      price: string;
      originalPrice?: string;
      description?: string;
      available?: boolean;
      image?: string | null;
    }[];
  }[];
}

export interface PlaceReview {
  user: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
  ownerReply?: string;
}
