import type { Place } from "@/types/place";

export function matchesQuickFilter(p: Place, f: string): boolean {
  const hay = [...p.tags, ...p.facilities, p.cuisine ?? "", p.priceRange, p.description]
    .join(" ")
    .toLowerCase();
  const needle = f.toLowerCase();
  if (needle === "open now") return true;
  if (needle === "trending") return !!p.trending;
  if (needle === "budget friendly" || needle === "budget gym") return p.priceLevel <= 2;
  if (needle === "luxury" || needle === "premium gym" || needle === "fine dining")
    return p.priceLevel >= 3;
  if (needle === "near dhaka")
    return ["Gazipur", "Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara"].includes(p.area);
  if (needle === "swimming pool") return hay.includes("pool");
  if (needle === "ac gym") return hay.includes("ac");
  if (needle === "couple resort" || needle === "couple friendly") return hay.includes("couple");
  if (needle === "family resort" || needle === "family friendly") return hay.includes("family");
  return hay.includes(needle);
}

export function priceFromRange(p: Place): number {
  const m = p.priceRange.match(/(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}
