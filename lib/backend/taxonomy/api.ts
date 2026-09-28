import { apiClient, buildQuery, type NamedSlug, type Paginated } from "@/lib/backend/api";
import type { BusinessScopedParams, BusinessType, TaxonomyParams } from "./types";

export const taxonomyApi = {
  occasions: (params: TaxonomyParams = {}) =>
    apiClient<Paginated<NamedSlug>>(`/occasions/${buildQuery(params)}`),

  vibes: (params: TaxonomyParams = {}) =>
    apiClient<Paginated<NamedSlug>>(`/vibes/${buildQuery(params)}`),

  cuisines: (params: TaxonomyParams = {}) =>
    apiClient<Paginated<NamedSlug>>(`/cuisines/${buildQuery(params)}`),

  groupTypes: (params: TaxonomyParams = {}) =>
    apiClient<Paginated<NamedSlug>>(`/group-types/${buildQuery(params)}`),

  // Gym-only taxonomies: who a gym is for, and what people train there for.
  genderTargets: (params: TaxonomyParams = {}) =>
    apiClient<Paginated<NamedSlug>>(`/gender-targets/${buildQuery(params)}`),

  mainGoals: (params: TaxonomyParams = {}) =>
    apiClient<Paginated<NamedSlug>>(`/main-goals/${buildQuery(params)}`),

  businessTypes: (params: TaxonomyParams = {}) =>
    apiClient<Paginated<BusinessType>>(`/business-types/${buildQuery(params)}`),

  tags: (params: BusinessScopedParams = {}) =>
    apiClient<Paginated<NamedSlug>>(`/tags/${buildQuery(params)}`),

  facilities: (params: BusinessScopedParams = {}) =>
    apiClient<Paginated<NamedSlug>>(`/facilities/${buildQuery(params)}`),
};
