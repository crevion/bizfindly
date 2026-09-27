/**
 * Loads the Google Maps JavaScript API once per page.
 *
 * The key must be set as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and belong to a
 * billing-enabled Cloud project — unlike the Embed API used on place pages,
 * map loads here are billed. Restrict the key to your domains in the console,
 * since a NEXT_PUBLIC_ value is visible to anyone who opens the page.
 */

const CALLBACK = "__bizfindlyGoogleMapsReady";

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

type ReadyWindow = Window & { [CALLBACK]?: () => void };

let loader: Promise<typeof google.maps> | null = null;

export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (loader) return loader;

  loader = new Promise<typeof google.maps>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Google Maps can only load in the browser."));
      return;
    }
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set."));
      return;
    }

    const scoped = window as ReadyWindow;
    scoped[CALLBACK] = () => {
      delete scoped[CALLBACK];
      resolve(window.google.maps);
    };

    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      v: "weekly",
      loading: "async",
      callback: CALLBACK,
    });
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => reject(new Error("Could not load the Google Maps script."));
    document.head.appendChild(script);
  });

  // Let a later mount retry rather than caching the failure forever.
  loader.catch(() => {
    loader = null;
  });

  return loader;
}

/** Wraps inline SVG as a marker icon, which Google takes as a data URL. */
export function svgMarkerIcon(
  svg: string,
  size: { width: number; height: number },
  anchor: { x: number; y: number },
): google.maps.Icon {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size.width, size.height),
    anchor: new google.maps.Point(anchor.x, anchor.y),
  };
}
