"use client";

import { useEffect, useRef, useState } from "react";

const AUTO_SCROLL_SPEED = 40;
const DRAG_THRESHOLD = 5;

export function disableMarqueeDuplicateTabStops(node: HTMLDivElement | null) {
  if (!node) return;
  node
    .querySelectorAll<HTMLElement>(
      "a, button, input, select, textarea, [tabindex]",
    )
    .forEach((element) => {
      element.tabIndex = -1;
    });
}

function normalizePosition(position: number, stepWidth: number) {
  if (stepWidth <= 0) return position;
  return ((position % stepWidth) + stepWidth) % stepWidth;
}

function carouselStepWidth(el: HTMLDivElement, copies: number) {
  if (copies <= 1) return el.scrollWidth;
  const rail = el.firstElementChild;
  const firstCopy = rail?.children[0] as HTMLElement | undefined;
  const secondCopy = rail?.children[1] as HTMLElement | undefined;
  if (firstCopy && secondCopy) {
    const diff = Math.abs(secondCopy.offsetLeft - firstCopy.offsetLeft);
    if (diff > 0) return diff;
  }
  return el.scrollWidth / Math.max(1, copies);
}

function resolvePosition(el: HTMLDivElement, position: number, copies: number) {
  if (copies <= 1) {
    return Math.min(
      Math.max(0, el.scrollWidth - el.clientWidth),
      Math.max(0, position),
    );
  }
  const stepWidth = carouselStepWidth(el, copies);
  if (el.scrollWidth - el.clientWidth >= stepWidth) {
    return normalizePosition(position, stepWidth);
  }
  return Math.min(
    Math.max(0, el.scrollWidth - el.clientWidth),
    Math.max(0, position),
  );
}

function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }
  }, []);
  return reduceMotion;
}

export function useMarqueeCarousel({
  copies = 4,
  autoScrollSpeed = AUTO_SCROLL_SPEED,
  measureCanonicalOverflow = true,
}: {
  copies?: number;
  autoScrollSpeed?: number;
  measureCanonicalOverflow?: boolean;
} = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    lastX: number;
    lastAt: number;
    velocity: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const autoScrollFrameRef = useRef(0);
  const momentumFrameRef = useRef(0);
  const nativeTouchRef = useRef(false);
  const touchContactRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchResumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [nativeTouching, setNativeTouching] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const reduceMotion = useReducedMotion();
  const autoScroll =
    autoScrollSpeed > 0 &&
    isScrollable &&
    !reduceMotion &&
    !hovering &&
    !focusWithin &&
    !dragging &&
    !settling &&
    !nativeTouching;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rail = el.firstElementChild as HTMLElement | null;
      const firstCopy = rail?.firstElementChild as HTMLElement | null;
      const style = window.getComputedStyle(el);
      const viewportWidth =
        el.clientWidth -
        (Number.parseFloat(style.paddingLeft) || 0) -
        (Number.parseFloat(style.paddingRight) || 0);
      const contentWidth =
        measureCanonicalOverflow && copies > 1
          ? (firstCopy?.scrollWidth ?? el.scrollWidth)
          : el.scrollWidth;
      const canScroll = contentWidth - viewportWidth > 1;
      setIsScrollable(canScroll);
      if (!canScroll) {
        setDragging(false);
        setSettling(false);
        setNativeTouching(false);
      }
    };
    const scheduleMeasure = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    scheduleMeasure();
    const observer = new ResizeObserver(scheduleMeasure);
    const rail = el.firstElementChild;
    const measuredContent =
      measureCanonicalOverflow && copies > 1 ? rail?.firstElementChild : rail;
    observer.observe(el);
    if (measuredContent) observer.observe(measuredContent);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measureCanonicalOverflow, copies]);

  useEffect(() => {
    if (isScrollable) return;
    const el = trackRef.current;
    cancelAnimationFrame(autoScrollFrameRef.current);
    cancelAnimationFrame(momentumFrameRef.current);
    dragState.current = null;
    suppressClickRef.current = false;
    if (el && autoScrollSpeed > 0) el.scrollLeft = 0;
  }, [isScrollable, autoScrollSpeed]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !autoScroll) return;
    let last = performance.now();
    let position = el.scrollLeft;
    const step = (now: number) => {
      const stepWidth = carouselStepWidth(el, copies);
      if (el.scrollWidth - el.clientWidth >= stepWidth) {
        const elapsed = Math.min(0.05, (now - last) / 1000);
        position = normalizePosition(
          position + autoScrollSpeed * elapsed,
          stepWidth,
        );
        el.scrollLeft = position;
      }
      last = now;
      autoScrollFrameRef.current = requestAnimationFrame(step);
    };
    autoScrollFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(autoScrollFrameRef.current);
  }, [autoScroll, autoScrollSpeed, copies]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType === "touch" ||
      !event.isPrimary ||
      event.button !== 0
    ) {
      return;
    }
    const el = trackRef.current;
    if (!el) return;
    suppressClickRef.current = false;
    const now = performance.now();
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: el.scrollLeft,
      lastX: event.clientX,
      lastAt: now,
      velocity: 0,
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    const el = trackRef.current;
    if (!drag || !el || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      drag.moved = true;
      suppressClickRef.current = true;
      cancelAnimationFrame(autoScrollFrameRef.current);
      cancelAnimationFrame(momentumFrameRef.current);
      setSettling(false);
      setDragging(true);
      try {
        el.setPointerCapture(event.pointerId);
      } catch {}
    }
    if (!drag.moved) return;
    event.preventDefault();
    const now = performance.now();
    const elapsed = Math.max(1, now - drag.lastAt);
    drag.velocity = -(event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastAt = now;
    el.scrollLeft = resolvePosition(el, drag.startScroll - dx, copies);
  };

  const finishDrag = (
    event: React.PointerEvent<HTMLDivElement>,
    withMomentum: boolean,
  ) => {
    const drag = dragState.current;
    const el = trackRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const hadMoved = drag.moved;
    dragState.current = null;
    setDragging(false);
    if (el?.hasPointerCapture(event.pointerId)) {
      try {
        el.releasePointerCapture(event.pointerId);
      } catch {}
    }
    if (!withMomentum || !hadMoved || !el || reduceMotion) return;

    let position = el.scrollLeft;
    let velocity = drag.velocity * 1000;
    let previous = performance.now();
    setSettling(true);

    const settle = (now: number) => {
      const elapsed = Math.min(0.032, (now - previous) / 1000);
      previous = now;
      position += velocity * elapsed;
      velocity *= Math.pow(0.92, elapsed * 60);
      el.scrollLeft = resolvePosition(el, position, copies);
      if (Math.abs(velocity) < 5) {
        setSettling(false);
        return;
      }
      momentumFrameRef.current = requestAnimationFrame(settle);
    };

    momentumFrameRef.current = requestAnimationFrame(settle);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) =>
    finishDrag(event, true);
  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) =>
    finishDrag(event, false);

  const scheduleNativeTouchResume = () => {
    if (touchResumeTimeoutRef.current) {
      clearTimeout(touchResumeTimeoutRef.current);
    }
    touchResumeTimeoutRef.current = setTimeout(() => {
      nativeTouchRef.current = false;
      setNativeTouching(false);
    }, 180);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchResumeTimeoutRef.current) {
      clearTimeout(touchResumeTimeoutRef.current);
    }
    cancelAnimationFrame(autoScrollFrameRef.current);
    nativeTouchRef.current = true;
    touchContactRef.current = true;
    touchStartXRef.current = event.touches[0]?.clientX ?? 0;
    suppressClickRef.current = false;
    setNativeTouching(true);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (
      touch &&
      Math.abs(touch.clientX - touchStartXRef.current) > DRAG_THRESHOLD
    ) {
      suppressClickRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    touchContactRef.current = false;
    scheduleNativeTouchResume();
  };

  const handleScroll = () => {
    if (nativeTouchRef.current && !touchContactRef.current) {
      scheduleNativeTouchResume();
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  useEffect(
    () => () => {
      cancelAnimationFrame(autoScrollFrameRef.current);
      cancelAnimationFrame(momentumFrameRef.current);
      if (touchResumeTimeoutRef.current) {
        clearTimeout(touchResumeTimeoutRef.current);
      }
    },
    [],
  );

  return {
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
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    onPointerEnter: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") setHovering(true);
    },
    onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") setHovering(false);
    },
    onFocusCapture: (event: React.FocusEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).matches?.(":focus-visible")) {
        setFocusWithin(true);
      }
    },
    onBlurCapture: (event: React.FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setFocusWithin(false);
      }
    },
  };
}
