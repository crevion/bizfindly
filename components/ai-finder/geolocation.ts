import type { MapCenter } from "./constants";

/**
 * Where the visitor is, as the browser will tell us.
 *
 * `prompting` is the window in which the browser's own permission dialog is
 * open, which can stay open indefinitely -- the visitor may simply ignore it --
 * so nothing is allowed to wait on this resolving.
 *
 * The failures are kept apart because they call for different things.
 * `unsupported` can never work here, so the control hides itself; a refusal is
 * the visitor's decision and the page should stop asking; a timeout is worth
 * another go; and an unavailable position is usually the operating system
 * withholding location from the browser, which is worth saying out loud
 * because no amount of retrying inside the page will fix it.
 */
export type GeoStatus =
  | "idle"
  | "prompting"
  | "granted"
  | "denied"
  | "unsupported"
  | "unavailable"
  | "timeout"
  | "error";

export interface GeoResult {
  status: GeoStatus;
  center: MapCenter | null;
  /**
   * The browser's own explanation, kept for the failures we cannot interpret.
   * It is often the only thing that names the real cause -- a blocked network
   * location provider, say -- so it is shown rather than swallowed.
   */
  message?: string;
}

/** Geolocation is refused outright outside a secure context. */
export const geolocationAvailable = (): boolean =>
  typeof navigator !== "undefined" &&
  "geolocation" in navigator &&
  (window.isSecureContext || window.location.hostname === "localhost");

/**
 * Whether the browser will show a dialog, or will answer without asking.
 *
 * The Permissions API is what makes it possible to avoid prompting on every
 * page load: a visitor who has already granted or refused is answered from
 * here. Not every browser implements it for geolocation, so an unknown answer
 * means "ask".
 */
export async function geolocationPermission(): Promise<PermissionState | "unknown"> {
  if (!navigator.permissions?.query) return "unknown";
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state;
  } catch {
    return "unknown";
  }
}

// First attempt: a city-block fix is plenty for centring a map and measuring a
// radius, and the coarse answer comes back fast and without waking the GPS.
const COARSE: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 12_000,
  // A fix from the last ten minutes is fine; this is not turn-by-turn.
  maximumAge: 600_000,
};

// Second attempt, only after a timeout or a missing position. A desktop with
// no cached fix has to ask a network location service, and that round trip
// routinely outlasts the coarse attempt -- which is the common reason a
// perfectly well-permissioned browser reports no location at all. Giving it
// longer, and letting it use every sensor, is usually all it needs.
const PRECISE: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25_000,
  maximumAge: 0,
};

const centerOf = (position: GeolocationPosition): MapCenter => ({
  lat: position.coords.latitude,
  lng: position.coords.longitude,
});

const statusOf = (error: GeolocationPositionError): GeoStatus => {
  if (error.code === error.PERMISSION_DENIED) return "denied";
  if (error.code === error.TIMEOUT) return "timeout";
  if (error.code === error.POSITION_UNAVAILABLE) return "unavailable";
  return "error";
};

function attempt(options: PositionOptions): Promise<GeoResult> {
  return new Promise<GeoResult>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ status: "granted", center: centerOf(position) }),
      (error) =>
        resolve({
          status: statusOf(error),
          center: null,
          message: error.message || undefined,
        }),
      options,
    );
  });
}

/** Asks the browser where the visitor is. Never rejects. */
export async function requestGeolocation(): Promise<GeoResult> {
  if (!geolocationAvailable()) {
    return {
      status: "unsupported",
      center: null,
      message: "Location needs a secure (https) connection.",
    };
  }

  const coarse = await attempt(COARSE);
  if (coarse.status === "granted" || coarse.status === "denied") return coarse;

  // Worth one more, with the gloves off.
  const precise = await attempt(PRECISE);
  // A second failure of the same kind is the honest answer; but if the retry
  // merely timed out again, the first reason was the more informative one.
  return precise.status === "granted" || precise.status === "denied"
    ? precise
    : { ...precise, message: precise.message ?? coarse.message };
}

/** What to tell the visitor when a location request did not work out. */
export interface GeoNotice {
  /** What to show. Says what to do about it, where there is something to do. */
  text: string;
  /** The browser's own wording, for the tooltip. Jargon, but diagnostic. */
  detail?: string;
}

/**
 * What to tell the visitor when a location request did not work out.
 *
 * The browser's own message is kept out of the visible text on purpose. It is
 * written for developers -- "Position update is unavailable" -- so it goes in
 * the tooltip, and the line on screen says what the visitor can actually do.
 */
export function geoStatusNotice(status: GeoStatus, message?: string): GeoNotice | null {
  const detail = message?.trim() || undefined;
  switch (status) {
    case "unsupported":
      return { text: detail ?? "This browser cannot share your location here." };
    case "denied":
      return { text: "Location is blocked for this site in your browser settings.", detail };
    case "timeout":
      return { text: "Took too long to find you — try again.", detail };
    case "unavailable":
      // Nearly always the operating system rather than the browser: the site's
      // own permission is granted and macOS or Windows is still withholding
      // location from the browser itself, so pointing at the site's
      // permissions would send someone to the wrong settings screen.
      return {
        text: "Your device would not share a location. Check location services are on for your browser.",
        detail,
      };
    case "error":
      return { text: "Could not get your location.", detail };
    default:
      return null;
  }
}
