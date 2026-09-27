export type VerificationStatus = "verified" | "pending" | "unclaimed" | "rejected";

export type VerificationFilter = "all" | VerificationStatus;

export type ClaimStepId = "find" | "details" | "documents" | "review" | "done";

export type ClaimDetails = {
  fullName: string;
  phone: string;
  message: string;
};

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
