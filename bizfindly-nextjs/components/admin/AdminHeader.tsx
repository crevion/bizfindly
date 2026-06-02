"use client";

import Link from "next/link";

export function AdminHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xs font-bold tracking-wider text-sky-600 uppercase">Admin tools</div>
        <h1 className="font-display mt-1 text-3xl font-extrabold md:text-4xl">
          Verification queue
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review submitted claims and approve, reject or request more info.
        </p>
      </div>
      <Link
        href="/"
        className="border-border bg-surface rounded-full border px-4 py-2 text-sm font-semibold"
      >
        Back to site
      </Link>
    </div>
  );
}
