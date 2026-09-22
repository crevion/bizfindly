"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGate } from "@/components/auth/AuthGate";
import { useAuthStore } from "@/lib/backend/auth";

function JoinInner() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const next = params.get("next") || "/profile";

  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);

  if (!hydrated) return <div className="bg-background min-h-screen" />;

  return (
    <AuthGate
      title="Welcome to BizFindly"
      subtitle="Sign in or create an account to list and manage your business."
      onSuccess={() => router.replace(next)}
    />
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-screen" />}>
      <JoinInner />
    </Suspense>
  );
}
