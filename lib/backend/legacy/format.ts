import type { LegacyListing } from "./api";

/** "food-restaurants" -> "Food Restaurants". */
export const humanizeSlug = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatTaka = (value: string) => `৳${Number(value).toLocaleString("en-US")}`;

/** The old site's price fields as one line, or null when it showed no price. */
export function legacyPrice(listing: LegacyListing): string | null {
  if (listing.pricing_type === "disabled") return null;
  if (listing.price_type === "on_call") return "Call for price";
  if (!listing.price) return null;
  const amount = listing.max_price
    ? `${formatTaka(listing.price)} – ${formatTaka(listing.max_price)}`
    : formatTaka(listing.price);
  return listing.price_type === "negotiable" ? `${amount} (negotiable)` : amount;
}

/**
 * The old site stored hours as "Status: Active | Type: Selective" followed by
 * one "Day: hh:mm-hh:mm" line per day. Returns the day lines (or "Open 24/7")
 * in the shape OpeningHours renders.
 */
export function legacyHours(value: string): string {
  const [header = "", ...days] = value.split("\n").map((line) => line.trim());
  if (!header.startsWith("Status:")) return value.trim();
  const type = header.match(/Type:\s*(.+)$/)?.[1]?.trim();
  if (days.filter(Boolean).length) return days.filter(Boolean).join("\n");
  return type && type !== "Selective" ? type : "";
}
