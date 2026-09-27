"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlaceFinderStore } from "./usePlaceFinderStore";

import { searchCenter } from "./radiusSearch";
import { CustomSelect } from "@/components/common/CustomSelect";
import { loadGoogleMaps, svgMarkerIcon } from "@/lib/googleMaps";
import type { Place } from "@/types/place";
import { Building2, MapPin } from "lucide-react";

const INDIGO = "#e60b1d";
const INDIGO_LIGHT = "#ffbebe";
const MAP_BG = "#EEF0F8";
const RANGE_MARKS = [0, 5, 10, 25, 50, 100];

// The Location & Area card sits on top of the map, so quieten everything that
// would compete with our own pins.
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const PIN_SVG = `<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 0C6.268 0 0 6.268 0 14c0 9.9 14 22 14 22S28 23.9 28 14C28 6.268 21.732 0 14 0z" fill="${INDIGO}"/>
  <circle cx="14" cy="14" r="5" fill="white"/>
</svg>`;

const DOT_SVG = `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
  <circle cx="9" cy="9" r="7" fill="${INDIGO}" stroke="#fff" stroke-width="2"/>
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
}: {
  center: [number, number];
  range: number;
  unit: "km" | "miles";
  places: Place[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const centerMarkerRef = useRef<google.maps.Marker | null>(null);
  const pointMarkersRef = useRef<google.maps.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const rangeInKm = unit === "miles" ? range * 1.60934 : range;

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
          icon: svgMarkerIcon(PIN_SVG, { width: 28, height: 36 }, { x: 14, y: 36 }),
          zIndex: 10,
        });

        circleRef.current = new maps.Circle({
          center: position,
          radius: (rangeInKm || 5) * 1000,
          // "Any" range filters nothing, so drawing a circle would be a lie.
          visible: rangeInKm > 0,
          map,
          strokeColor: INDIGO,
          strokeWeight: 1.5,
          fillColor: INDIGO_LIGHT,
          fillOpacity: 0.15,
        });

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

  // One marker per place that has been pinned to real coordinates.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map) return;

    pointMarkersRef.current.forEach((marker) => marker.setMap(null));
    pointMarkersRef.current = [];

    const icon = svgMarkerIcon(DOT_SVG, { width: 18, height: 18 }, { x: 9, y: 9 });

    places.forEach((place) => {
      if (!place.coords) return;
      // `title` is Google's own hover tooltip.
      const away = place.distanceKm != null ? ` · ${place.distanceKm.toFixed(1)} km away` : "";
      pointMarkersRef.current.push(
        new google.maps.Marker({
          position: place.coords,
          map,
          icon,
          title: `${place.name} · ${place.area}${away}`,
        }),
      );
    });
  }, [places, mapReady]);

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
  const visiblePlaces = usePlaceFinderStore((s) => s.visiblePlaces);
  const placesCenter = usePlaceFinderStore((s) => s.placesCenter);
  const locations = usePlaceFinderStore((s) => s.locations);

  // Only the areas of the chosen city; with no city chosen, every area there is.
  const areaOptions = useMemo(() => {
    const city = locations.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase());
    return city ? city.areas : locations.flatMap((entry) => entry.areas);
  }, [locations, selectedCity]);

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
      placesCenter,
      locations,
      range: 0,
      unit: "km",
    });
    return [center.lat, center.lng];
  }, [selectedCity, selectedArea, placesCenter, locations]);

  return (
    <div className="relative z-[1] w-full h-[314px] max-sm:flex max-sm:flex-col max-sm:gap-3 max-sm:h-auto">
      <div className="absolute inset-0 overflow-hidden rounded-2xl max-sm:relative max-sm:h-[200px] max-sm:shrink-0 bg-[#ECEEF8]">
        {mounted && (
          <MapInner center={position} range={range} unit={unit} places={visiblePlaces} />
        )}
        <div className="absolute inset-0 pointer-events-none bg-brand/5" />
      </div>

      <div className="absolute top-4 left-4 w-full max-w-[440px] px-2 sm:px-0 z-[1000] max-sm:relative max-sm:top-auto max-sm:left-auto max-sm:px-0 max-sm:shrink-0">
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-semibold text-base">Location & Area</span>
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
