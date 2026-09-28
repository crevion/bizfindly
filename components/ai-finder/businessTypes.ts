/**
 * The business types the finder can search, and how each one presents itself.
 *
 * Picking a type changes where the listings come from, so it changes the whole
 * page: the chat's prompts, the filters that make sense, the labels on the
 * budget slider and the pins on the map. Keeping that in one table per type
 * means adding a fourth type is an entry here, not a hunt through the panels.
 */

import type { TaxonomyKind } from "@/lib/backend/taxonomy";

export const BUSINESS_TYPES = ["restaurant", "resort", "gym"] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const DEFAULT_BUSINESS_TYPE: BusinessType = "restaurant";

/**
 * One group of filter chips: a taxonomy to load, and the listing query
 * parameter its slugs are sent as.
 *
 * The chips used to be a hardcoded list of labels ("Rooftop", "Beachfront")
 * with no connection to anything the backend could filter on, so selecting
 * one always returned nothing. They are loaded from the taxonomy the listings
 * are actually tagged with instead.
 */
export interface FacetGroup {
  /** "businessTypes" is excluded: that is the page's own choice, not a facet. */
  kind: Exclude<TaxonomyKind, "businessTypes">;
  /** Listing filter parameter, e.g. "vibe" -> ?vibe=rooftop,live-music. */
  param: string;
  label: string;
}

/** Every parameter any type can filter by, for reading them back off a URL. */
export const FACET_PARAMS = [
  "vibe",
  "occasion",
  "group_type",
  "tag",
  "facility",
  "gender_target",
  "main_goal",
] as const;

export type FacetParam = (typeof FACET_PARAMS)[number];

export interface BusinessTypeConfig {
  value: BusinessType;
  /** Plural, for the dropdown and the result counts. */
  label: string;
  /** Singular, for sentences: "Ask about a restaurant". */
  noun: string;
  /** The listing path on the API, which is also the plural the backend uses. */
  plural: string;
  /** Short word for the narrow toggle in the filters panel. */
  shortLabel: string;
  chatTitle: string;
  chatHint: string;
  chatPlaceholder: string;
  prompts: string[];
  searchLabel: string;
  searchPlaceholder: string;
  budgetLabel: string;
  /** The chip groups this type filters by, in the order they are shown. */
  facetGroups: FacetGroup[];
  /** Only restaurants are described by a cuisine. */
  hasCuisine: boolean;
  emptyHint: string;
  /** Marker colour on the map, so a type change is visible at a glance. */
  markerColor: string;
}

export const BUSINESS_TYPE_CONFIG: Record<BusinessType, BusinessTypeConfig> = {
  restaurant: {
    value: "restaurant",
    label: "Restaurants",
    noun: "restaurant",
    plural: "restaurants",
    shortLabel: "Eat",
    chatTitle: "What kind of restaurant are you looking for?",
    chatHint:
      "Tell me what you’re in the mood for, compare restaurants, or ask about a menu (e.g. “Cozy cafe for work in Dhanmondi”).",
    chatPlaceholder: "Ask for ideas, compare restaurants, or ask a follow-up…",
    prompts: [
      "Rooftop restaurant in Gulshan with city view",
      "Budget Biryani or Kacchi under ৳500",
      "Trending restaurants in Dhaka",
      "Family dinner in Banani",
    ],
    searchLabel: "Restaurant Name or Keyword",
    searchPlaceholder: "e.g. Noor Rooftop, Izumi, Sahara...",
    budgetLabel: "Budget per Person",
    facetGroups: [
      { kind: "vibes", param: "vibe", label: "Vibe" },
      { kind: "occasions", param: "occasion", label: "Good for" },
      { kind: "groupTypes", param: "group_type", label: "Going with" },
      { kind: "facilities", param: "facility", label: "Facilities" },
    ],
    hasCuisine: true,
    emptyHint:
      "We couldn’t find any restaurants matching your current filters. Try a different area, cuisine or budget.",
    markerColor: "#e60b1d",
  },
  resort: {
    value: "resort",
    label: "Resorts",
    noun: "resort",
    plural: "resorts",
    shortLabel: "Stay",
    chatTitle: "Where would you like to stay?",
    chatHint:
      "Tell me the trip you have in mind, compare resorts, or ask what a place includes (e.g. “Beachfront resort in Cox’s Bazar for a weekend”).",
    chatPlaceholder: "Ask for ideas, compare resorts, or ask a follow-up…",
    prompts: [
      "Beachfront resort in Cox’s Bazar",
      "Resort with a swimming pool under ৳8,000 a night",
      "Trending resorts in Sylhet",
      "Quiet couple getaway near Dhaka",
    ],
    searchLabel: "Resort Name or Keyword",
    searchPlaceholder: "e.g. Sayeman Beach, Grand Sultan...",
    budgetLabel: "Price per Night",
    facetGroups: [
      { kind: "tags", param: "tag", label: "Style" },
      { kind: "facilities", param: "facility", label: "Facilities" },
    ],
    hasCuisine: false,
    emptyHint:
      "We couldn’t find any resorts matching your current filters. Try a different city, price range or facility.",
    markerColor: "#0f766e",
  },
  gym: {
    value: "gym",
    label: "Gyms",
    noun: "gym",
    plural: "gyms",
    shortLabel: "Gym",
    chatTitle: "What are you training for?",
    chatHint:
      "Tell me your goal, compare gyms, or ask what a place offers (e.g. “Women-only gym in Dhanmondi for weight loss”).",
    chatPlaceholder: "Ask for ideas, compare gyms, or ask a follow-up…",
    prompts: [
      "Women-only gym in Dhanmondi",
      "Gym with a female trainer in Uttara",
      "Budget gym under ৳2,000 a month",
      "Trending gyms in Dhaka",
    ],
    searchLabel: "Gym Name or Keyword",
    searchPlaceholder: "e.g. Fitness Zone, Gold’s Gym...",
    budgetLabel: "Monthly Fee",
    facetGroups: [
      { kind: "genderTargets", param: "gender_target", label: "Who it's for" },
      { kind: "mainGoals", param: "main_goal", label: "Training goal" },
      { kind: "facilities", param: "facility", label: "Facilities" },
    ],
    hasCuisine: false,
    emptyHint:
      "We couldn’t find any gyms matching your current filters. Try a different area, goal or price range.",
    markerColor: "#7c3aed",
  },
};

export const businessTypeConfig = (type: BusinessType): BusinessTypeConfig =>
  BUSINESS_TYPE_CONFIG[type] ?? BUSINESS_TYPE_CONFIG[DEFAULT_BUSINESS_TYPE];

export const isBusinessType = (value: unknown): value is BusinessType =>
  typeof value === "string" && (BUSINESS_TYPES as readonly string[]).includes(value);
