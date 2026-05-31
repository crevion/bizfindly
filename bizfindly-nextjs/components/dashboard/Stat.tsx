"use client";

import type { ComponentType } from "react";

export function Stat({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="p-4 text-center">
      <Icon className="text-muted-foreground mx-auto h-4 w-4" />
      <div className="font-display mt-1 text-xl font-bold">{value}</div>
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="text-brand mt-1 text-[10px] font-semibold">{trend}</div>
    </div>
  );
}
