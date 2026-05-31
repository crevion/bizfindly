"use client";

import { BadgeCheck, Globe, Sparkles } from "lucide-react";
import { Field, StepHeader } from "./primitives";
import type { ClaimSocialState } from "@/types/verification";

export function SocialStep({
  social,
  setSocial,
}: {
  social: ClaimSocialState;
  setSocial: (s: ClaimSocialState) => void;
}) {
  const set = <K extends keyof ClaimSocialState>(k: K, v: string) =>
    setSocial({ ...social, [k]: v });

  return (
    <div>
      <StepHeader
        eyebrow="Step 4 · Social proof (optional)"
        title="Boost your trust score"
        sub="Linking your social profiles helps reviewers verify faster."
      />
      <div className="mt-6 grid gap-4">
        <Field icon={Globe} label="Website">
          <input
            value={social.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://yourbusiness.com"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={Sparkles} label="Facebook page">
          <input
            value={social.facebook}
            onChange={(e) => set("facebook", e.target.value)}
            placeholder="facebook.com/yourbusiness"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={Sparkles} label="Instagram">
          <input
            value={social.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="@yourbusiness"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={BadgeCheck} label="Google Business profile">
          <input
            value={social.googleBusiness}
            onChange={(e) => set("googleBusiness", e.target.value)}
            placeholder="Google Maps URL"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
      </div>
    </div>
  );
}
