"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/backend/auth";
import { useVerificationStore } from "@/store/useVerificationStore";
import { searchBusinesses } from "@/lib/verification";
import { DOC_TYPES } from "@/content/verificationConfig";
import type {
  ClaimDetails,
  ClaimDocsState,
  ClaimSocialState,
  SearchableBusiness,
} from "@/types/verification";
import { CLAIM_STEPS } from "@/content/claimSteps";

export function useClaimWizard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const submitClaim = useVerificationStore((s) => s.submitClaim);

  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState<SearchableBusiness | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchableBusiness[]>([]);
  const [details, setDetails] = useState<ClaimDetails>({
    name: user?.name || "",
    role: "Owner",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
  });
  const [docs, setDocs] = useState<ClaimDocsState>({});
  const [social, setSocial] = useState<ClaimSocialState>({
    facebook: "",
    instagram: "",
    website: "",
    googleBusiness: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);

  useEffect(() => {
    setResults(searchBusinesses(query));
  }, [query]);

  const step = CLAIM_STEPS[stepIdx];

  const canContinue = (() => {
    switch (step?.id) {
      case "find":
        return !!selected || creatingNew;
      case "details":
        return (
          details.name.trim().length > 1 &&
          details.phone.trim().length > 4 &&
          details.email.includes("@") &&
          details.address.trim().length > 3
        );
      case "documents":
        return DOC_TYPES.filter((d) => d.required).every((d) => !!docs[d.key]);
      case "social":
      case "review":
        return true;
      default:
        return false;
    }
  })();

  const next = () => setStepIdx((i) => Math.min(CLAIM_STEPS.length - 1, i + 1));
  const back = () => {
    if (stepIdx === 0) router.push("/");
    else setStepIdx((i) => i - 1);
  };

  const submit = async () => {
    if (submitting || !user) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    const placeId = selected?.id || `new_${Date.now()}`;
    const claim = submitClaim({
      placeId,
      placeSlug: selected?.slug,
      placeName: selected?.name || details.name + "'s business",
      ownerId: user.id,
      ownerName: details.name,
      ownerEmail: details.email,
      ownerPhone: details.phone,
      ownerRole: details.role,
      businessAddress: details.address,
      documents: Object.entries(docs)
        .filter(([, v]) => !!v)
        .map(([key, v]) => {
          const cfg = DOC_TYPES.find((d) => d.key === key);
          return {
            key,
            label: cfg?.label ?? key,
            name: v!.name,
            size: v!.size,
            preview: v!.preview,
          };
        }),
      social,
    });
    setDoneId(claim.id);
    setSubmitting(false);
  };

  const pickBusiness = (b: SearchableBusiness) => {
    setSelected(b);
    setCreatingNew(false);
  };

  const startNewListing = () => {
    setSelected(null);
    setCreatingNew(true);
  };

  return {
    user,
    hydrated,
    stepIdx,
    step,
    canContinue,
    next,
    back,
    submit,
    submitting,
    doneId,
    selected,
    creatingNew,
    query,
    setQuery,
    results,
    pickBusiness,
    startNewListing,
    details,
    setDetails,
    docs,
    setDocs,
    social,
    setSocial,
  };
}
