"use client";

import { useEffect, useState } from "react";

export function useLightbox(galleryLength: number) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? 0 : (i + 1) % galleryLength));
      if (e.key === "ArrowLeft")
        setIndex((i) => (i === null ? 0 : (i - 1 + galleryLength) % galleryLength));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, galleryLength]);

  return {
    index,
    open: (i: number) => setIndex(i),
    close: () => setIndex(null),
    next: () => setIndex((i) => (i === null ? 0 : (i + 1) % galleryLength)),
    prev: () => setIndex((i) => (i === null ? 0 : (i - 1 + galleryLength) % galleryLength)),
  };
}
