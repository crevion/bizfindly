import type { Place } from "@/types/place";

type MapTarget = Pick<Place, "name" | "location" | "coords" | "mapUrl">;

const searchQuery = (place: MapTarget) =>
  [place.name, place.location].filter(Boolean).join(", ");

/** Link that opens turn-by-turn directions in the viewer's maps app. */
export function directionsUrl(place: MapTarget): string {
  if (place.coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}`;
  }
  if (place.mapUrl) return place.mapUrl;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchQuery(place))}`;
}

/** Link to the place on Google Maps — the owner's share link when they gave one. */
export function mapLinkUrl(place: MapTarget): string {
  if (place.mapUrl) return place.mapUrl;
  if (place.coords) {
    return `https://www.google.com/maps/search/?api=1&query=${place.coords.lat},${place.coords.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery(place))}`;
}

/** Key for the official Maps Embed API — optional, see mapEmbedUrl(). */
const EMBED_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

/** Escapes a query for the `pb` parameter, whose segments are `!`-delimited. */
const embedQuery = (value: string) =>
  encodeURIComponent(value).replace(/!/g, "%21").replace(/%2C/gi, ",");

/**
 * Embeddable map source, or undefined when we have nothing to pin — coordinates
 * give an exact pin, otherwise we fall back to searching the address text.
 *
 * The obvious `maps?q=…&output=embed` URL does not work in an iframe: it 301s to
 * `/maps/embed`, and that redirect response carries `X-Frame-Options: SAMEORIGIN`,
 * so the browser refuses to render the frame. We therefore point straight at the
 * redirect target. Set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY to use the documented
 * Maps Embed API instead (it needs a key, but Google does not charge for it).
 */
export function mapEmbedUrl(place: MapTarget): string | undefined {
  const query = place.coords ? `${place.coords.lat},${place.coords.lng}` : searchQuery(place);
  if (!query) return undefined;
  const zoom = place.coords ? 16 : 15;
  if (EMBED_API_KEY) {
    const params = new URLSearchParams({ key: EMBED_API_KEY, q: query, zoom: String(zoom) });
    return `https://www.google.com/maps/embed/v1/place?${params}`;
  }
  return `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${embedQuery(query)}!6i${zoom}`;
}

/**
 * Reads a "lat, lng" pair the way Google Maps puts it on the clipboard, so
 * pasting into either coordinate box can fill both. Returns the numbers as
 * typed — the API rounds anything beyond the stored precision.
 */
export function parseCoordinatePair(text: string): { lat: string; lng: string } | undefined {
  const match = text
    .trim()
    .match(/^(-?\d{1,3}(?:\.\d+)?)\s*(?:,|\s)\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (!match) return undefined;
  const [, lat, lng] = match;
  if (Math.abs(Number(lat)) > 90 || Math.abs(Number(lng)) > 180) return undefined;
  return { lat, lng };
}
