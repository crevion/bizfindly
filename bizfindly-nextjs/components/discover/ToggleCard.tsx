"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ToggleCard({
  label,
  icon,
  on,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
        on ? "border-brand bg-brand-soft text-foreground" : "border-border bg-card hover:bg-muted",
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition",
          on ? "bg-brand" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            on ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}
