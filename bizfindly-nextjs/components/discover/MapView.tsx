"use client";

import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Place } from "@/types/place";

export function MapView({ places: list }: { places: Place[] }) {
  const [active, setActive] = useState<Place | null>(list[0] ?? null);
  return (
    <div className="border-border bg-card shadow-soft mt-6 overflow-hidden rounded-3xl border">
      <div className="relative h-[520px] w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
        <svg
          className="absolute inset-0 h-full w-full opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-foreground/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="bg-foreground/10 absolute top-0 left-1/4 h-full w-1 -rotate-12" />
        <div className="bg-foreground/10 absolute top-0 right-1/3 h-full w-1 rotate-6" />
        <div className="bg-foreground/10 absolute top-1/3 left-0 h-1 w-full -rotate-3" />

        {list.map((p, i) => {
          const left = 10 + ((i * 17) % 80);
          const top = 15 + ((i * 23) % 70);
          const isActive = active?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              style={{ left: `${left}%`, top: `${top}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-full transition-all",
                isActive ? "z-10 scale-110" : "hover:scale-110",
              )}
            >
              <div
                className={cn(
                  "shadow-card flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                  isActive ? "bg-brand text-brand-foreground" : "bg-background text-foreground",
                )}
              >
                <Star className="h-2.5 w-2.5 fill-current" />
                {p.rating}
              </div>
              <div
                className={cn("mx-auto h-2 w-2 rotate-45", isActive ? "bg-brand" : "bg-background")}
              />
            </button>
          );
        })}

        {active && (
          <div className="absolute inset-x-3 bottom-3 md:inset-x-auto md:right-auto md:left-3 md:w-80">
            <Link
              href={`/place/${active.slug}`}
              className="bg-background shadow-card ring-border flex gap-3 overflow-hidden rounded-2xl p-2 ring-1"
            >
              <img
                src={active.image}
                alt={active.name}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1 py-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-display truncate text-sm font-bold">{active.name}</h4>
                  {active.verified && <BadgeCheck className="text-brand h-3.5 w-3.5" />}
                </div>
                <p className="text-muted-foreground truncate text-[11px]">
                  {active.area} · {active.cuisine ?? active.category}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-0.5 font-bold">
                    <Star className="fill-brand text-brand h-3 w-3" /> {active.rating}
                  </span>
                  <span className="text-muted-foreground">({active.reviews})</span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
