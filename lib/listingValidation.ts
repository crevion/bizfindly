import type { ListingDraft } from "@/types/listing";

export interface ListingIssue {
  field: keyof ListingDraft | "cover";
  message: string;
}

// Named positions of the four tabs in the listing wizard.
export const LISTING_SECTION = {
  identity: 0,
  hoursAndPricing: 1,
  photos: 2,
  amenitiesAndStory: 3,
} as const;

function addIssue(issues: ListingIssue[], field: ListingIssue["field"], message: string) {
  issues.push({ field, message });
}

function isValidPhoneNumber(phoneNumber: string): boolean {
  // Allow an optional leading +, digits, spaces, parentheses, dots and dashes.
  const hasAllowedCharacters = /^\+?[\d\s().-]+$/.test(phoneNumber);
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  const hasValidLength = digitsOnly.length >= 7 && digitsOnly.length <= 15;

  return hasAllowedCharacters && hasValidLength;
}

function isValidWebLink(link: string): boolean {
  try {
    const parsedLink = new URL(link);
    const isHttp = parsedLink.protocol === "http:";
    const isHttps = parsedLink.protocol === "https:";
    return isHttp || isHttps;
  } catch {
    return false;
  }
}

function isValidCoordinate(value: string, minimum: number, maximum: number): boolean {
  if (value === "") {
    return false;
  }

  const coordinate = Number(value);
  const isNumber = Number.isFinite(coordinate);
  const isWithinRange = coordinate >= minimum && coordinate <= maximum;
  return isNumber && isWithinRange;
}

function validateIdentity(draft: ListingDraft): ListingIssue[] {
  const issues: ListingIssue[] = [];
  const hasValidCategory =
    draft.category === "restaurant" || draft.category === "resort" || draft.category === "gym";

  if (!hasValidCategory) {
    addIssue(issues, "category", "Choose a business category.");
  }
  if (draft.name.trim().length < 2) {
    addIssue(issues, "name", "Enter a business name with at least 2 characters.");
  }
  if (draft.area.trim() === "") {
    addIssue(issues, "area", "Enter the area or district.");
  }
  if (draft.location.trim().length < 2) {
    addIssue(issues, "location", "Enter the full street address.");
  }
  if (!isValidPhoneNumber(draft.phone.trim())) {
    addIssue(issues, "phone", "Enter a valid phone number with 7–15 digits.");
  }

  // These links are optional. Check them only when the owner enters one.
  const googleMapsLink = draft.mapUrl.trim();
  if (googleMapsLink !== "" && !isValidWebLink(googleMapsLink)) {
    addIssue(issues, "mapUrl", "Enter a valid Google Maps link starting with http:// or https://.");
  }
  const websiteLink = draft.website?.trim() ?? "";
  if (websiteLink !== "" && !isValidWebLink(websiteLink)) {
    addIssue(issues, "website", "Enter a valid website link starting with http:// or https://.");
  }

  // Coordinates are optional, but latitude and longitude must be entered together.
  const latitude = draft.latitude.trim();
  const longitude = draft.longitude.trim();
  const hasAnyCoordinate = latitude !== "" || longitude !== "";

  if (hasAnyCoordinate) {
    if (!isValidCoordinate(latitude, -90, 90)) {
      addIssue(
        issues,
        "latitude",
        "Enter a latitude between -90 and 90, or leave both coordinates empty.",
      );
    }
    if (!isValidCoordinate(longitude, -180, 180)) {
      addIssue(
        issues,
        "longitude",
        "Enter a longitude between -180 and 180, or leave both coordinates empty.",
      );
    }
  }
  return issues;
}

function validateHoursAndPricing(draft: ListingDraft): ListingIssue[] {
  const issues: ListingIssue[] = [];
  if (draft.hours.trim() === "") {
    addIssue(issues, "hours", "Enter the operating hours.");
  }

  const minimumPriceText = draft.priceMin.trim();
  const maximumPriceText = draft.priceMax.trim();
  const minimumPrice = Number(minimumPriceText);
  const maximumPrice = Number(maximumPriceText);
  const hasMinimumPrice = minimumPriceText !== "";
  const minimumPriceIsValid = Number.isFinite(minimumPrice) && minimumPrice >= 0;

  if (!hasMinimumPrice || !minimumPriceIsValid) {
    addIssue(issues, "priceMin", "Enter a minimum price of zero or more.");
  }

  // Maximum price is optional. If provided, it cannot be below the minimum.
  if (maximumPriceText !== "") {
    const maximumPriceIsValid = Number.isFinite(maximumPrice) && maximumPrice >= 0;
    const maximumIsBelowMinimum = hasMinimumPrice && maximumPrice < minimumPrice;
    if (!maximumPriceIsValid || maximumIsBelowMinimum) {
      addIssue(
        issues,
        "priceMax",
        "Maximum price must be a valid number no lower than the minimum price.",
      );
    }
  }
  return issues;
}

function validatePhotos(hasCoverPhoto: boolean): ListingIssue[] {
  const issues: ListingIssue[] = [];
  if (!hasCoverPhoto) {
    addIssue(issues, "cover", "Upload a cover photo before continuing.");
  }
  return issues;
}

function validateStory(draft: ListingDraft): ListingIssue[] {
  const issues: ListingIssue[] = [];
  const descriptionLength = draft.description.trim().length;
  if (descriptionLength < 11) {
    addIssue(issues, "description", "Describe your business using at least 11 characters.");
  }
  return issues;
}

/** Both step navigation and publishing use these same validation rules. */
export function validateListing(draft: ListingDraft, hasCoverPhoto: boolean): ListingIssue[][] {
  const identityIssues = validateIdentity(draft);
  const hoursAndPricingIssues = validateHoursAndPricing(draft);
  const photoIssues = validatePhotos(hasCoverPhoto);
  const storyIssues = validateStory(draft);

  return [identityIssues, hoursAndPricingIssues, photoIssues, storyIssues];
}
