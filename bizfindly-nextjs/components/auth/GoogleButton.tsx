"use client";

import { GoogleIcon } from "./GoogleIcon";

export function GoogleButton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs font-medium">or</span>
        <span className="bg-border h-px flex-1" />
      </div>
      <button
        type="button"
        className="border-border bg-background text-foreground hover:border-foreground/40 flex w-full items-center justify-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold shadow-sm transition hover:shadow-md"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </button>
    </div>
  );
}
