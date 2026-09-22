export interface EventItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_photo: string | null;
  location: string;
  starts_at: string | null;
  ends_at: string | null;
  is_published: boolean;
}

export interface EventListParams {
  page?: number;
  page_size?: number;
}

export interface CmsPage {
  id?: number;
  title: string;
  slug: string;
  content: string;
  updated_at?: string;
}
