"use client";

import type { ComponentType, ReactNode } from "react";
import { FileText } from "lucide-react";
import type { ClaimDocument } from "@/types/verification";

export function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border-border bg-surface rounded-2xl border p-3">
      <div className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm">
        <Icon className="text-muted-foreground h-4 w-4" />
        <span>{value}</span>
      </div>
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="border-border bg-surface rounded-full border px-3 py-1 font-semibold">
      {children}
    </span>
  );
}

export function DocumentsList({ documents }: { documents: ClaimDocument[] }) {
  return (
    <div className="grid gap-2">
      {documents.map((d) => (
        <div
          key={d.key}
          className="border-border bg-surface flex items-center gap-3 rounded-2xl border p-3"
        >
          <div className="bg-muted h-12 w-12 overflow-hidden rounded-xl">
            {d.preview ? (
              <img src={d.preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{d.label}</div>
            <div className="text-muted-foreground truncate text-xs">
              {d.name} · {(d.size / 1024).toFixed(0)} KB
            </div>
          </div>
        </div>
      ))}
      {documents.length === 0 && (
        <div className="border-border text-muted-foreground rounded-2xl border border-dashed p-4 text-sm">
          No documents uploaded.
        </div>
      )}
    </div>
  );
}
