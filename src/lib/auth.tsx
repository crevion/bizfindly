import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  provider: "google" | "phone";
  accountType: "business_owner";
  createdAt: string;
}

interface AuthCtx {
  user: AuthUser | null;
  hydrated: boolean;
  signInWithGoogle: () => Promise<AuthUser>;
  startPhoneAuth: (phone: string) => Promise<{ devCode: string }>;
  verifyPhoneOtp: (phone: string, code: string, expected: string) => Promise<AuthUser>;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "bizfindly:user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window === "undefined") return;
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const signInWithGoogle = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 900));
    const seed = Math.random().toString(36).slice(2, 8);
    const u: AuthUser = {
      id: `u_${Date.now()}`,
      name: "Rahim Ahmed",
      email: `rahim.${seed}@gmail.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
      provider: "google",
      accountType: "business_owner",
      createdAt: new Date().toISOString(),
    };
    persist(u);
    return u;
  }, []);

  const startPhoneAuth = useCallback(async (_phone: string) => {
    await new Promise((r) => setTimeout(r, 700));
    const devCode = Math.floor(100000 + Math.random() * 900000).toString();
    return { devCode };
  }, []);

  const verifyPhoneOtp = useCallback(async (phone: string, code: string, expected: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (code !== expected) throw new Error("Invalid verification code");
    const u: AuthUser = {
      id: `u_${Date.now()}`,
      name: `User ${phone.slice(-4)}`,
      phone,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${phone}`,
      provider: "phone",
      accountType: "business_owner",
      createdAt: new Date().toISOString(),
    };
    persist(u);
    return u;
  }, []);

  const signOut = useCallback(() => persist(null), []);

  const value = useMemo<AuthCtx>(
    () => ({ user, hydrated, signInWithGoogle, startPhoneAuth, verifyPhoneOtp, signOut }),
    [user, hydrated, signInWithGoogle, startPhoneAuth, verifyPhoneOtp, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
