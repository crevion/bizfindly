"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-brand text-xs font-semibold tracking-wider uppercase">
          Owner dashboard
        </div>
        <h1 className="font-display mt-1 text-3xl font-bold md:text-4xl">Welcome back 👋</h1>
      </div>
      <Link
        href="/list-business"
        className="gradient-brand text-brand-foreground shadow-glow inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        <Plus className="h-4 w-4" /> Add new listing
      </Link>
    </div>
  );
}
