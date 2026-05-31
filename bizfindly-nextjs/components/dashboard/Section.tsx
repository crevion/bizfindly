"use client";

import type { ComponentType, ReactNode } from "react";

export function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="border-border bg-card shadow-card rounded-3xl border p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="text-brand h-4 w-4" />}
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
