"use client";

import { Grid3x3, Heart, Share2 } from "lucide-react";

export function PlaceGallery({
  gallery,
  name,
  onOpenAt,
}: {
  gallery: string[];
  name: string;
  onOpenAt: (i: number) => void;
}) {
  return (
    <div className="relative">
      <div className="grid h-[60vh] grid-cols-4 grid-rows-2 gap-1 overflow-hidden md:h-[520px]">
        <button
          type="button"
          onClick={() => onOpenAt(0)}
          className="group relative col-span-4 row-span-2 overflow-hidden md:col-span-2"
        >
          <img
            src={gallery[0]}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </button>
        {gallery.slice(1, 5).map((g, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onOpenAt(i + 1)}
            className="group relative hidden overflow-hidden md:block"
          >
            <img
              src={g}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      <button
        onClick={() => onOpenAt(0)}
        className="bg-background/90 shadow-card hover:bg-background absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold backdrop-blur transition md:right-6 md:bottom-6"
      >
        <Grid3x3 className="h-3.5 w-3.5" /> View all {gallery.length} photos
      </button>

      <div className="absolute top-4 right-4 flex gap-2 md:top-8 md:right-8">
        <button className="glass flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105">
          <Share2 className="h-4 w-4" />
        </button>
        <button className="glass flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105">
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
