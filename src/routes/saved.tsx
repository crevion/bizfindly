import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PlaceCard } from "@/components/PlaceCard";
import { places } from "@/lib/mockData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/saved")({
  component: Saved,
  head: () => ({ meta: [{ title: "Saved — BizFindly" }] }),
});

function Saved() {
  const saved = places.slice(0, 3); // mock

  return (
    <DashboardShell variant="user">
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Your saved places</h1>
          <p className="mt-1 text-sm text-muted-foreground">Quick access to spots you bookmarked.</p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{saved.length} saved</span>
      </div>

      {saved.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">Nothing saved yet</p>
          <Link to="/discover" className="mt-3 inline-block text-sm font-semibold text-brand">
            Start browsing →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {saved.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </div>
    </DashboardShell>
  );
}
