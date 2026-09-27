"use client";

import { Grid3x3, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { SavePlaceButton } from "@/components/common/SavePlaceButton";
import type { Place } from "@/types/place";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80";

export function PlaceGallery({
  gallery,
  name,
  onOpenAt,
  place,
}: {
  place: Pick<Place, "category" | "slug">;
  gallery: string[];
  name: string;
  onOpenAt: (i: number) => void;
}) {

  const images =
    Array.isArray(gallery) && gallery.length > 0
      ? gallery.filter((img) => typeof img === "string" && img.trim().length > 0)
      : [];

  const displayImages = images.length > 0 ? images : [FALLBACK_IMAGE];
  const count = displayImages.length;
  const rawCount = images.length;

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          url: window.location.href,
        });
      } catch {
        // Share modal dismissed
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const renderGridContent = () => {
    // 1 image: Full width hero banner
    if (count === 1) {
      return (
        <div className="h-full w-full">
          <button
            type="button"
            onClick={() => onOpenAt(0)}
            aria-label={`View photo of ${name}`}
            className="group relative h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={displayImages[0]}
              alt={name}
              loading="eager"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>
        </div>
      );
    }

    // 2 images: Side-by-side 2 column split
    if (count === 2) {
      return (
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => onOpenAt(0)}
            aria-label={`View photo 1 of ${name}`}
            className="group relative h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={displayImages[0]}
              alt={`${name} photo 1`}
              loading="eager"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>
          <button
            type="button"
            onClick={() => onOpenAt(1)}
            aria-label={`View photo 2 of ${name}`}
            className="group relative hidden md:block h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={displayImages[1]}
              alt={`${name} photo 2`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>
        </div>
      );
    }

    // 3 images: 1 large left, 2 stacked right
    if (count === 3) {
      return (
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => onOpenAt(0)}
            aria-label={`View photo 1 of ${name}`}
            className="group relative h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={displayImages[0]}
              alt={`${name} photo 1`}
              loading="eager"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>

          <div className="hidden md:grid grid-rows-2 gap-1.5 md:gap-2 h-full w-full">
            {displayImages.slice(1, 3).map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onOpenAt(i + 1)}
                aria-label={`View photo ${i + 2} of ${name}`}
                className="group relative h-full w-full cursor-pointer overflow-hidden text-left"
              >
                <img
                  src={src}
                  alt={`${name} photo ${i + 2}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 4 images: 1 large left (2 cols, 2 rows), 1 wide top-right (2 cols, 1 row), 2 bottom-right (1 col each)
    if (count === 4) {
      return (
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => onOpenAt(0)}
            aria-label={`View photo 1 of ${name}`}
            className="group relative col-span-1 md:col-span-2 md:row-span-2 h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={displayImages[0]}
              alt={`${name} photo 1`}
              loading="eager"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>

          <button
            type="button"
            onClick={() => onOpenAt(1)}
            aria-label={`View photo 2 of ${name}`}
            className="group relative hidden md:block md:col-span-2 md:row-span-1 h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={displayImages[1]}
              alt={`${name} photo 2`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>

          <button
            type="button"
            onClick={() => onOpenAt(2)}
            aria-label={`View photo 3 of ${name}`}
            className="group relative hidden md:block md:col-span-1 md:row-span-1 h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={displayImages[2]}
              alt={`${name} photo 3`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>

          <button
            type="button"
            onClick={() => onOpenAt(3)}
            aria-label={`View photo 4 of ${name}`}
            className="group relative hidden md:block md:col-span-1 md:row-span-1 h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={displayImages[3]}
              alt={`${name} photo 4`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>
        </div>
      );
    }

    // 5+ images: 1 large left (2 cols, 2 rows) and 4 equal slots on right (2 cols x 2 rows)
    return (
      <div className="grid h-full w-full grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1.5 md:gap-2">
        <button
          type="button"
          onClick={() => onOpenAt(0)}
          aria-label={`View photo 1 of ${name}`}
          className="group relative col-span-1 md:col-span-2 md:row-span-2 h-full w-full cursor-pointer overflow-hidden text-left"
        >
          <img
            src={displayImages[0]}
            alt={`${name} photo 1`}
            loading="eager"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
        </button>

        {displayImages.slice(1, 5).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onOpenAt(i + 1)}
            aria-label={`View photo ${i + 2} of ${name}`}
            className="group relative hidden md:block md:col-span-1 md:row-span-1 h-full w-full cursor-pointer overflow-hidden text-left"
          >
            <img
              src={src}
              alt={`${name} photo ${i + 2}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
            {i === 3 && count > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white font-semibold text-sm backdrop-blur-xs transition duration-300 group-hover:bg-black/55">
                +{count - 5} more
              </div>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full bg-muted">
      <div className="h-[48vh] min-h-[280px] sm:h-[55vh] md:h-[480px] lg:h-[520px] max-h-[600px] w-full overflow-hidden">
        {renderGridContent()}
      </div>

      {/* Floating Photo Count Button */}
      {rawCount > 0 && (
        <button
          type="button"
          onClick={() => onOpenAt(0)}
          className="bg-background/90 text-foreground hover:bg-background border border-border/80 shadow-card hover:shadow-md absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] md:right-6 md:bottom-6 cursor-pointer"
        >
          <Grid3x3 className="h-3.5 w-3.5" />
          <span>{rawCount === 1 ? "1 photo" : `View all ${rawCount} photos`}</span>
        </button>
      )}

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 md:top-6 md:right-6">
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share listing"
          className="glass flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-foreground shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Share2 className="h-4 w-4" />
        </button>
        <SavePlaceButton place={place} className="glass h-9 w-9 rounded-full text-foreground shadow-sm hover:scale-105 active:scale-95 sm:h-10 sm:w-10" />
      </div>
    </div>
  );
}
