"use client";

import { SavePlaceButton } from "@/components/common/SavePlaceButton";
import { OpeningHours } from "./OpeningHours";
import { Clock, Globe, MapPin, Phone } from "lucide-react";
import { directionsUrl, mapEmbedUrl, mapLinkUrl } from "@/lib/maps";
import type { Place } from "@/types/place";

export function PricingSidebar({ place }: { place: Place }) {
  const embedSrc = mapEmbedUrl(place);
  return (
    <div className="bg-card shadow-card rounded-3xl p-6">
      <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        Pricing
      </div>
      <div className="font-display mt-1 text-2xl font-bold">{place.priceRange}</div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
          <a
            href={mapLinkUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {place.location}
          </a>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="text-muted-foreground mt-0.5 h-4 w-4" />
          <span>{place.phone}</span>
        </div>
        {place.website && (
          <div className="flex items-start gap-3">
            <Globe className="text-muted-foreground mt-0.5 h-4 w-4" />
            <span>{place.website}</span>
          </div>
        )}
        <div className="flex items-start gap-3">
          <Clock className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <OpeningHours hours={place.hours} />
          </div>
        </div>
      </div>

      <button className="gradient-brand text-brand-foreground shadow-glow mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold">
        Reserve / Contact
      </button>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={directionsUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-surface inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold"
        >
          Directions
        </a>
        <SavePlaceButton place={place} showLabel className="border-border bg-surface rounded-full border px-4 py-2.5 text-sm font-semibold" />
      </div>

      <div className="from-muted to-secondary mt-5 h-40 overflow-hidden rounded-2xl bg-gradient-to-br">
        {embedSrc ? (
          <iframe
            src={embedSrc}
            title={`Map of ${place.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            Map preview
          </div>
        )}
      </div>
    </div>
  );
}
