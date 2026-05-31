"use client";

import Link from "next/link";
import { ChevronRight, Heart, History, LogOut, MapPin, Settings, Star, Store } from "lucide-react";
import { useAuthStore } from "@/lib/backend/auth";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

const items = [
  { label: "Saved places", icon: Heart, to: "/saved" },
  { label: "My reviews", icon: Star, to: "/profile" },
  { label: "Recommendation history", icon: History, to: "/ai" },
  { label: "List your business", icon: Store, to: "/list-business" },
  { label: "Owner dashboard", icon: Settings, to: "/dashboard" },
] as const;

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const initial = (user?.name || "G").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <div className="gradient-brand text-brand-foreground shadow-glow rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="bg-foreground text-background flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-2xl font-bold">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div>
            <div className="font-display text-2xl font-bold">
              {user ? `Welcome, ${user.name.split(" ")[0]}` : "Welcome, Guest"}
            </div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="h-3.5 w-3.5" />
              {user?.phone || user?.email || "Dhaka, Bangladesh"}
            </div>
          </div>
        </div>
        {!user ? (
          <div className="mt-5 flex gap-2">
            <Link
              href="/join"
              className="bg-foreground text-background flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold"
            >
              Sign in
            </Link>
            <Link
              href="/join"
              className="flex-1 rounded-full bg-white/20 px-4 py-2.5 text-center text-sm font-semibold backdrop-blur"
            >
              Create account
            </Link>
          </div>
        ) : (
          <div className="mt-5 flex gap-2">
            <Link
              href="/dashboard"
              className="bg-foreground text-background flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold"
            >
              Owner dashboard
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        )}
      </div>

      <div className="divide-border bg-card shadow-soft mt-6 divide-y overflow-hidden rounded-3xl">
        {items.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            href={to}
            className="hover:bg-muted flex items-center gap-3 p-4 transition"
          >
            <span className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex-1 font-medium">{label}</span>
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          </Link>
        ))}
      </div>

      {user && <ChangePasswordForm />}

      <p className="text-muted-foreground mt-8 text-center text-xs">
        BizFindly · AI-powered local discovery
      </p>
    </div>
  );
}
