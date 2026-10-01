"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { mapPinsFor, usePlaceFinderStore } from "./usePlaceFinderStore";

import { searchCenter } from "./radiusSearch";
import { CustomSelect } from "@/components/common/CustomSelect";
import { loadGoogleMaps, svgMarkerIcon } from "@/lib/googleMaps";
import type { Place } from "@/types/place";
import { Building2, LocateFixed, MapPin } from "lucide-react";
import { businessTypeConfig } from "./businessTypes";
import { BusinessTypeIcon } from "./BusinessTypeSelect";
import { createMapTooltip, cursorOf, tooltipContent, type MapTooltip } from "./mapTooltip";
import { singleSymbolPrice } from "@/lib/backend/places/price";
import { geoStatusNotice } from "./geolocation";

const MAP_BG = "#EEF0F8";
const RANGE_MARKS = [0, 5, 10, 25, 50, 100];

// The Location & Area card sits on top of the map, so quieten everything that
// would compete with our own pins.
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

// Both pins take the current business type's colour, so switching type is
// visible on the map itself and not just in the list beside it.
const pinSvg = (color: string) => `<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 0C6.268 0 0 6.268 0 14c0 9.9 14 22 14 22S28 23.9 28 14C28 6.268 21.732 0 14 0z" fill="${color}"/>
  <circle cx="14" cy="14" r="5" fill="white"/>
</svg>`;

const dotSvg = (color: string) => `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
  <circle cx="9" cy="9" r="7" fill="${color}" stroke="#fff" stroke-width="2"/>
</svg>`;

function RangeSlider({
  value,
  onChange,
  max = 100,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  const min = 0;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-[3px] rounded-full bg-gray-200" />
        <div
          className="absolute h-[3px] rounded-full bg-brand"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-5 z-10"
        />
        <div
          className="absolute w-5 h-5 rounded-full border-2 border-brand bg-white shadow-md pointer-events-none transition-left"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
        />
      </div>

      <div className="relative mt-2 h-5">
        {RANGE_MARKS.map((m, index) => {
          const isFirst = index === 0;
          const isLast = index === RANGE_MARKS.length - 1;
          const labelPct = ((m - min) / (max - min)) * 100;
          const positionStyle: React.CSSProperties = isFirst
            ? { left: 0 }
            : isLast
              ? { right: 0 }
              : { left: `${labelPct}%`, transform: "translateX(-50%)" };
          const isActive = m === value;
          return (
            <button
              key={m}
              type="button"
              onClick={() => onChange(m)}
              style={positionStyle}
              className={`absolute text-xs whitespace-nowrap cursor-pointer transition-colors hover:text-gray-900 ${
                isActive ? "font-bold text-gray-900" : "text-gray-400 font-normal"
              }`}
            >
              {m === 0 ? "Any" : `${m}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MapInner({
  center,
  range,
  unit,
  places,
  color,
  centerLabel,
  typeLabel,
  centeredOnUser,
}: {
  center: [number, number];
  range: number;
  unit: "km" | "miles";
  places: Place[];
  color: string;
  /** What the radius is measured from, for the circle's tooltip. */
  centerLabel: string;
  /** Plural noun for the listings being shown, e.g. "resorts". */
  typeLabel: string;
  /** Whether the centre pin is standing on the visitor themselves. */
  centeredOnUser: boolean;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const centerMarkerRef = useRef<google.maps.Marker | null>(null);
  const pointMarkersRef = useRef<google.maps.Marker[]>([]);
  const tooltipRef = useRef<MapTooltip | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const rangeInKm = unit === "miles" ? range * 1.60934 : range;

  // One tooltip for every overlay on the map, created before the map itself so
  // the effects that attach hover handlers can rely on it being there.
  useEffect(() => {
    tooltipRef.current = createMapTooltip();
    return () => {
      tooltipRef.current?.destroy();
      tooltipRef.current = null;
    };
  }, []);

  // The circle and the centre pin are created once, but what their tooltips say
  // changes with the radius, the unit, the business type and how many results
  // came back. Reading the builder through a ref keeps the handlers attached at
  // setup from closing over the first render's values.
  const pinnedCount = places.filter((place) => place.coords).length;
  const emptyNode = () => document.createElement("div");
  const circleTooltipRef = useRef<() => HTMLElement>(emptyNode);
  const centerTooltipRef = useRef<() => HTMLElement>(emptyNode);

  useEffect(() => {
    circleTooltipRef.current = () =>
      tooltipContent({
        title: "Search radius",
        subtitle: `Within ${range} ${unit} of ${centerLabel}`,
        facts: [
          `${pinnedCount} ${pinnedCount === 1 ? typeLabel.replace(/s$/, "") : typeLabel} on map`,
        ],
        accent: color,
      });
    centerTooltipRef.current = () =>
      tooltipContent({
        title: centeredOnUser ? "You are here" : centerLabel,
        subtitle:
          range > 0
            ? `Centre of the ${range} ${unit} search`
            : `Middle of the ${typeLabel} shown`,
        accent: color,
      });
  }, [range, unit, centerLabel, typeLabel, pinnedCount, color, centeredOnUser]);

  /** Hover handlers for one overlay, given what its tooltip should say. */
  const hoverTooltip = (build: () => HTMLElement, followCursor = false) => ({
    onOver: (event: google.maps.MapMouseEvent) => {
      const at = cursorOf(event);
      if (at) tooltipRef.current?.show(build(), at);
    },
    onMove: followCursor
      ? (event: google.maps.MapMouseEvent) => {
          const at = cursorOf(event);
          if (at) tooltipRef.current?.moveTo(at);
        }
      : undefined,
    onOut: () => tooltipRef.current?.hide(),
  });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !mapRef.current) return;

        const position = { lat: center[0], lng: center[1] };
        const map = new maps.Map(mapRef.current, {
          center: position,
          zoom: 13,
          disableDefaultUI: true,
          clickableIcons: false,
          backgroundColor: MAP_BG,
          styles: MAP_STYLE,
        });

        centerMarkerRef.current = new maps.Marker({
          position,
          map,
          icon: svgMarkerIcon(pinSvg(color), { width: 28, height: 36 }, { x: 14, y: 36 }),
          zIndex: 10,
        });

        circleRef.current = new maps.Circle({
          center: position,
          radius: (rangeInKm || 5) * 1000,
          // "Any" range filters nothing, so drawing a circle would be a lie.
          visible: rangeInKm > 0,
          map,
          strokeColor: color,
          strokeWeight: 1.5,
          fillColor: color,
          fillOpacity: 0.12,
        });

        // The circle covers a large area, so its tooltip follows the cursor
        // rather than sitting wherever the pointer first crossed the edge.
        const circleHover = hoverTooltip(() => circleTooltipRef.current(), true);
        circleRef.current.addListener("mouseover", circleHover.onOver);
        circleRef.current.addListener("mousemove", circleHover.onMove!);
        circleRef.current.addListener("mouseout", circleHover.onOut);

        const centerHover = hoverTooltip(() => centerTooltipRef.current());
        centerMarkerRef.current.addListener("mouseover", centerHover.onOver);
        centerMarkerRef.current.addListener("mouseout", centerHover.onOut);

        mapInstanceRef.current = map;
        setMapReady(true);
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message);
      });

    return () => {
      cancelled = true;
      pointMarkersRef.current.forEach((marker) => marker.setMap(null));
      pointMarkersRef.current = [];
      circleRef.current?.setMap(null);
      circleRef.current = null;
      centerMarkerRef.current?.setMap(null);
      centerMarkerRef.current = null;
      mapInstanceRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = centerMarkerRef.current;
    const circle = circleRef.current;
    if (!map || !marker || !circle) return;

    const position = { lat: center[0], lng: center[1] };
    marker.setPosition(position);
    circle.setCenter(position);
    map.setCenter(position);
    map.setZoom(range > 0 ? (range > 30 ? 10 : 12) : 13);
  }, [center, range]);

  useEffect(() => {
    circleRef.current?.setRadius((rangeInKm || 5) * 1000);
    circleRef.current?.setVisible(rangeInKm > 0);
  }, [rangeInKm]);

  // A type switch repaints what is already on the map; the place markers are
  // rebuilt by the effect below, which also depends on `color`.
  useEffect(() => {
    circleRef.current?.setOptions({ strokeColor: color, fillColor: color });
    centerMarkerRef.current?.setIcon(
      svgMarkerIcon(pinSvg(color), { width: 28, height: 36 }, { x: 14, y: 36 }),
    );
  }, [color]);

  // One marker per place that has been pinned to real coordinates.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map) return;

    pointMarkersRef.current.forEach((marker) => marker.setMap(null));
    pointMarkersRef.current = [];

    const icon = svgMarkerIcon(dotSvg(color), { width: 18, height: 18 }, { x: 9, y: 9 });

    places.forEach((place) => {
      if (!place.coords) return;
      const marker = new google.maps.Marker({
        position: place.coords,
        map,
        icon,
        // No `title`: that is Google's own hover tooltip, and it would show
        // alongside the Tippy one below.
      });

      const hover = hoverTooltip(() =>
        tooltipContent({
          title: place.name,
          subtitle: [place.cuisine, place.area].filter(Boolean).join(" · ") || place.location,
          facts: [
            place.rating ? `★ ${place.rating.toFixed(1)}` : null,
            place.reviews ? `${place.reviews.toLocaleString()} reviews` : null,
            singleSymbolPrice(place.priceRange) || null,
            place.distanceKm != null ? `${place.distanceKm.toFixed(1)} km away` : null,
          ],
          accent: color,
        }),
      );
      marker.addListener("mouseover", hover.onOver);
      marker.addListener("mouseout", hover.onOut);
      // A click leaves the pin behind, so the tooltip should not linger.
      marker.addListener("click", hover.onOut);

      pointMarkersRef.current.push(marker);
    });

    return () => {
      // Markers are rebuilt whenever the results change; drop their listeners
      // with them so the old ones cannot fire at a destroyed tooltip.
      pointMarkersRef.current.forEach((marker) => {
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
      });
      pointMarkersRef.current = [];
      tooltipRef.current?.hide();
    };
  }, [places, mapReady, color]);

  if (loadError) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-gray-500"
        style={{ background: MAP_BG }}
      >
        Map unavailable — {loadError}
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: MAP_BG }}
    />
  );
}

export function LocationMapComponent() {
  const selectedCity = usePlaceFinderStore((s) => s.selectedCity);
  const setSelectedCity = usePlaceFinderStore((s) => s.setSelectedCity);
  const selectedArea = usePlaceFinderStore((s) => s.selectedArea);
  const setSelectedArea = usePlaceFinderStore((s) => s.setSelectedArea);
  const range = usePlaceFinderStore((s) => s.range);
  const setRange = usePlaceFinderStore((s) => s.setRange);
  const unit = usePlaceFinderStore((s) => s.unit);
  const setUnit = usePlaceFinderStore((s) => s.setUnit);
  const mapPlaces = usePlaceFinderStore((s) => s.mapPlaces);
  const allPlaces = usePlaceFinderStore((s) => s.allPlaces);
  const listTab = usePlaceFinderStore((s) => s.listTab);
  const savedPlaceIds = usePlaceFinderStore((s) => s.savedPlaceIds);
  const placesCenter = usePlaceFinderStore((s) => s.placesCenter);
  const locations = usePlaceFinderStore((s) => s.locations);
  const businessType = usePlaceFinderStore((s) => s.businessType);
  const userLocation = usePlaceFinderStore((s) => s.userLocation);
  const geoStatus = usePlaceFinderStore((s) => s.geoStatus);
  const geoMessage = usePlaceFinderStore((s) => s.geoMessage);
  const locateUser = usePlaceFinderStore((s) => s.locateUser);
  const clearUserLocation = usePlaceFinderStore((s) => s.clearUserLocation);

  const geoNotice = geoStatusNotice(geoStatus, geoMessage ?? undefined);

  const typeConfig = businessTypeConfig(businessType);

  // Only the areas of the chosen city; with no city chosen, every area there is.
  const areaOptions = useMemo(() => {
    const city = locations.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase());
    return city ? city.areas : locations.flatMap((entry) => entry.areas);
  }, [locations, selectedCity]);

  const pinPlaces = useMemo(
    () => mapPinsFor({ mapPlaces, allPlaces, listTab, savedPlaceIds }),
    [mapPlaces, allPlaces, listTab, savedPlaceIds],
  );

  const pinnedCount = useMemo(
    () => pinPlaces.filter((place) => place.coords).length,
    [pinPlaces],
  );

  const [mounted, setMounted] = useState(false);

  // The map only exists in the browser, so hold it back until after hydration.
  useEffect(() => setMounted(true), []);

  // The same centre the store measures its radius from, so the circle drawn
  // here is the circle the backend filtered by. Memoised because the map
  // effects key off its identity.
  const position = useMemo<[number, number]>(() => {
    const center = searchCenter({
      selectedCity,
      selectedArea,
      userLocation,
      placesCenter,
      locations,
      range: 0,
      unit: "km",
    });
    return [center.lat, center.lng];
  }, [selectedCity, selectedArea, userLocation, placesCenter, locations]);

  // Whether the pin is standing on the visitor rather than on a place they
  // picked, which changes what its tooltip should say.
  const centeredOnUser = Boolean(userLocation && !selectedArea && !selectedCity);

  return (
    <div className="relative z-[1] w-full h-[314px] max-sm:flex max-sm:flex-col max-sm:gap-3 max-sm:h-auto">
      <div className="absolute inset-0 overflow-hidden rounded-2xl max-sm:relative max-sm:h-[200px] max-sm:shrink-0 bg-[#ECEEF8]">
        {mounted && (
          <MapInner
            center={position}
            range={range}
            unit={unit}
            places={pinPlaces}
            color={typeConfig.markerColor}
            centerLabel={
              selectedArea || selectedCity || (centeredOnUser ? "your location" : "these listings")
            }
            typeLabel={typeConfig.plural}
            centeredOnUser={centeredOnUser}
          />
        )}
        <div className="absolute inset-0 pointer-events-none bg-brand/5" />
      </div>

      <div className="absolute top-4 left-4 w-full max-w-[440px] px-2 sm:px-0 z-[1000] max-sm:relative max-sm:top-auto max-sm:left-auto max-sm:px-0 max-sm:shrink-0">
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-card border border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-900 font-semibold text-base">Location & Area</span>
            <span
              className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
              style={{
                color: typeConfig.markerColor,
                backgroundColor: `${typeConfig.markerColor}14`,
              }}
            >
              <BusinessTypeIcon type={businessType} size={11} />
              {pinnedCount} {typeConfig.plural} on map
            </span>
          </div>

          <div className="flex gap-2">
            <CustomSelect
              value={selectedCity}
              options={locations.map((c) => ({ value: c.name, label: c.name }))}
              onChange={(val) => setSelectedCity(val)}
              icon={<Building2 size={13} />}
              className="flex-1"
              triggerClassName="h-9 rounded-xl border border-border bg-gray-50 text-xs font-semibold text-foreground shadow-none"
              menuClassName="w-full"
            />
            <CustomSelect
              value={selectedArea}
              options={[
                { value: "", label: "All Areas" },
                ...areaOptions.map((a) => ({ value: a.name, label: a.name })),
              ]}
              onChange={(val) => setSelectedArea(val)}
              icon={<MapPin size={13} />}
              className="flex-1"
              triggerClassName="h-9 rounded-xl border border-border bg-gray-50 text-xs font-semibold text-foreground shadow-none"
              menuClassName="w-full"
            />
          </div>

          {geoStatus !== "unsupported" && (
            <div className="flex flex-wrap items-center justify-between gap-2 -mt-1">
              <button
                type="button"
                onClick={() => (centeredOnUser ? clearUserLocation() : void locateUser())}
                disabled={geoStatus === "prompting"}
                className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold transition cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
                  centeredOnUser
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-border bg-gray-50 text-foreground hover:border-brand/40"
                }`}
              >
                <LocateFixed size={13} />
                {geoStatus === "prompting"
                  ? "Locating…"
                  : centeredOnUser
                    ? "Using my location"
                    : geoNotice
                      ? "Try again"
                      : "Use my location"}
              </button>
              {/* A city or area the visitor picked outranks their position, so
                  say so rather than leaving the button looking broken. */}
              {userLocation && !centeredOnUser && (
                <span className="text-muted-foreground text-[11px]">
                  {selectedArea || selectedCity} selected
                </span>
              )}
              {/* What to do on screen; the browser's own wording, which names
                  the real cause, on hover. */}
              {geoNotice && (
                <span
                  title={[geoNotice.text, geoNotice.detail].filter(Boolean).join(" — ")}
                  className="text-muted-foreground min-w-0 flex-1 text-right text-[11px] leading-tight"
                >
                  {geoNotice.text}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-semibold text-sm">Radius Range</span>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                {(["km", "miles"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer capitalize ${
                      unit === u ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <RangeSlider value={range} onChange={setRange} />
          </div>
        </div>
      </div>
    </div>
  );
}
