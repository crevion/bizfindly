"use client";

import Link from "next/link";
import { BarChart3, Plus } from "lucide-react";

export function EmptyDashboard() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
      <div className="gradient-brand shadow-glow mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
        <BarChart3 className="text-brand-foreground h-7 w-7" />
      </div>
      <h1 className="font-display mt-6 text-3xl font-bold md:text-4xl">No listings yet</h1>
      <p className="text-muted-foreground mt-3">
        List your first restaurant, resort or gym to unlock the owner dashboard.
      </p>
      <Link
        href="/list-business"
        className="gradient-brand text-brand-foreground shadow-glow mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
      >
        <Plus className="h-4 w-4" /> List your business
      </Link>
    </div>
  );
}
