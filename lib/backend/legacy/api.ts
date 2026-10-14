import { BACKEND_API_URL } from "@/lib/backend/proxy";

/** A listing carried over from the old WordPress site, served at /listing/<slug>/. */
export interface LegacyListing {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  ad_type: string;
  category: string;
  location: string;
  tags: string[];
  video_url: string;
  pricing_type: string;
  price_type: string;
  price: string | null;
  max_price: string | null;
  social_profiles: { platform: string; url: string }[];
  website: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  zip_code: string;
  latitude: string | null;
  longitude: string | null;
  hide_map: boolean;
  business_hours: string;
  posted_at: string | null;
  views: number;
  gallery: { id: number; image: string; caption: string; order: number }[];
}

/**
 * Fetches straight from the backend so the page can render on the server --
 * these URLs exist to keep the old site's search ranking. Null on 404.
 */
export async function getLegacyListing(slug: string): Promise<LegacyListing | null> {
  const res = await fetch(`${BACKEND_API_URL}/legacy-listings/${encodeURIComponent(slug)}/`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Legacy listing request failed (${res.status})`);
  return res.json();
}
