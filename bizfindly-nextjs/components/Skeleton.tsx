import type { HTMLAttributes } from "react";

type SkeletonBlockProps = HTMLAttributes<HTMLDivElement>;

/** Opaque loading placeholder — avoids blue glow from animate-pulse on lavender backgrounds. */
export function SkeletonBlock({
  className = "",
  ...props
}: SkeletonBlockProps) {
  return (
    <div
      className={`skeleton-block ${className}`.trim()}
      aria-hidden="true"
      {...props}
    />
  );
}
