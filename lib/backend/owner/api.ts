import { apiClient } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";
import type { OwnerProfile, UpdateProfileInput } from "./types";

export const ownerApi = {
  getProfile: () => apiClient<OwnerProfile>("/owner/profile/", { headers: authHeader() }),

  updateProfile: (data: UpdateProfileInput | FormData) =>
    apiClient<OwnerProfile>("/owner/profile/", {
      method: "PATCH",
      body: data,
      headers: authHeader(),
    }),
};
