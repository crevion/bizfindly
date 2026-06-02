import type { VerificationFilter } from "@/types/verification";

export const VERIFICATION_FILTERS: { id: VerificationFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "verified", label: "Verified" },
  { id: "rejected", label: "Rejected" },
];
