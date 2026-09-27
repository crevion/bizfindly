export interface Review {
  id: number;
  user_name: string;
  restaurant_slug: string | null;
  resort_slug: string | null;
  star: number;
  comment: string;
  owner_reply?: string;
  owner_replied_at?: string | null;
  created_at: string;
}

export interface CreateReviewInput {
  star: number;
  comment?: string;
  restaurant_slug?: string;
  resort_slug?: string;
  gym_slug?: string;
}

export interface ReviewListParams {
  restaurant?: string;
  resort?: string;
  gym?: string;
  page?: number;
  page_size?: number;
}

export interface MyReviewsParams {
  page?: number;
  page_size?: number;
}
