"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Store,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/backend/auth";
import type { AuthUser } from "@/lib/backend/auth/types";
import { cn } from "@/lib/utils";

export function UserDropdown({ user }: { user: AuthUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);

  const initial = (user.name || "U").charAt(0).toUpperCase();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    toast.success("Signed out successfully");
    router.refresh();
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button: Clean circular avatar button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User account menu"
        className={cn(
          "ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card shadow-soft transition hover:border-foreground/30 hover:scale-105 cursor-pointer",
          isOpen && "border-brand ring-2 ring-brand/30 scale-105",
        )}
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand text-xs font-bold text-brand-foreground">
            {initial}
          </div>
        )}
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-card backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Profile Header */}
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-bold text-brand-foreground shadow-sm">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-sm font-bold text-foreground">
                {user.name}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {user.email || user.phone || "Active Explorer"}
              </div>
            </div>
          </div>

          <div className="my-1.5 h-px bg-border/60" />

          {/* Navigation Options */}
          <div className="space-y-0.5 text-xs font-medium">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-foreground transition hover:bg-muted"
            >
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span>View Profile</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-foreground transition hover:bg-muted"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              <span>Owner Dashboard</span>
            </Link>

            <Link
              href="/saved"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-foreground transition hover:bg-muted"
            >
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span>Saved Places</span>
            </Link>

            <Link
              href="/list-business"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-foreground transition hover:bg-muted"
            >
              <Store className="h-4 w-4 text-muted-foreground" />
              <span>List Your Business</span>
            </Link>
          </div>

          <div className="my-1.5 h-px bg-border/60" />

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-destructive transition hover:bg-destructive/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
