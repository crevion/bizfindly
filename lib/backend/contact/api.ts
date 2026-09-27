import { apiClient } from "@/lib/backend/api";

export interface ContactPageData {
  support_email: string;
  business_email: string;
  address: string;
  office_hours: string;
  topics: { value: string; label: string }[];
  faqs: { id: number; question: string; answer: string }[];
}
export interface ContactInput {
  name: string;
  email: string;
  topic: string;
  message: string;
}
export const contactApi = {
  page: () => apiClient<ContactPageData>("/contact/"),
  submit: (body: ContactInput) =>
    apiClient<{ detail: string }>("/contact/", { method: "POST", body }),
};
