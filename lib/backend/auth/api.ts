import { apiClient } from "@/lib/backend/api";
import { authHeader } from "./tokens";
import type {
  ChangePasswordPayload,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  ResetPasswordPayload,
  TokenResponse,
  VerifyOtpPayload,
} from "./types";

export const authApi = {
  googleLogin: (credential: string) =>
    apiClient<TokenResponse>("/auth/google/", { method: "POST", body: { credential } }),

  profile: (token: string) =>
    apiClient<{
      id: number;
      name: string;
      phone: string | null;
      email: string;
      avatar: string | null;
    }>("/profile/", {
      headers: { Authorization: `Token ${token}` },
    }),

  resendOtp: (payload: LoginPayload) =>
    apiClient<MessageResponse>("/auth/resend-otp/", { method: "POST", body: payload }),

  register: (payload: RegisterPayload) =>
    apiClient<MessageResponse>("/auth/register/", { method: "POST", body: payload }),

  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient<TokenResponse>("/auth/verify-otp/", { method: "POST", body: payload }),

  login: (payload: LoginPayload) =>
    apiClient<TokenResponse>("/auth/login/", { method: "POST", body: payload }),

  logout: () => apiClient<void>("/auth/logout/", { method: "POST", headers: authHeader() }),

  forgotPassword: (phone: string) =>
    apiClient<MessageResponse>("/auth/forgot-password/", { method: "POST", body: { phone } }),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient<MessageResponse>("/auth/reset-password/", { method: "POST", body: payload }),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient<MessageResponse>("/auth/change-password/", {
      method: "POST",
      body: payload,
      headers: authHeader(),
    }),
};
