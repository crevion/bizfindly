"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/backend/auth";
import { ApiError } from "@/lib/backend/api";
import { createListingFromDraft } from "@/lib/backend/places/createListing";
import { uploadListingMedia } from "@/lib/backend/places/listingMedia";
import { useListingMediaStore } from "@/store/useListingMediaStore";
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
  const cover = useListingMediaStore((s) => s.cover);
  const gallery = useListingMediaStore((s) => s.gallery);
  const detachMedia = useListingMediaStore((s) => s.detach);

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
      let slug: string | undefined;
      if (draft.category === "restaurant" || draft.category === "resort") {
        const created = await createListingFromDraft(draft);
        slug = created?.slug;
        // Photos go up after the listing exists: the cover fills the single
        // cover_photo field and each gallery photo is its own upload.
        if (slug && (cover || gallery.length)) {
          const media = await uploadListingMedia(draft.category, slug, {
            cover: cover?.file ?? null,
            gallery: gallery.map((image) => image.file),
          });
          if (media.failures.length) {
            toast.error(
              `Your listing is live, but ${media.failures.length} photo(s) failed to upload. ` +
                "You can add them again from your dashboard.",
            );
          }
        }
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }

      const final = publishListing();
      detachMedia();
      setPublished({ ...final, slug: slug ?? final.slug });
      if (user && final.id) {
        try {
          submitClaim({
            placeId: slug ?? final.id,
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
        } catch {}
      }
      setPublishedId(slug ?? final.id ?? null);
      setPublishState("done");
    } catch (e) {
      console.error("publish failed", e);
      setPublishError(
        e instanceof ApiError
          ? e.message
          : "Something went wrong while submitting your listing. Please try again.",
      );
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
