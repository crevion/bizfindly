"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "./api";
import { clearToken, getToken, setToken } from "./tokens";
import type {
  AuthUser,
  ChangePasswordPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "./types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;

  setUser: (u: AuthUser | null) => void;
  setHydrated: (v: boolean) => void;

  googleLogin: (credential: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<string>;
  verifyOtp: (phone: string, code: string, name?: string) => Promise<AuthUser>;
  login: (phone: string, password: string) => Promise<AuthUser>;
  forgotPassword: (phone: string) => Promise<string>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<string>;
  changePassword: (payload: ChangePasswordPayload) => Promise<string>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,

      setUser: (u) => set({ user: u }),
      setHydrated: (v) => set({ hydrated: v }),

      googleLogin: async (credential) => {
        const { token } = await authApi.googleLogin(credential);
        const profile = await authApi.profile(token);
        const user: AuthUser = {
          ...profile,
          id: String(profile.id),
          phone: profile.phone ?? "",
          name: profile.name || profile.email,
          avatar: profile.avatar || undefined,
        };
        setToken(token);
        set({ token, user });
        return user;
      },

      register: async (payload) => {
        const res = await authApi.register(payload);
        return res.message;
      },

      verifyOtp: async (phone, code, name) => {
        const { token } = await authApi.verifyOtp({ phone, code });
        const profile = await authApi.profile(token);
        const user: AuthUser = {
          ...profile,
          id: String(profile.id),
          phone: profile.phone ?? "",
          name: profile.name || name?.trim() || phone,
          avatar: profile.avatar || undefined,
        };
        setToken(token);
        set({ token, user });
        return user;
      },

      login: async (phone, password) => {
        const { token } = await authApi.login({ phone, password });
        const profile = await authApi.profile(token);
        const user: AuthUser = {
          ...profile,
          id: String(profile.id),
          phone: profile.phone ?? "",
          name: profile.name || phone,
          avatar: profile.avatar || undefined,
        };
        setToken(token);
        set({ token, user });
        return user;
      },

      forgotPassword: async (phone) => {
        const res = await authApi.forgotPassword(phone);
        return res.message;
      },

      resetPassword: async (payload) => {
        const res = await authApi.resetPassword(payload);
        return res.message;
      },

      changePassword: async (payload) => {
        const res = await authApi.changePassword(payload);
        clearToken();
        set({ token: null, user: null });
        return res.message;
      },

      signOut: async () => {
        if (get().token) {
          try {
            await authApi.logout();
          } catch {}
        }
        clearToken();
        set({ token: null, user: null });
      },
    }),
    {
      name: "bizfindly:user",
      storage: createJSONStorage(() => window.localStorage),
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => {
        const token = getToken();
        if (state) {
          state.token = token;
          if (!token) state.user = null;
        }
        state?.setHydrated(true);
      },
    },
  ),
);
