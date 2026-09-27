"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/backend/auth";
import { dashboardApi } from "@/lib/backend/owner/dashboard";
import type { Place } from "@/types/place";
import { BadgeCheck, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import type { VerificationStatus } from "@/types/verification";

export function OwnerStatusBanner({
  status,
  place,
}: {
  status: VerificationStatus;
  place: Pick<Place, "category" | "slug">;
}) {
  const { user, token, hydrated } = useAuthStore();
  const ownership = useQuery({
    queryKey: ["listing-ownership", token, place.category, place.slug],
    queryFn: () => dashboardApi.isMine(place),
    enabled: hydrated && !!user && !!token && status !== "verified" && status !== "pending",
    retry: false,
  });
  if (status === "verified") {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-blue-600/5 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="text-sm font-bold">Claimed by Owner · Actively managed</div>
          <div className="text-muted-foreground text-xs">
            <MessageSquare className="mr-1 inline h-3 w-3" /> Responds within ~2 hours · 98%
            response rate
          </div>
        </div>
        <VerifiedBadge status="verified" size="sm" />
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-500/10">
        <Clock className="h-5 w-5 text-amber-600" />
        <div className="text-sm">
          <span className="font-semibold">Verification in progress.</span>{" "}
          <span className="text-muted-foreground">
            An owner has submitted documents for review.
          </span>
        </div>
      </div>
    );
  }

  // Do not flash the claim prompt while ownership is still being resolved.
  if (!hydrated || (user && token && ownership.data !== false)) return null;

  return (
    <Link
      href={`/claim-business?category=${place.category}&slug=${encodeURIComponent(place.slug)}`}
      className="border-border bg-surface hover:border-foreground/30 mt-6 flex items-center gap-3 rounded-2xl border border-dashed p-4 transition"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
        <BadgeCheck className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="text-sm font-bold">Own this business?</div>
        <div className="text-muted-foreground text-xs">
          Claim it to manage your listing, respond to reviews and unlock the verified badge.
        </div>
      </div>
      <span className="bg-foreground text-background rounded-full px-4 py-2 text-xs font-semibold">
        Claim now
      </span>
    </Link>
  );
}
