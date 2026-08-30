"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { usePlaceFinderStore } from "./usePlaceFinderStore";
import { BD_CITIES, DHAKA_AREAS } from "./constants";
import { CustomSelect } from "@/components/common/CustomSelect";
import { Building2, MapPin } from "lucide-react";

const INDIGO = "#e60b1d";
const INDIGO_LIGHT = "#ffbebe";
const MAP_BG = "#EEF0F8";
const RANGE_MARKS = [0, 5, 10, 25, 50, 100];

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
  places: Array<{ id: string; name: string; area: string; category: string }>;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Leaflet.Map | null>(null);
  const circleRef = useRef<Leaflet.Circle | null>(null);
  const centerMarkerRef = useRef<Leaflet.Marker | null>(null);
  const pointMarkersRef = useRef<Leaflet.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const rangeInKm = unit === "miles" ? range * 1.60934 : range;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      const pinIcon = L.divIcon({
        html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.268 0 0 6.268 0 14c0 9.9 14 22 14 22S28 23.9 28 14C28 6.268 21.732 0 14 0z" fill="${INDIGO}"/>
          <circle cx="14" cy="14" r="5" fill="white"/>
        </svg>`,
        className: "",
        iconSize: [28, 36],
        iconAnchor: [14, 36],
      });

      centerMarkerRef.current = L.marker(center, { icon: pinIcon }).addTo(map);

      circleRef.current = L.circle(center, {
        radius: (rangeInKm || 5) * 1000,
        color: INDIGO,
        fillColor: INDIGO_LIGHT,
        fillOpacity: 0.15,
        weight: 1.5,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        circleRef.current = null;
        centerMarkerRef.current = null;
        pointMarkersRef.current = [];
        setMapReady(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = centerMarkerRef.current;
    const circle = circleRef.current;
    if (!map || !marker || !circle) return;

    marker.setLatLng(center);
    circle.setLatLng(center);
    map.setView(center, range > 0 ? (range > 30 ? 10 : 12) : 13);
  }, [center, range]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const circle = circleRef.current;
    if (!map || !circle) return;

    circle.setRadius((rangeInKm || 5) * 1000);
  }, [rangeInKm]);

  // Add random jittered markers for nearby places around center
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const currentMap = mapInstanceRef.current;

    import("leaflet").then((L) => {
      pointMarkersRef.current.forEach((m) => m.remove());
      pointMarkersRef.current = [];

      places.slice(0, 15).forEach((p, idx) => {
        const angle = (idx / 15) * 2 * Math.PI;
        const dist = 0.008 + (idx % 4) * 0.006;
        const lat = center[0] + Math.sin(angle) * dist;
        const lng = center[1] + Math.cos(angle) * dist;

        const dotIcon = L.divIcon({
          html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${INDIGO};border:2px solid #fff;box-shadow:0 0 0 1.5px ${INDIGO};"></span>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([lat, lng], { icon: dotIcon }).addTo(currentMap);
        marker.bindTooltip(`<b>${p.name}</b><br><span style="font-size:11px;color:#666">${p.area}</span>`, {
          direction: "top",
          offset: [0, -8],
        });
        pointMarkersRef.current.push(marker);
      });
    });
  }, [places, center, mapReady]);

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

  const [position, setPosition] = useState<[number, number]>([23.8103, 90.4125]);
  const [LeafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    setLeafletLoaded(true);
  }, []);

  // Update center coords on city/area change
  useEffect(() => {
    if (selectedArea) {
      const areaMatch = DHAKA_AREAS.find((a) => a.name.toLowerCase() === selectedArea.toLowerCase());
      if (areaMatch) {
        setPosition([areaMatch.lat, areaMatch.long]);
        return;
      }
    }
    const cityMatch = BD_CITIES.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase());
    if (cityMatch) {
      setPosition([cityMatch.lat, cityMatch.long]);
    }
  }, [selectedCity, selectedArea]);

  return (
    <div className="relative z-[1] w-full h-[314px] max-sm:flex max-sm:flex-col max-sm:gap-3 max-sm:h-auto">
      <div className="absolute inset-0 overflow-hidden rounded-2xl max-sm:relative max-sm:h-[200px] max-sm:shrink-0 bg-[#ECEEF8]">
        {LeafletLoaded && (
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
              options={BD_CITIES.map((c) => ({ value: c.name, label: c.name }))}
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
                ...DHAKA_AREAS.map((a) => ({ value: a.name, label: a.name })),
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
