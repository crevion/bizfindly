"use client";

import { Shield } from "lucide-react";

export function EmptyQueue() {
  return (
    <div className="border-border mt-12 rounded-3xl border border-dashed p-16 text-center">
      <Shield className="text-muted-foreground mx-auto h-8 w-8" />
      <div className="mt-3 text-lg font-semibold">No claim submissions yet</div>
      <p className="text-muted-foreground mt-1 text-sm">
        When business owners submit a verification request, it will appear here.
      </p>
    </div>
  );
}
