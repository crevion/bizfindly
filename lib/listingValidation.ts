import type { ListingDraft } from "@/types/listing";

export interface ListingIssue {
  field: keyof ListingDraft | "cover";
  message: string;
}

/** The four sections share these rules with the final publish guard. */
export function validateListing(draft: ListingDraft, hasCover: boolean): ListingIssue[][] {
  const sections: ListingIssue[][] = [[], [], [], []];
  const add = (section: number, field: ListingIssue["field"], message: string) =>
    sections[section].push({ field, message });
  if (!draft.category || !["restaurant", "resort", "gym"].includes(draft.category))
    add(0, "category", "Choose a business category.");
  if (draft.name.trim().length < 2)
    add(0, "name", "Enter a business name with at least 2 characters.");
  if (!draft.area.trim()) add(0, "area", "Enter the area or district.");
  if (draft.location.trim().length < 2) add(0, "location", "Enter the full street address.");
  const phone = draft.phone.trim();
  if (!/^\+?[\d\s().-]+$/.test(phone) || !/^[\d]{7,15}$/.test(phone.replace(/\D/g, "")))
    add(0, "phone", "Enter a valid phone number with 7–15 digits.");
  for (const field of ["mapUrl", "website"] as const) {
    const value = draft[field]?.trim();
    if (!value) continue;
    try {
      if (!["http:", "https:"].includes(new URL(value).protocol)) throw new Error();
    } catch {
      add(
        0,
        field,
        `Enter a valid ${field === "mapUrl" ? "Google Maps" : "website"} link starting with http:// or https://.`,
      );
    }
  }
  const lat = draft.latitude.trim();
  const lng = draft.longitude.trim();
  if (lat || lng) {
    if (!lat || !Number.isFinite(Number(lat)) || Math.abs(Number(lat)) > 90)
      add(0, "latitude", "Enter a latitude between -90 and 90, or leave both coordinates empty.");
    if (!lng || !Number.isFinite(Number(lng)) || Math.abs(Number(lng)) > 180)
      add(
        0,
        "longitude",
        "Enter a longitude between -180 and 180, or leave both coordinates empty.",
      );
  }
  if (!draft.hours.trim()) add(1, "hours", "Enter the operating hours.");
  const min = draft.priceMin.trim();
  const max = draft.priceMax.trim();
  if (!min || !Number.isFinite(Number(min)) || Number(min) < 0)
    add(1, "priceMin", "Enter a minimum price of zero or more.");
  if (
    max &&
    (!Number.isFinite(Number(max)) || Number(max) < 0 || (min && Number(max) < Number(min)))
  )
    add(1, "priceMax", "Maximum price must be a valid number no lower than the minimum price.");
  if (!hasCover) add(2, "cover", "Upload a cover photo before continuing.");
  if (draft.description.trim().length < 11)
    add(3, "description", "Describe your business using at least 11 characters.");
  return sections;
}
