import type { ListingStepId } from "@/types/listing";

export const LISTING_STEPS: { id: ListingStepId; label: string }[] = [
  { id: "category", label: "Category" },
  { id: "basics", label: "Basics" },
  { id: "details", label: "Details" },
  { id: "facilities", label: "Facilities" },
  { id: "tags", label: "Tags" },
  { id: "images", label: "Photos" },
  { id: "description", label: "Story" },
  { id: "preview", label: "Preview" },
];
