export interface Review {
  id: number;
  user_name: string;
  restaurant_slug: string | null;
  resort_slug: string | null;
  star: number;
  comment: string;
  created_at: string;
}

export interface CreateReviewInput {
  star: number;
  comment?: string;
  restaurant_slug?: string;
  resort_slug?: string;
}

export interface ReviewListParams {
  restaurant?: string;
  resort?: string;
  page?: number;
  page_size?: number;
}

export interface MyReviewsParams {
  page?: number;
  page_size?: number;
}
