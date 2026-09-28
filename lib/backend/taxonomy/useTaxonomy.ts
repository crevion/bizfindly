"use client";

import { useEffect, useState } from "react";
import type { NamedSlug, Paginated } from "@/lib/backend/api";
import { taxonomyApi } from "./api";
import type { BusinessType, BusinessTypeSlug } from "./types";

export type TaxonomyKind =
  | "occasions"
  | "vibes"
  | "cuisines"
  | "groupTypes"
  | "genderTargets"
  | "mainGoals"
  | "businessTypes"
  | "tags"
  | "facilities";

async function fetchAll<T>(
  fn: (params: {
    page?: number;
    page_size?: number;
    business_type?: BusinessTypeSlug;
  }) => Promise<Paginated<T>>,
  businessType?: BusinessTypeSlug,
): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  for (;;) {
    const res = await fn({ page, page_size: 100, business_type: businessType });
    out.push(...res.results);
    if (!res.next || page >= 20) break;
    page += 1;
  }
  return out;
}

const cache = new Map<string, Promise<unknown[]>>();

function loaderFor(kind: TaxonomyKind, businessType?: BusinessTypeSlug): Promise<unknown[]> {
  switch (kind) {
    case "occasions":
      return fetchAll(taxonomyApi.occasions);
    case "vibes":
      return fetchAll(taxonomyApi.vibes);
    case "cuisines":
      return fetchAll(taxonomyApi.cuisines);
    case "groupTypes":
      return fetchAll(taxonomyApi.groupTypes);
    case "genderTargets":
      return fetchAll(taxonomyApi.genderTargets);
    case "mainGoals":
      return fetchAll(taxonomyApi.mainGoals);
    case "businessTypes":
      return fetchAll(taxonomyApi.businessTypes);
    case "tags":
      return fetchAll(taxonomyApi.tags, businessType);
    case "facilities":
      return fetchAll(taxonomyApi.facilities, businessType);
  }
}

export function loadTaxonomy<T = NamedSlug>(
  kind: TaxonomyKind,
  businessType?: BusinessTypeSlug,
): Promise<T[]> {
  const key = `${kind}:${businessType ?? ""}`;
  let promise = cache.get(key);
  if (!promise) {
    promise = loaderFor(kind, businessType).catch((err) => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, promise);
  }
  return promise as Promise<T[]>;
}

interface TaxonomyHookState<T> {
  data: T[];
  loading: boolean;
  error: boolean;
}

export function useTaxonomy(
  kind: Exclude<TaxonomyKind, "businessTypes">,
  businessType?: BusinessTypeSlug,
): TaxonomyHookState<NamedSlug>;
export function useTaxonomy(kind: "businessTypes"): TaxonomyHookState<BusinessType>;
export function useTaxonomy(
  kind: TaxonomyKind,
  businessType?: BusinessTypeSlug,
): TaxonomyHookState<NamedSlug | BusinessType> {
  const [state, setState] = useState<TaxonomyHookState<NamedSlug | BusinessType>>({
    data: [],
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    setState({ data: [], loading: true, error: false });
    loadTaxonomy<NamedSlug | BusinessType>(kind, businessType)
      .then((data) => {
        if (active) setState({ data, loading: false, error: false });
      })
      .catch(() => {
        if (active) setState({ data: [], loading: false, error: true });
      });
    return () => {
      active = false;
    };
  }, [kind, businessType]);

  return state;
}
