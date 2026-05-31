"use client";

import type { ComponentType, ReactNode } from "react";
import { Shield } from "lucide-react";

export function StepHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div>
      <div className="text-xs font-bold tracking-wider text-sky-600 uppercase">{eyebrow}</div>
      <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base">{sub}</p>
    </div>
  );
}

export function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-muted-foreground mb-1.5 block text-xs font-bold tracking-wider uppercase">
        {label}
      </span>
      <div className="border-border bg-card shadow-soft flex items-center gap-2 rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500/30">
        <Icon className="text-muted-foreground h-4 w-4" />
        {children}
      </div>
    </label>
  );
}

export function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-border bg-card shadow-soft rounded-2xl border p-5">
      <div className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
        {title}
      </div>
      {children}
    </div>
  );
}

export function PrivacyNote() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-xs text-sky-900 dark:text-sky-200">
      <Shield className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <div className="font-semibold">Your documents are securely stored.</div>
        <div className="mt-0.5 opacity-80">
          We only use them to verify ownership. They are never shown publicly or shared with third
          parties.
        </div>
      </div>
    </div>
  );
}
