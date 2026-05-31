"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { ClaimWizardChrome } from "@/components/claim-business/ClaimWizardChrome";
import { DetailsStep } from "@/components/claim-business/DetailsStep";
import { DocumentsStep } from "@/components/claim-business/DocumentsStep";
import { FindStep } from "@/components/claim-business/FindStep";
import { ReviewStep } from "@/components/claim-business/ReviewStep";
import { SocialStep } from "@/components/claim-business/SocialStep";
import { SuccessScreen } from "@/components/claim-business/SuccessScreen";
import { useClaimWizard } from "@/hooks/useClaimWizard";

export default function ClaimPage() {
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
  if (c.doneId) {
    return <SuccessScreen claimId={c.doneId} businessName={c.selected?.name || c.details.name} />;
  }

  return (
    <ClaimWizardChrome
      stepId={c.step?.id}
      stepIdx={c.stepIdx}
      canContinue={c.canContinue}
      submitting={c.submitting}
      onBack={c.back}
      onNext={c.next}
      onSubmit={c.submit}
    >
      {c.step?.id === "find" && (
        <FindStep
          query={c.query}
          setQuery={c.setQuery}
          results={c.results}
          selected={c.selected}
          setSelected={c.pickBusiness}
          creatingNew={c.creatingNew}
          onCreateNew={c.startNewListing}
        />
      )}
      {c.step?.id === "details" && <DetailsStep details={c.details} setDetails={c.setDetails} />}
      {c.step?.id === "documents" && <DocumentsStep docs={c.docs} setDocs={c.setDocs} />}
      {c.step?.id === "social" && <SocialStep social={c.social} setSocial={c.setSocial} />}
      {c.step?.id === "review" && (
        <ReviewStep
          selected={c.selected}
          creatingNew={c.creatingNew}
          details={c.details}
          docs={c.docs}
          social={c.social}
        />
      )}
    </ClaimWizardChrome>
  );
}
