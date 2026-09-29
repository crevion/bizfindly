export type ReviewBusinessCategory = "restaurant" | "resort" | "gym";

/** The place a review is about, so a list spanning all three kinds can render. */
export interface ReviewBusiness {
  category: ReviewBusinessCategory;
  slug: string;
  name: string;
  city: string;
  area: string;
  cover_photo: string | null;
}

export interface Review {
  id: number;
  user_name: string;
  restaurant_slug: string | null;
  resort_slug: string | null;
  business: ReviewBusiness | null;
  star: number;
  comment: string;
  owner_reply?: string;
  owner_replied_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateReviewInput {
  star: number;
  comment?: string;
  restaurant_slug?: string;
  resort_slug?: string;
  gym_slug?: string;
}

/** The business a review belongs to is fixed; only the rating and text change. */
export interface UpdateReviewInput {
  star: number;
  comment: string;
}

export interface ReviewListParams {
  restaurant?: string;
  resort?: string;
  gym?: string;
  page?: number;
  page_size?: number;
}

export interface MyReviewsParams {
  /** Narrows the list to your review of this one business, if you left one. */
  restaurant?: string;
  resort?: string;
  gym?: string;
  page?: number;
  page_size?: number;
}
