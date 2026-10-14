import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getLegacyListing } from "@/lib/backend/legacy/api";
import { LegacyListingDetail } from "./LegacyListingDetail";

// generateMetadata and the page share one request.
const loadListing = cache(getLegacyListing);

/** Bangla slugs may arrive percent-encoded; the API wants the decoded text. */
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await loadListing(decodeSlug(slug));
  if (!listing) return { title: "Listing not found — BizFindly" };

  const description = listing.excerpt.slice(0, 160);
  const image = listing.gallery[0]?.image;
  return {
    title: `${listing.title} — BizFindly`,
    description,
    alternates: { canonical: `/listing/${listing.slug}/` },
    openGraph: {
      title: listing.title,
      description,
      type: "website",
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await loadListing(decodeSlug(slug));
  if (!listing) notFound();
  return <LegacyListingDetail listing={listing} />;
}
