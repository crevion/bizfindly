"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/backend/auth";
import { useListingStore } from "@/store/useListingStore";
import { useVerificationStore } from "@/store/useVerificationStore";
import { LISTING_STEPS } from "@/content/listingSteps";
import type { ListingDraft, ListingStepId } from "@/types/listing";

type PublishState = "idle" | "publishing" | "done" | "error";

export function useListingWizard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const draft = useListingStore((s) => s.draft);
  const updateDraft = useListingStore((s) => s.updateDraft);
  const stepIdx = useListingStore((s) => s.stepIdx);
  const setStepIdx = useListingStore((s) => s.setStepIdx);
  const hydrated = useListingStore((s) => s.hydrated);
  const publishListing = useListingStore((s) => s.publishListing);
  const submitClaim = useVerificationStore((s) => s.submitClaim);

  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [published, setPublished] = useState<ListingDraft | null>(null);

  const step: { id: ListingStepId; label: string } =
    LISTING_STEPS[stepIdx] ?? LISTING_STEPS[LISTING_STEPS.length - 1];

  const next = () => setStepIdx(Math.min(LISTING_STEPS.length - 1, stepIdx + 1));
  const back = () => {
    if (stepIdx === 0) router.push("/");
    else setStepIdx(stepIdx - 1);
  };

  const canContinue = (() => {
    switch (step.id) {
      case "category":
        return !!draft.category;
      case "basics":
        return draft.name.trim().length > 1 && draft.location.trim().length > 1;
      case "details":
        return (
          draft.priceMin.trim().length > 0 &&
          draft.priceMax.trim().length > 0 &&
          draft.hours.trim().length > 0
        );
      case "facilities":
      case "tags":
        return true;
      case "images":
        return Object.values(draft.images).some((arr) => arr && arr.length > 0);
      case "description":
        return draft.description.trim().length > 10;
      default:
        return true;
    }
  })();

  const publish = async () => {
    if (publishState === "publishing") return;
    setPublishState("publishing");
    setPublishError(null);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const final = publishListing();
      setPublished(final);
      if (user && final.id) {
        try {
          submitClaim({
            placeId: final.id,
            placeName: final.name,
            ownerId: user.id,
            ownerName: user.name,
            ownerEmail: user.email || "",
            ownerPhone: user.phone || "",
            ownerRole: "Owner",
            businessAddress: final.location,
            documents: [],
            social: {},
          });
        } catch {
        }
      }
      setPublishedId(final.id ?? null);
      setPublishState("done");
    } catch (e) {
      console.error("publish failed", e);
      setPublishError("Something went wrong while submitting your listing. Please try again.");
      setPublishState("error");
    }
  };

  return {
    user,
    authHydrated,
    hydrated,
    draft,
    updateDraft,
    stepIdx,
    step,
    next,
    back,
    canContinue,
    publish,
    publishState,
    publishedId,
    publishError,
    published,
  };
}
