"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/lib/backend/auth";
import { ApiError } from "@/lib/backend/api";
import { restaurantsApi } from "@/lib/backend/restaurants";
import { resortsApi } from "@/lib/backend/resorts";
import { gymsApi, mapGym } from "@/lib/backend/gyms/api";
import {
  mapRestaurantDetail,
  mapRestaurantListItem,
  mapResortDetail,
  mapResortListItem,
} from "@/lib/backend/places/map";
import { claimsApi } from "@/lib/backend/owner/claims";
import type { Category, Place } from "@/types/place";
import type { ClaimDetails } from "@/types/verification";
import type { DocValue } from "@/components/claim-business/DocUpload";
import { CLAIM_STEPS } from "@/content/claimSteps";

const SEARCH_PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 300;
const CATEGORIES: Category[] = ["restaurant", "resort", "gym"];

export function useClaimWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const presetCategory = searchParams.get("category");
  const presetSlug = searchParams.get("slug");
  const hasPreset =
    !!presetSlug && CATEGORIES.includes(presetCategory as Category);

  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState<Place | null>(null);
  const [resolvingPreset, setResolvingPreset] = useState(hasPreset);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [details, setDetails] = useState<ClaimDetails>({
    fullName: user?.name || "",
    phone: user?.phone || "",
    message: "",
  });
  const [document, setDocument] = useState<DocValue>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const searchToken = useRef(0);

  useEffect(() => {
    if (!hasPreset) return;
    let cancelled = false;
    (async () => {
      try {
        let place: Place | null = null;
        if (presetCategory === "restaurant") {
          place = mapRestaurantDetail(await restaurantsApi.detail(presetSlug!));
        } else if (presetCategory === "resort") {
          place = mapResortDetail(await resortsApi.detail(presetSlug!));
        } else if (presetCategory === "gym") {
          place = mapGym(await gymsApi.detail(presetSlug!));
        }
        if (!cancelled && place) {
          setSelected(place);
          setStepIdx(1);
        }
      } catch {
        // Couldn't resolve the preselected place — fall back to the find step.
      } finally {
        if (!cancelled) setResolvingPreset(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Only run once, from the initial query params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resolvingPreset) return;
    const token = ++searchToken.current;
    setSearching(true);
    const timer = setTimeout(() => {
      const params = { search: query, page_size: SEARCH_PAGE_SIZE };
      Promise.allSettled([
        restaurantsApi.list(params),
        resortsApi.list(params),
        gymsApi.list(params),
      ]).then(([restaurants, resorts, gyms]) => {
        if (token !== searchToken.current) return;
        const out: Place[] = [];
        if (restaurants.status === "fulfilled") {
          out.push(...restaurants.value.results.map(mapRestaurantListItem));
        }
        if (resorts.status === "fulfilled") {
          out.push(...resorts.value.results.map(mapResortListItem));
        }
        if (gyms.status === "fulfilled") {
          out.push(...gyms.value.results.map(mapGym));
        }
        setResults(out);
        setSearching(false);
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, resolvingPreset]);

  const step = CLAIM_STEPS[stepIdx];

  const canContinue = (() => {
    switch (step?.id) {
      case "find":
        return !!selected;
      case "details":
        return details.fullName.trim().length > 1 && details.phone.trim().length > 4;
      case "documents":
        return !!document;
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
    if (submitting || !user || !selected || !document) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const claim = await claimsApi.submit({
        businessCategory: selected.category,
        businessSlug: selected.slug,
        fullName: details.fullName,
        phone: details.phone,
        document: document.file,
        message: details.message || undefined,
      });
      setDoneId(String(claim.id));
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pickBusiness = (b: Place) => setSelected(b);

  return {
    user,
    hydrated,
    resolvingPreset,
    stepIdx,
    step,
    canContinue,
    next,
    back,
    submit,
    submitting,
    submitError,
    doneId,
    selected,
    query,
    setQuery,
    results,
    searching,
    pickBusiness,
    details,
    setDetails,
    document,
    setDocument,
  };
}
