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
