import type { MetadataRoute } from "next";
import { BACKEND_API_URL } from "@/lib/backend/proxy";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_PATHS = [
  "/",
  "/ai-discover",
  "/list-business",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

interface SitemapEntry {
  path: string;
  lastmod: string;
}

/** Every place and legacy listing, from the backend. Empty if it is unreachable. */
async function detailEntries(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/sitemap/`, { next: { revalidate } });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const details = await detailEntries();
  return [
    ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}` })),
    // encodeURI percent-encodes the Bangla slugs, as sitemap URLs must be.
    ...details.map((entry) => ({
      url: `${SITE_URL}${encodeURI(entry.path)}`,
      lastModified: entry.lastmod,
    })),
  ];
}
