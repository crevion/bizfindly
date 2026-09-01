import type { Place } from "@/types/place";

export function matchesQuickFilter(p: Place, f: string): boolean {
  const hay = [
    ...p.tags,
    ...p.facilities,
    p.cuisine ?? "",
    p.priceRange,
    p.description,
    p.name,
    p.area,
  ]
    .join(" ")
    .toLowerCase();
  const needle = f.toLowerCase().trim();

  if (needle === "open now") return true;
  if (needle === "trending") return !!p.trending;
  if (needle === "hidden gem" || needle === "hidden gems") return !!p.hiddenGem;
  if (needle === "budget friendly" || needle === "budget gym" || needle === "budget eats")
    return p.priceLevel <= 2;
  if (needle === "luxury" || needle === "luxury dining" || needle === "premium gym" || needle === "fine dining")
    return p.priceLevel >= 3;
  if (needle === "near dhaka")
    return ["Gazipur", "Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara"].includes(p.area);
  if (needle === "swimming pool" || needle === "pool") return hay.includes("pool");
  if (needle === "ac gym" || needle === "ac") return hay.includes("ac");
  if (
    needle === "couple resort" ||
    needle === "couple friendly" ||
    needle === "romantic" ||
    needle === "couple spot"
  )
    return hay.includes("couple");
  if (needle === "family resort" || needle === "family friendly") return hay.includes("family");
  if (needle === "women friendly" || needle === "women-friendly" || needle === "female trainer")
    return hay.includes("women") || hay.includes("female");
  if (needle === "rooftop" || needle === "rooftop dining") return hay.includes("rooftop");

  return hay.includes(needle);
}

export function priceFromRange(p: Place): number {
  const m = p.priceRange.match(/(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}
