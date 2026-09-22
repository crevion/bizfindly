"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { POPULAR_AREAS } from "@/content/discoverFilters";
import { places } from "@/content/places";
import { useMarqueeCarousel } from "@/components/common/useMarqueeCarousel";

export function PopularAreas({ area, setArea }: { area: string; setArea: (s: string) => void }) {
  const {
    trackRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
    handleClickCapture,
    onDragStart,
    onPointerEnter,
    onPointerLeave,
    onFocusCapture,
    onBlurCapture,
  } = useMarqueeCarousel({ copies: 1, autoScrollSpeed: 0, measureCanonicalOverflow: false });

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-brand text-[11px] font-bold tracking-wider uppercase">
            Explore by area
          </p>
          <h2 className="font-display mt-1 text-xl font-bold md:text-2xl">Popular locations</h2>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden select-none">
        {/* Left & Right gradient edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent sm:w-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent sm:w-10" />

        <div
          ref={trackRef}
          role="region"
          aria-label="Popular locations carousel"
          className="no-scrollbar touch-pan-x cursor-grab active:cursor-grabbing overflow-x-auto overscroll-x-contain py-1"
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onScroll={handleScroll}
          onFocusCapture={onFocusCapture}
          onBlurCapture={onBlurCapture}
          onClickCapture={handleClickCapture}
          onDragStart={onDragStart}
          style={{
            scrollBehavior: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex gap-3 w-max pe-6">
            <button
              type="button"
              onClick={() => setArea("All")}
              className={cn(
                "group relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition cursor-pointer select-none",
                area === "All" ? "border-brand shadow-card scale-102" : "border-transparent shadow-soft",
              )}
            >
              <div className="from-brand to-brand/70 absolute inset-0 bg-gradient-to-br pointer-events-none" />
              <div className="text-brand-foreground relative flex h-full flex-col items-center justify-center pointer-events-none">
                <Sparkles className="h-5 w-5" />
                <span className="mt-1 text-xs font-bold">All areas</span>
              </div>
            </button>

            {POPULAR_AREAS.map((a, i) => {
              const cover = places.find((p) => p.area === a)?.image;
              const active = area === a;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className={cn(
                    "group relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition cursor-pointer select-none hover:-translate-y-0.5",
                    active ? "border-brand shadow-card scale-102" : "shadow-soft border-transparent",
                  )}
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt={a}
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110 pointer-events-none select-none"
                    />
                  ) : (
                    <div className="bg-muted absolute inset-0 pointer-events-none" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  <div className="relative flex h-full flex-col justify-end p-2.5 text-left text-white pointer-events-none">
                    <p className="text-[13px] leading-tight font-bold">{a}</p>
                    <p className="text-[10px] opacity-80">
                      {places.filter((p) => p.area === a).length} places
                    </p>
                  </div>
                  {i < 3 && (
                    <span className="bg-brand/90 text-brand-foreground absolute top-1.5 right-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow-sm pointer-events-none">
                      HOT
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
