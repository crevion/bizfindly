"use client";

import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";

export function SuccessScreen({
  claimId,
  businessName,
}: {
  claimId: string;
  businessName: string;
}) {
  return (
    <div className="bg-background fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="border-border bg-card shadow-card w-full max-w-lg rounded-3xl border p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-[0_12px_40px_rgba(37,99,235,0.45)]">
          <ShieldCheck className="h-10 w-10 text-white" />
        </div>
        <h1 className="font-display mt-6 text-3xl font-extrabold">Verification submitted</h1>
        <p className="text-muted-foreground mt-2">
          Your verification request for{" "}
          <span className="text-foreground font-semibold">{businessName}</span> has been submitted.
          Our team will review your documents shortly.
        </p>
        <div className="mt-6 flex justify-center">
          <VerifiedBadge status="pending" size="lg" />
        </div>
        <div className="text-muted-foreground mt-3 text-xs">Estimated review time: 24–48 hours</div>
        <div className="text-muted-foreground mt-3 text-[11px]">Reference ID: {claimId}</div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Link
            href="/dashboard"
            className="bg-foreground text-background rounded-full px-5 py-3 text-sm font-semibold"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="border-border bg-surface rounded-full border px-5 py-3 text-sm font-semibold"
          >
            Back to home <ChevronRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
