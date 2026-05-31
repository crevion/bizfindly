"use client";

import { useEffect, useState } from "react";
import { useVerificationStore } from "@/store/useVerificationStore";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ClaimDetail } from "@/components/admin/ClaimDetail";
import { ClaimList } from "@/components/admin/ClaimList";
import { EmptyQueue } from "@/components/admin/EmptyQueue";
import { FilterTabs } from "@/components/admin/FilterTabs";
import type { VerificationFilter } from "@/types/verification";

export default function AdminVerificationsPage() {
  const claims = useVerificationStore((s) => s.claims);
  const hydrated = useVerificationStore((s) => s.hydrated);
  const [filter, setFilter] = useState<VerificationFilter>("pending");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (claims[0]) setActiveId(claims[0].id);
  }, [claims]);

  if (!hydrated) return <div className="bg-background min-h-screen" />;

  const visible = claims.filter((c) => filter === "all" || c.status === filter);
  const active = claims.find((c) => c.id === activeId) || visible[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <AdminHeader />
      <FilterTabs claims={claims} filter={filter} setFilter={setFilter} />

      {claims.length === 0 ? (
        <EmptyQueue />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <ClaimList claims={visible} activeId={active?.id} onPick={setActiveId} />
          {active && <ClaimDetail active={active} />}
        </div>
      )}
    </div>
  );
}
