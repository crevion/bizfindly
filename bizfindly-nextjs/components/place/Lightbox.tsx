"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Lightbox({
  gallery,
  index,
  onClose,
  onPrev,
  onNext,
  onPickIndex,
}: {
  gallery: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPickIndex: (i: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
        {index + 1} / {gallery.length}
      </div>

      <button
        onClick={onPrev}
        className="absolute left-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:flex"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:flex"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <img src={gallery[index]} alt="" className="max-h-[85vh] max-w-[92vw] object-contain" />

      <div className="absolute inset-x-0 bottom-4 mx-auto flex max-w-[92vw] gap-2 overflow-x-auto px-2">
        {gallery.map((g, i) => (
          <button
            key={i}
            onClick={() => onPickIndex(i)}
            className={cn(
              "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg transition",
              i === index ? "ring-2 ring-white" : "opacity-60 hover:opacity-100",
            )}
          >
            <img src={g} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
