"use client";

import { useRouter } from "next/navigation";
import { Copy, Lock, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/backend/auth";
import type { Place } from "@/types/place";

export function CouponCard({
  place,
}: {
  place: Pick<Place, "name" | "slug" | "offerCode" | "offerDescription">;
}) {
  const { user, hydrated } = useAuthStore();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const code = place.offerCode?.trim();
  const description = place.offerDescription?.trim();

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  if (!code && !description) return null;

  const copyCoupon = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy the coupon. Please select and copy the code manually.");
    }
  };

  return (
    <div className="border-brand/40 from-brand/10 via-brand/5 relative mt-4 overflow-hidden rounded-3xl border border-dashed bg-gradient-to-br to-transparent p-5">
      <div className="text-brand inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
        <Tag className="h-4 w-4" /> BizFindly offer
      </div>
      <div className="font-display mt-2 text-lg font-bold whitespace-pre-wrap">
        {description || `Special offer at ${place.name}`}
      </div>
      {code &&
        (hydrated && user ? (
          <div className="border-brand/50 bg-background mt-4 flex items-center justify-between gap-2 rounded-2xl border border-dashed px-4 py-3">
            <div className="min-w-0">
              <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Your code
              </p>
              <p className="text-foreground font-mono text-lg font-bold tracking-[0.2em] break-all">
                {code}
              </p>
            </div>
            <button
              onClick={copyCoupon}
              className="bg-foreground text-background inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition hover:opacity-90"
            >
              <Copy className="h-3.5 w-3.5" />
              <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        ) : (
          <button
            disabled={!hydrated}
            onClick={() => router.push(`/join?next=${encodeURIComponent(`/place/${place.slug}`)}`)}
            className="group border-border bg-card hover:border-foreground/30 mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition disabled:opacity-50"
          >
            <div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Your code
              </p>
              <p
                aria-hidden="true"
                className="text-foreground font-mono text-lg font-bold tracking-[0.2em]"
              >
                ••••••
              </p>
            </div>
            <span className="gradient-brand text-brand-foreground shadow-glow inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold">
              <Lock className="h-3.5 w-3.5" /> Login to reveal
            </span>
          </button>
        ))}
    </div>
  );
}
