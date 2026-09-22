"use client";

import React, { Children } from "react";
import {
  disableMarqueeDuplicateTabStops,
  useMarqueeCarousel,
} from "./useMarqueeCarousel";
import { cn } from "@/lib/utils";

interface SmoothInfiniteSliderProps {
  children: React.ReactNode;
  speed?: number; // Pixels per second (or fractional multiplier)
  copies?: number;
  className?: string;
  gapClassName?: string;
  gradientEdges?: boolean;
}

export function SmoothInfiniteSlider({
  children,
  speed = 40,
  copies = 4,
  className,
  gapClassName = "gap-4 pe-4",
  gradientEdges = true,
}: SmoothInfiniteSliderProps) {
  // Normalize speed: If someone passes small speed like 0.75, scale to ~40 px/s
  const normalizedSpeed = speed <= 5 ? speed * 50 : speed;

  const {
    trackRef,
    isScrollable,
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
  } = useMarqueeCarousel({
    copies,
    autoScrollSpeed: normalizedSpeed,
    measureCanonicalOverflow: true,
  });

  const childrenArray = Children.toArray(children);
  if (childrenArray.length === 0) return null;

  return (
    <div className={cn("relative w-full overflow-hidden select-none", className)}>
      {/* Subtle edge fades if scrollable */}
      {gradientEdges && isScrollable && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16" />
        </>
      )}

      <div
        ref={trackRef}
        role="region"
        aria-label="Carousel"
        className={cn(
          "no-scrollbar touch-auto py-2 -mx-4 px-4 md:mx-0 md:px-0",
          isScrollable
            ? "cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing"
            : "overflow-x-hidden",
        )}
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
        <div className="flex w-max">
          {Array.from({ length: isScrollable ? copies : 1 }, (_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex > 0 ? disableMarqueeDuplicateTabStops : undefined}
              className={cn("flex shrink-0", gapClassName)}
              aria-hidden={copyIndex > 0 || undefined}
              onMouseDownCapture={
                copyIndex > 0
                  ? (e) => {
                      e.preventDefault();
                    }
                  : undefined
              }
            >
              {children}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
