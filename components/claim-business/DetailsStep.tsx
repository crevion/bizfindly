"use client";

import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { CLAIM_ROLES } from "@/content/verificationConfig";
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
        <Field icon={User} label="Owner full name">
          <input
            value={details.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Rahim Ahmed"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={Building2} label="Business role">
          <select
            value={details.role}
            onChange={(e) => set("role", e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            {CLAIM_ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field icon={Phone} label="Phone number">
            <input
              value={details.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+880 1700 000000"
              className="w-full bg-transparent text-sm outline-none"
            />
          </Field>
          <Field icon={Mail} label="Official business email">
            <input
              value={details.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="owner@business.com"
              className="w-full bg-transparent text-sm outline-none"
            />
          </Field>
        </div>
        <Field icon={MapPin} label="Business address">
          <input
            value={details.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Road 12, Banani, Dhaka"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
      </div>

      <PrivacyNote />
    </div>
  );
}
