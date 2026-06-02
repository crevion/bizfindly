export type VerificationStatus = "verified" | "pending" | "unclaimed" | "rejected";

export type VerificationFilter = "all" | VerificationStatus;

export type ClaimStepId = "find" | "details" | "documents" | "social" | "review" | "done";

export type ClaimDetails = {
  name: string;
  role: string;
  phone: string;
  email: string;
  address: string;
};

export type ClaimSocialState = {
  facebook: string;
  instagram: string;
  website: string;
  googleBusiness: string;
};

export type ClaimDocsState = Record<
  string,
  { name: string; size: number; preview?: string } | null
>;

export interface ClaimDocument {
  key: string;
  label: string;
  name: string;
  size: number;
  preview?: string;
}

export interface ClaimSocial {
  facebook?: string;
  instagram?: string;
  website?: string;
  googleBusiness?: string;
}

export interface ClaimRecord {
  id: string;
  placeId: string;
  placeSlug?: string;
  placeName: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerRole: string;
  businessAddress: string;
  documents: ClaimDocument[];
  social: ClaimSocial;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
}

export interface SearchableBusiness {
  id: string;
  slug?: string;
  name: string;
  location: string;
  category: string;
  image?: string;
  source: "directory" | "user";
}

export interface DocumentTypeConfig {
  key: string;
  label: string;
  required: boolean;
}
