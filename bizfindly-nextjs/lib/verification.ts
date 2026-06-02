"use client";

import { places } from "@/content/places";
import { useVerificationStore } from "@/store/useVerificationStore";
import { useListingStore } from "@/store/useListingStore";
import type { ClaimRecord, SearchableBusiness, VerificationStatus } from "@/types/verification";

export function getPlaceVerification(placeIdOrSlug: string): {
  status: VerificationStatus;
  claim?: ClaimRecord;
} {
  const claims = useVerificationStore.getState().claims;
  const claim = claims.find((c) => c.placeId === placeIdOrSlug || c.placeSlug === placeIdOrSlug);
  if (claim) {
    if (claim.status === "verified") return { status: "verified", claim };
    if (claim.status === "pending") return { status: "pending", claim };
    if (claim.status === "rejected") return { status: "unclaimed", claim };
  }
  const place = places.find((p) => p.id === placeIdOrSlug || p.slug === placeIdOrSlug);
  if (place?.verified) return { status: "verified" };
  return { status: "unclaimed" };
}

export function searchBusinesses(q: string): SearchableBusiness[] {
  const term = q.trim().toLowerCase();
  const fromMock: SearchableBusiness[] = places.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    location: p.location,
    category: p.category,
    image: p.image,
    source: "directory",
  }));
  const userListings = useListingStore.getState().listings;
  const fromUser: SearchableBusiness[] = userListings.map((l) => ({
    id: l.id || `local_${l.name}`,
    name: l.name,
    location: l.location,
    category: l.category || "business",
    image: Object.values(l.images || {}).flat()[0],
    source: "user",
  }));
  const all = [...fromMock, ...fromUser];
  if (!term) return all.slice(0, 8);
  return all
    .filter((b) => b.name.toLowerCase().includes(term) || b.location.toLowerCase().includes(term))
    .slice(0, 12);
}
