/**
 * Reading `Place.priceRange` back apart.
 *
 * The mappers build it as a price *tier* -- one symbol per level -- followed by
 * the figures: "৳৳ • 500–900 per person", or "৳ 1500–2500" for a gym, or a
 * plain "Price on request" when nothing is recorded. A run of symbols reads as
 * a typo wherever it is shown, and every surface that shows a price was
 * stripping it with its own copy of the same regex, which is how the gym shape
 * came to slip through one of them and render two symbols.
 */

export const PRICE_SYMBOL = "৳";

/** Any leading currency symbols, and the bullet that follows a tier run. */
const LEADING_SYMBOLS = /^[৳$₹]+\s*(?:•\s*)?/;

/** The figures alone, with no currency symbol and no tier run. */
export function priceAmount(priceRange?: string): string {
  return (priceRange ?? "").replace(LEADING_SYMBOLS, "").replace(/[৳$₹]+/g, "").trim();
}

/** Whether the range names an actual figure rather than "Price on request". */
export function hasPriceFigure(priceRange?: string): boolean {
  return /\d/.test(priceAmount(priceRange));
}

/**
 * The price as one line behind a single symbol, e.g. "৳ 500–900 per person".
 *
 * A range with no figure in it keeps its words and loses the symbol, so
 * "Price on request" never comes back as "৳ Price on request".
 */
export function singleSymbolPrice(priceRange?: string): string {
  const amount = priceAmount(priceRange);
  if (!amount) return "";
  return hasPriceFigure(priceRange) ? `${PRICE_SYMBOL} ${amount}` : amount;
}
