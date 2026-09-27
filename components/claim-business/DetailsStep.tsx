"use client";

import { MessageSquare, Phone, User } from "lucide-react";
import { Field, PrivacyNote, StepHeader } from "./primitives";
import type { ClaimDetails } from "@/types/verification";

export function DetailsStep({
  details,
  setDetails,
}: {
  details: ClaimDetails;
  setDetails: (d: ClaimDetails) => void;
}) {
  const set = <K extends keyof ClaimDetails>(k: K, v: ClaimDetails[K]) =>
    setDetails({ ...details, [k]: v });

  return (
    <div>
      <StepHeader
        eyebrow="Step 2 · Owner details"
        title="Tell us about you"
        sub="We use this to verify your role and contact you about the verification."
      />
      <div className="mt-6 grid gap-4">
        <Field icon={User} label="Full name">
          <input
            value={details.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="e.g. Rahim Ahmed"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={Phone} label="Phone number">
          <input
            value={details.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+880 1700 000000"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={MessageSquare} label="Message to our review team (optional)">
          <input
            value={details.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Anything that helps us verify you faster"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
      </div>

      <PrivacyNote />
    </div>
  );
}
