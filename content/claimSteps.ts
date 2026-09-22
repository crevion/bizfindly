import type { ClaimStepId } from "@/types/verification";

export const CLAIM_STEPS: { id: ClaimStepId; label: string }[] = [
  { id: "find", label: "Find" },
  { id: "details", label: "Details" },
  { id: "documents", label: "Documents" },
  { id: "social", label: "Social" },
  { id: "review", label: "Review" },
];
