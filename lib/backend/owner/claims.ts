import { apiClient } from "@/lib/backend/api";
import { authHeader } from "@/lib/backend/auth/tokens";
import type { Category } from "@/types/place";

export interface ClaimSubmission {
  businessCategory: Category;
  businessSlug: string;
  fullName: string;
  phone: string;
  document: File;
  message?: string;
}

export interface BusinessClaim {
  id: number;
  business: {
    category: Category;
    slug: string;
    name: string;
    city: string;
    cover_photo: string | null;
  };
  full_name: string;
  phone: string;
  document: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string;
  reviewed_at: string | null;
  created_at: string;
}

export const claimsApi = {
  submit: (data: ClaimSubmission) => {
    const form = new FormData();
    form.set("business_category", data.businessCategory);
    form.set("business_slug", data.businessSlug);
    form.set("full_name", data.fullName);
    form.set("phone", data.phone);
    form.set("document", data.document);
    if (data.message) form.set("message", data.message);
    return apiClient<BusinessClaim>("/owner/claims/", {
      method: "POST",
      body: form,
      headers: authHeader(),
    });
  },
};
