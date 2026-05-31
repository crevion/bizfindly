"use client";

import { useRouter } from "next/navigation";
import { Copy, Lock, Tag } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/backend/auth";

export function CouponCard({ placeName }: { placeName: string }) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText("BIZ10");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
    }
  };

  return (
    <div className="border-brand/40 from-brand/10 via-brand/5 relative mt-4 overflow-hidden rounded-3xl border border-dashed bg-gradient-to-br to-transparent p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-brand inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
          <Tag className="h-4 w-4" /> BizFindly offer
        </div>
        <span className="bg-brand text-brand-foreground rounded-full px-2.5 py-1 text-[10px] font-bold uppercase">
          10% OFF
        </span>
      </div>
      <div className="font-display mt-2 text-lg font-bold">10% off your first visit</div>
      <p className="text-muted-foreground mt-1 text-xs">
        Valid until 31 Dec · One use per customer at {placeName}.
      </p>

      {user ? (
        <div className="border-brand/50 bg-background mt-4 flex items-center justify-between gap-2 rounded-2xl border border-dashed px-4 py-3">
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Your code
            </p>
            <p className="text-foreground font-mono text-lg font-bold tracking-[0.2em]">BIZ10</p>
          </div>
          <button
            onClick={copyCoupon}
            className="bg-foreground text-background inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition hover:opacity-90"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => router.push("/list-business")}
          className="group border-border bg-card hover:border-foreground/30 relative mt-4 flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left transition"
        >
          <div className="flex-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Your code
            </p>
            <p className="text-foreground font-mono text-lg font-bold tracking-[0.2em] blur-[6px] transition select-none group-hover:blur-[5px]">
              BIZ10
            </p>
          </div>
          <span className="gradient-brand text-brand-foreground shadow-glow inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold">
            <Lock className="h-3.5 w-3.5" />
            Login to reveal
          </span>
        </button>
      )}
    </div>
  );
}
