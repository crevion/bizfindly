"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-foreground mb-1.5 text-sm font-semibold">{label}</div>
      {children}
      {hint && <div className="text-muted-foreground mt-1 text-xs">{hint}</div>}
    </label>
  );
}

export function PriceInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base font-semibold">
        ৳
      </span>
      <input
        aria-label={ariaLabel}
        inputMode="numeric"
        className={cn(inputCls, "pl-9")}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
      />
    </div>
  );
}

export function StepHeader({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-8">
      <div className="text-brand text-xs font-semibold tracking-wider uppercase">{kicker}</div>
      <h1 className="font-display mt-2 text-3xl leading-tight font-bold tracking-tight md:text-4xl">
        {title}
      </h1>
      {sub && <p className="text-muted-foreground mt-2 text-sm md:text-base">{sub}</p>}
    </div>
  );
}
