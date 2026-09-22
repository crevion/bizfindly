"use client";

import { BadgeCheck, Check, Mail, MapPin, Phone, ShieldX, User, X } from "lucide-react";
import { useState } from "react";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { useVerificationStore } from "@/store/useVerificationStore";
import type { ClaimRecord, VerificationStatus } from "@/types/verification";
import { DetailRow, DocumentsList, Pill } from "./ClaimDetailParts";

export function ClaimDetail({ active }: { active: ClaimRecord }) {
  const updateClaimStatus = useVerificationStore((s) => s.updateClaimStatus);
  const [note, setNote] = useState("");

  const apply = (status: VerificationStatus) => {
    updateClaimStatus(active.id, status, note || undefined);
    setNote("");
  };

  return (
    <div className="border-border bg-card shadow-card rounded-3xl border p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            {active.placeSlug ? "Existing listing" : "New listing"}
          </div>
          <h2 className="font-display mt-1 text-2xl font-bold">{active.placeName}</h2>
        </div>
        <VerifiedBadge status={active.status} size="lg" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <DetailRow icon={User} label="Owner" value={`${active.ownerName} · ${active.ownerRole}`} />
        <DetailRow icon={Mail} label="Email" value={active.ownerEmail} />
        <DetailRow icon={Phone} label="Phone" value={active.ownerPhone} />
        <DetailRow icon={MapPin} label="Address" value={active.businessAddress} />
      </div>

      <div className="mt-6">
        <div className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
          Documents
        </div>
        <DocumentsList documents={active.documents} />
      </div>

      {(active.social.facebook ||
        active.social.instagram ||
        active.social.website ||
        active.social.googleBusiness) && (
        <div className="mt-6">
          <div className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
            Social proof
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {active.social.website && <Pill>{active.social.website}</Pill>}
            {active.social.facebook && <Pill>FB · {active.social.facebook}</Pill>}
            {active.social.instagram && <Pill>IG · {active.social.instagram}</Pill>}
            {active.social.googleBusiness && <Pill>Google Business</Pill>}
          </div>
        </div>
      )}

      {active.reviewerNote && (
        <div className="bg-muted mt-6 rounded-2xl p-4 text-sm">
          <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Last review note
          </div>
          <div className="mt-1">{active.reviewerNote}</div>
        </div>
      )}

      <div className="border-border mt-6 border-t pt-5">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional reviewer note (sent with decision)…"
          className="border-border bg-surface min-h-[80px] w-full rounded-2xl border p-3 text-sm outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => apply("verified")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
          >
            <BadgeCheck className="h-4 w-4" /> Approve & verify
          </button>
          <button
            onClick={() => apply("pending")}
            className="border-border bg-surface inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold"
          >
            <Check className="h-4 w-4" /> Request more info
          </button>
          <button
            onClick={() => apply("rejected")}
            className="border-destructive/40 bg-destructive/10 text-destructive inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold"
          >
            <X className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={() => apply("rejected")}
            className="text-muted-foreground hover:text-destructive inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            <ShieldX className="h-4 w-4" /> Revoke badge
          </button>
        </div>
      </div>
    </div>
  );
}
