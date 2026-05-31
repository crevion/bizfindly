"use client";

import { Eye, Heart, Star } from "lucide-react";
import { CATEGORIES } from "@/content/listingCategories";
import type { ListingDraft } from "@/types/listing";
import { Stat } from "./Stat";

export function ListingHero({ active }: { active: ListingDraft }) {
  const cfg = active.category ? CATEGORIES[active.category] : null;
  const hero = Object.values(active.images).flat()[0] || cfg?.image;

  const views = 1240 + (active.id ? active.id.length * 7 : 0);
  const saves = Math.round(views * 0.18);

  return (
    <div className="border-border bg-card shadow-card overflow-hidden rounded-3xl border">
      <div className="relative h-48">
        {hero && <img src={hero} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="text-xs font-semibold uppercase opacity-80">{cfg?.label}</div>
          <div className="font-display text-2xl font-bold">{active.name}</div>
          <div className="text-sm opacity-90">{active.location}</div>
        </div>
      </div>
      <div className="divide-border grid grid-cols-3 divide-x">
        <Stat icon={Eye} label="Views" value={views.toLocaleString()} trend="+12%" />
        <Stat icon={Heart} label="Saves" value={saves.toString()} trend="+8%" />
        <Stat icon={Star} label="Rating" value="—" trend="New" />
      </div>
    </div>
  );
}
