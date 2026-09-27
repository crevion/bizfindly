"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeReturnPath } from "@/lib/backend/auth/phone";
import { AuthGate } from "@/components/auth/AuthGate";
import { useAuthStore } from "@/lib/backend/auth";

function JoinInner() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const next = safeReturnPath(params.get("next"));
  const initialMode = params.get("mode") === "register" ? "register" : "login";

  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);

  if (!hydrated || user) return <JoinLoading />;

  return (
    <AuthGate key={initialMode} initialMode={initialMode} onSuccess={() => router.replace(next)} />
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<JoinLoading />}>
      <JoinInner />
    </Suspense>
  );
}

function JoinLoading() {
  return (
    <div
      role="status"
      className="text-muted-foreground flex min-h-[60vh] items-center justify-center"
    >
      Loading your account…
    </div>
  );
}
