import { apiClient, buildQuery, type Paginated } from "@/lib/backend/api";
import type { CmsPage, EventItem, EventListParams } from "./types";

export const eventsApi = {
  list: (params: EventListParams = {}) =>
    apiClient<Paginated<EventItem>>(`/events/${buildQuery(params)}`),

  page: (slug: string) => apiClient<CmsPage>(`/cms/pages/${slug}/`),
};
