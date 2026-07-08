import { places, type Place, type Category } from "@/lib/mockData";
import { getPlaceVerification } from "@/lib/verification";

export interface AiFilters {
  category?: Category;
  area?: string;
  cuisine?: string;
  budgetMax?: number; // taka
  budgetMin?: number;
  priceLevelMax?: number; // 1..4
  priceLevelMin?: number;
  facilities: string[]; // must-have facility keywords (lowercase)
  tags: string[]; // e.g. rooftop, buffet, couple, family
  minRating?: number;
  openNow?: boolean;
  verifiedOnly?: boolean;
  trending?: boolean;
  hiddenGem?: boolean;
  sort?: "match" | "rating" | "price-asc" | "price-desc" | "trending";
}

export const emptyFilters = (): AiFilters => ({ facilities: [], tags: [], sort: "match" });

const AREAS = [
  "Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara", "Gazipur",
  "Cox's Bazar", "Sajek", "Old Dhaka",
];
const CUISINES = ["Bangla", "Chinese", "Thai", "Italian", "BBQ", "Seafood", "Dessert", "Japanese", "Sushi"];
const CATEGORY_WORDS: Array<{ w: RegExp; c: Category }> = [
  { w: /\b(restaurant|cafe|dining|dinner|lunch|eat|food|buffet|biryani|sushi|bbq)\b/i, c: "restaurant" },
  { w: /\b(resort|hotel|stay|getaway|weekend|honeymoon|beach)\b/i, c: "resort" },
  { w: /\b(gym|fitness|workout|training|lifting|cardio|trainer)\b/i, c: "gym" },
];
const TAG_KEYWORDS: Array<{ w: RegExp; tag: string }> = [
  { w: /\brooftop\b/i, tag: "rooftop" },
  { w: /\bbuffet\b/i, tag: "buffet" },
  { w: /\b(couple|romantic|date)\b/i, tag: "couple" },
  { w: /\b(family|kids?|children)\b/i, tag: "family" },
  { w: /\bbirthday\b/i, tag: "birthday" },
  { w: /\b(fine\s?dining|luxury|premium)\b/i, tag: "luxury" },
  { w: /\b(budget|cheap|affordable)\b/i, tag: "budget" },
  { w: /\btrend(ing|y)\b/i, tag: "trending" },
  { w: /\bhidden\s?gem\b/i, tag: "hidden" },
  { w: /\blive\s?music\b/i, tag: "live music" },
  { w: /\binstagram(mable)?\b/i, tag: "instagrammable" },
];
const FACILITY_KEYWORDS: Array<{ w: RegExp; f: string }> = [
  { w: /\b(swimming\s?pool|pool)\b/i, f: "pool" },
  { w: /\bspa\b/i, f: "spa" },
  { w: /\bparking\b/i, f: "parking" },
  { w: /\bac\b/i, f: "ac" },
  { w: /\bfemale\s?trainer\b/i, f: "female trainer" },
  { w: /\b(women|ladies)\b/i, f: "female trainer" },
  { w: /\bshower\b/i, f: "shower room" },
  { w: /\bcardio\b/i, f: "cardio" },
  { w: /\bweight\s?training\b/i, f: "weight training" },
  { w: /\bbeachfront|beach\b/i, f: "beachfront" },
  { w: /\bkids?\s?zone|play\s?area\b/i, f: "kids zone" },
];

const PRICE_LEVEL_WORDS: Array<{ w: RegExp; min?: number; max?: number }> = [
  { w: /\b(luxur|premium|high\s?end|upscale|fine\s?dining)\w*/i, min: 3 },
  { w: /\b(mid[-\s]?range|moderate)\b/i, min: 2, max: 3 },
  { w: /\b(budget|cheap|affordable|low[-\s]?cost)\b/i, max: 2 },
];

/** Parse a natural-language query into structured filters. Pure, deterministic. */
export function parseQuery(raw: string): AiFilters {
  const f = emptyFilters();
  const q = raw.trim();
  if (!q) return f;

  for (const { w, c } of CATEGORY_WORDS) {
    if (w.test(q)) { f.category = c; break; }
  }

  for (const area of AREAS) {
    if (new RegExp(`\\b${area.replace(/[^\w]/g, "\\$&")}\\b`, "i").test(q)) {
      f.area = area; break;
    }
  }

  for (const c of CUISINES) {
    if (new RegExp(`\\b${c}\\b`, "i").test(q)) { f.cuisine = c; break; }
  }

  for (const { w, tag } of TAG_KEYWORDS) if (w.test(q)) f.tags.push(tag);
  for (const { w, f: fac } of FACILITY_KEYWORDS) if (w.test(q)) f.facilities.push(fac);

  // Budget in taka: "under 3000", "within ৳2500", "below 4000 taka", "3000-5000"
  const under = q.match(/(?:under|below|within|less than|up to|<=?)\s*৳?\s*([\d,]+)\s*(?:k|tk|taka)?/i);
  if (under) f.budgetMax = parseTakaNumber(under[1], under[0]);
  const over = q.match(/(?:over|above|more than|at least|>=?)\s*৳?\s*([\d,]+)\s*(?:k|tk|taka)?/i);
  if (over) f.budgetMin = parseTakaNumber(over[1], over[0]);
  const range = q.match(/৳?\s*([\d,]+)\s*(?:k|tk|taka)?\s*[-–to]+\s*৳?\s*([\d,]+)\s*(?:k|tk|taka)?/i);
  if (range) {
    f.budgetMin = parseTakaNumber(range[1], range[0]);
    f.budgetMax = parseTakaNumber(range[2], range[0]);
  }

  for (const p of PRICE_LEVEL_WORDS) {
    if (p.w.test(q)) {
      if (p.min !== undefined) f.priceLevelMin = Math.max(f.priceLevelMin ?? 1, p.min);
      if (p.max !== undefined) f.priceLevelMax = Math.min(f.priceLevelMax ?? 4, p.max);
    }
  }

  if (/\bopen\s?now\b/i.test(q)) f.openNow = true;
  if (/\bverified\b/i.test(q)) f.verifiedOnly = true;
  if (/\btrend/i.test(q)) f.trending = true;
  const rating = q.match(/(?:rating|rated|stars?)\s*(?:above|over|>=?)?\s*([1-5](?:\.\d)?)/i);
  if (rating) f.minRating = parseFloat(rating[1]);
  if (/\bbest\b|\btop\b/i.test(q)) f.sort = "rating";

  return f;
}

function parseTakaNumber(numStr: string, whole: string): number {
  const n = parseInt(numStr.replace(/,/g, ""), 10);
  if (Number.isNaN(n)) return 0;
  return /\bk\b/i.test(whole) ? n * 1000 : n;
}

function priceFromRange(p: Place): number {
  const m = p.priceRange.match(/(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

/** Apply filters against the mock database. Grounded — never invents. */
export function searchPlaces(f: AiFilters): (Place & { matchScore: number })[] {
  const scored = places.map((p) => {
    let score = 0;
    let matches = true;
    const hay = [
      ...p.tags, ...p.facilities, p.cuisine ?? "", p.description, p.priceRange, p.area,
    ].join(" ").toLowerCase();

    if (f.category && p.category !== f.category) matches = false;
    if (f.area && f.area !== "Nearby" && p.area !== f.area) matches = false;
    if (f.cuisine && !(p.cuisine ?? "").toLowerCase().includes(f.cuisine.toLowerCase())) matches = false;

    if (f.priceLevelMax !== undefined && p.priceLevel > f.priceLevelMax) matches = false;
    if (f.priceLevelMin !== undefined && p.priceLevel < f.priceLevelMin) matches = false;

    if (f.budgetMax !== undefined) {
      const price = priceFromRange(p);
      if (price && price > f.budgetMax) matches = false;
    }
    if (f.budgetMin !== undefined) {
      const price = priceFromRange(p);
      if (price && price < f.budgetMin) matches = false;
    }

    if (f.minRating !== undefined && p.rating < f.minRating) matches = false;

    for (const fac of f.facilities) {
      if (!hay.includes(fac)) matches = false;
    }
    for (const tag of f.tags) {
      if (!hay.includes(tag)) matches = false;
    }

    const v = getPlaceVerification(p.id);
    if (f.verifiedOnly && v.status !== "verified") matches = false;
    if (f.trending && !p.trending) matches = false;
    if (f.hiddenGem && !p.hiddenGem) matches = false;

    // ranking signals
    score += p.rating * 10; // 40-50
    score += Math.min(20, Math.log10(p.reviews + 1) * 6);
    if (v.status === "verified") score += 8;
    if (p.trending) score += 6;
    if (p.hiddenGem) score += 3;
    if (f.area && p.area === f.area) score += 5;

    return { ...p, matches, matchScore: Math.max(55, Math.min(99, Math.round(score))) };
  });

  const results = scored.filter((p) => p.matches).map(({ matches, ...rest }) => rest);

  switch (f.sort) {
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "price-asc":
      results.sort((a, b) => a.priceLevel - b.priceLevel);
      break;
    case "price-desc":
      results.sort((a, b) => b.priceLevel - a.priceLevel);
      break;
    case "trending":
      results.sort((a, b) => Number(b.trending) - Number(a.trending) || b.rating - a.rating);
      break;
    default:
      results.sort((a, b) => b.matchScore - a.matchScore);
  }
  return results;
}

/** Human-readable chip labels for detected filters. Each chip removable. */
export interface FilterChip { key: string; label: string; }
export function describeFilters(f: AiFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  if (f.category) chips.push({ key: "category", label: cap(f.category) });
  if (f.area) chips.push({ key: "area", label: f.area });
  if (f.cuisine) chips.push({ key: "cuisine", label: f.cuisine });
  if (f.budgetMax) chips.push({ key: "budgetMax", label: `Under ৳${f.budgetMax.toLocaleString()}` });
  if (f.budgetMin) chips.push({ key: "budgetMin", label: `Over ৳${f.budgetMin.toLocaleString()}` });
  if (f.priceLevelMax !== undefined && !f.budgetMax) chips.push({ key: "priceLevelMax", label: f.priceLevelMax <= 2 ? "Budget" : "Mid-range" });
  if (f.priceLevelMin !== undefined && !f.budgetMin) chips.push({ key: "priceLevelMin", label: f.priceLevelMin >= 3 ? "Premium+" : "Mid+" });
  if (f.minRating) chips.push({ key: "minRating", label: `${f.minRating}★+` });
  if (f.openNow) chips.push({ key: "openNow", label: "Open now" });
  if (f.verifiedOnly) chips.push({ key: "verifiedOnly", label: "Verified" });
  if (f.trending) chips.push({ key: "trending", label: "Trending" });
  for (const t of f.tags) chips.push({ key: `tag:${t}`, label: cap(t) });
  for (const fac of f.facilities) chips.push({ key: `fac:${fac}`, label: cap(fac) });
  return chips;
}

export function removeFilter(f: AiFilters, key: string): AiFilters {
  const n: AiFilters = { ...f, facilities: [...f.facilities], tags: [...f.tags] };
  if (key.startsWith("tag:")) n.tags = n.tags.filter((t) => t !== key.slice(4));
  else if (key.startsWith("fac:")) n.facilities = n.facilities.filter((t) => t !== key.slice(4));
  else delete (n as unknown as Record<string, unknown>)[key];
  return n;
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export const QUICK_SUGGESTIONS = [
  "Romantic Dinner", "Buffet", "Rooftop", "Birthday Party",
  "Family Resort", "Luxury Resort", "Budget Gym", "Female Trainer",
  "Swimming Pool", "Kids Friendly",
];

export const EXAMPLE_QUERIES = [
  "Show me the best buffet restaurants in Dhanmondi under ৳2500",
  "Find a rooftop restaurant for couples near Gulshan",
  "Show family-friendly resorts within 2 hours from Dhaka",
  "Find a premium gym with female trainers in Uttara",
];
