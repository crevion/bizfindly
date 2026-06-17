"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BasicsStep } from "@/components/list-business/BasicsStep";
import { CategoryStep } from "@/components/list-business/CategoryStep";
import { DescriptionStep } from "@/components/list-business/DescriptionStep";
import { DetailsStep } from "@/components/list-business/DetailsStep";
import { FacilitiesStep } from "@/components/list-business/FacilitiesStep";
import { ImagesStep } from "@/components/list-business/ImagesStep";
import { PreviewStep } from "@/components/list-business/PreviewStep";
import { SuccessScreen } from "@/components/list-business/SuccessScreen";
import { TagsStep } from "@/components/list-business/TagsStep";
import { WizardChrome } from "@/components/list-business/WizardChrome";
import { useListingWizard } from "@/hooks/useListingWizard";
import { CATEGORIES } from "@/content/listingCategories";

export default function ListBusinessPage() {
  const router = useRouter();
  const {
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
  } = useListingWizard();

  useEffect(() => {
    if (authHydrated && hydrated && !user) {
      router.replace("/join?next=/list-business");
    }
  }, [authHydrated, hydrated, user, router]);

  if (!authHydrated || !hydrated || !user) {
    return <div className="bg-background flex min-h-screen items-center justify-center" />;
  }

  const cfg = draft.category ? CATEGORIES[draft.category] : null;

  if (publishState === "done" && published?.category) {
    return (
      <SuccessScreen
        draft={published}
        cfg={CATEGORIES[published.category]}
        listingId={publishedId}
      />
    );
  }

  return (
    <WizardChrome
      stepId={step.id}
      stepIdx={stepIdx}
      publishState={publishState}
      canContinue={canContinue}
      onBack={back}
      onNext={next}
      onPublish={publish}
    >
      {step.id === "category" && (
        <CategoryStep
          value={draft.category}
          onSelect={(c) => {
            updateDraft({ category: c });
            setTimeout(next, 250);
          }}
        />
      )}
      {step.id === "basics" && cfg && <BasicsStep cfg={cfg} draft={draft} update={updateDraft} />}
      {step.id === "details" && cfg && <DetailsStep cfg={cfg} draft={draft} update={updateDraft} />}
      {step.id === "facilities" && cfg && (
        <FacilitiesStep cfg={cfg} draft={draft} update={updateDraft} />
      )}
      {step.id === "tags" && cfg && <TagsStep cfg={cfg} draft={draft} update={updateDraft} />}
      {step.id === "images" && cfg && <ImagesStep cfg={cfg} draft={draft} update={updateDraft} />}
      {step.id === "description" && cfg && (
        <DescriptionStep cfg={cfg} draft={draft} update={updateDraft} />
      )}
      {step.id === "preview" && cfg && <PreviewStep cfg={cfg} draft={draft} />}

      {publishError && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive mt-6 rounded-2xl border p-4 text-sm">
          {publishError}
        </div>
      )}
    </WizardChrome>
  );
}
