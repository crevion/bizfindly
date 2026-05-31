import { places } from "./mockData";
import { loadListings } from "./listingCategories";

export type VerificationStatus = "verified" | "pending" | "unclaimed" | "rejected";

export interface ClaimRecord {
  id: string;
  placeId: string; // mock place id OR listing id
  placeSlug?: string;
  placeName: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerRole: string;
  businessAddress: string;
  documents: { key: string; label: string; name: string; size: number; preview?: string }[];
  social: {
    facebook?: string;
    instagram?: string;
    website?: string;
    googleBusiness?: string;
  };
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
}

const KEY = "bizfindly:claims";

export const DOC_TYPES = [
  { key: "tradeLicense", label: "Trade license", required: true },
  { key: "utilityBill", label: "Utility bill", required: false },
  { key: "taxCert", label: "Tax certificate", required: false },
  { key: "registration", label: "Business registration", required: false },
  { key: "businessCard", label: "Branded business card", required: false },
  { key: "storefront", label: "Storefront image", required: true },
  { key: "ownerProof", label: "Proof of ownership", required: false },
];

export const loadClaims = (): ClaimRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveClaims = (list: ClaimRecord[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* quota */
  }
};

export const submitClaim = (rec: Omit<ClaimRecord, "id" | "submittedAt" | "status">) => {
  const list = loadClaims();
  const final: ClaimRecord = {
    ...rec,
    id: `clm_${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  list.unshift(final);
  saveClaims(list);
  return final;
};

export const updateClaimStatus = (
  id: string,
  status: VerificationStatus,
  note?: string,
) => {
  const list = loadClaims();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return;
  list[idx] = {
    ...list[idx],
    status,
    reviewerNote: note,
    reviewedAt: new Date().toISOString(),
  };
  saveClaims(list);
};

/** Return current verification status for a given place id or slug. */
export const getPlaceVerification = (placeIdOrSlug: string): {
  status: VerificationStatus;
  claim?: ClaimRecord;
} => {
  const claims = loadClaims();
  // prefer most recent matching
  const claim = claims.find(
    (c) => c.placeId === placeIdOrSlug || c.placeSlug === placeIdOrSlug,
  );
  if (claim) {
    if (claim.status === "verified") return { status: "verified", claim };
    if (claim.status === "pending") return { status: "pending", claim };
    if (claim.status === "rejected") return { status: "unclaimed", claim };
  }
  // mock-data verified flag fallback
  const place = places.find((p) => p.id === placeIdOrSlug || p.slug === placeIdOrSlug);
  if (place?.verified) return { status: "verified" };
  return { status: "unclaimed" };
};

/** Search across mock places + user-published listings. */
export interface SearchableBusiness {
  id: string;
  slug?: string;
  name: string;
  location: string;
  category: string;
  image?: string;
  source: "directory" | "user";
}

export const searchBusinesses = (q: string): SearchableBusiness[] => {
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
  const userListings = loadListings();
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
    .filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.location.toLowerCase().includes(term),
    )
    .slice(0, 12);
};
