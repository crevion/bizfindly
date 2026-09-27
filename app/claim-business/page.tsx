"use client";

import { Suspense } from "react";
import { AuthGate } from "@/components/auth/AuthGate";
import { ClaimWizardChrome } from "@/components/claim-business/ClaimWizardChrome";
import { DetailsStep } from "@/components/claim-business/DetailsStep";
import { DocumentsStep } from "@/components/claim-business/DocumentsStep";
import { FindStep } from "@/components/claim-business/FindStep";
import { ReviewStep } from "@/components/claim-business/ReviewStep";
import { SuccessScreen } from "@/components/claim-business/SuccessScreen";
import { useClaimWizard } from "@/hooks/useClaimWizard";

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-screen" />}>
      <ClaimPageContent />
    </Suspense>
  );
}

function ClaimPageContent() {
  const c = useClaimWizard();

  if (!c.hydrated) return <div className="bg-background min-h-screen" />;
  if (!c.user) {
    return (
      <AuthGate
        title="Sign in to claim your business"
        subtitle="Verify ownership securely with your mobile number."
      />
    );
  }
  if (c.resolvingPreset) return <div className="bg-background min-h-screen" />;
  if (c.doneId) {
    return (
      <SuccessScreen claimId={c.doneId} businessName={c.selected?.name || c.details.fullName} />
    );
  }

  return (
    <ClaimWizardChrome
      stepId={c.step?.id}
      stepIdx={c.stepIdx}
      canContinue={c.canContinue}
      submitting={c.submitting}
      submitError={c.submitError}
      onBack={c.back}
      onNext={c.next}
      onSubmit={c.submit}
    >
      {c.step?.id === "find" && (
        <FindStep
          query={c.query}
          setQuery={c.setQuery}
          results={c.results}
          searching={c.searching}
          selected={c.selected}
          setSelected={c.pickBusiness}
        />
      )}
      {c.step?.id === "details" && <DetailsStep details={c.details} setDetails={c.setDetails} />}
      {c.step?.id === "documents" && (
        <DocumentsStep document={c.document} setDocument={c.setDocument} />
      )}
      {c.step?.id === "review" && (
        <ReviewStep selected={c.selected} details={c.details} document={c.document} />
      )}
    </ClaimWizardChrome>
  );
}
