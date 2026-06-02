"use client";

import { Clock, Globe, MapPin, Phone } from "lucide-react";
import type { Place } from "@/types/place";

export function PricingSidebar({ place }: { place: Place }) {
  return (
    <div className="bg-card shadow-card rounded-3xl p-6">
      <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        Pricing
      </div>
      <div className="font-display mt-1 text-2xl font-bold">{place.priceRange}</div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
          <span>{place.location}</span>
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
          <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
          <span>{place.hours}</span>
        </div>
      </div>

      <button className="gradient-brand text-brand-foreground shadow-glow mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold">
        Reserve / Contact
      </button>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button className="border-border bg-surface rounded-full border px-4 py-2.5 text-sm font-semibold">
          Directions
        </button>
        <button className="border-border bg-surface rounded-full border px-4 py-2.5 text-sm font-semibold">
          Save
        </button>
      </div>

      <div className="from-muted to-secondary mt-5 h-40 overflow-hidden rounded-2xl bg-gradient-to-br">
        <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
          Map preview
        </div>
      </div>
    </div>
  );
}
