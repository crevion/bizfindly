"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOBILE_NAV_ITEMS } from "@/content/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[min(94vw,420px)] -translate-x-1/2 md:hidden">
      <div className="glass shadow-card flex items-center justify-around rounded-full px-2 py-2">
        {MOBILE_NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          const isAi = to === "/ai";
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
                  "flex h-9 w-9 items-center justify-center rounded-full transition",
                  isAi && "gradient-brand text-brand-foreground shadow-glow",
                  !isAi && active && "bg-foreground/10",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
