"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/backend/auth";

export function MobileNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/ai-discover", label: "AI", icon: Sparkles, isAi: true },
    { to: "/saved", label: "Saved", icon: Heart },
    user
      ? { to: "/profile", label: "Profile", icon: User, isUser: true }
      : { to: "/join", label: "Join", icon: User, isUser: true },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[min(94vw,420px)] -translate-x-1/2 md:hidden">
      <div className="glass shadow-card flex items-center justify-around rounded-full px-2 py-2">
        {items.map(({ to, label, icon: Icon, isAi, isUser }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              href={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 text-[10px] font-medium transition",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition overflow-hidden",
                  isAi && "gradient-brand text-brand-foreground shadow-glow",
                  !isAi && active && "bg-foreground/10",
                )}
              >
                {isUser && user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <Icon className="h-[18px] w-[18px]" />
                )}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
