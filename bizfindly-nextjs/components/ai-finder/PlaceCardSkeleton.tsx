"use client";

export function PlaceCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-border bg-card p-4 gap-4 animate-pulse shadow-soft">
      <div className="w-full sm:w-48 aspect-[4/3] sm:aspect-square rounded-2xl bg-muted shrink-0" />
      <div className="flex-1 flex flex-col justify-between space-y-3 py-1">
        <div className="space-y-2">
          <div className="h-3 w-1/3 bg-muted rounded" />
          <div className="h-5 w-3/4 bg-muted rounded" />
          <div className="h-3 w-full bg-muted rounded" />
          <div className="flex gap-2 pt-2">
            <div className="h-5 w-16 bg-muted rounded-lg" />
            <div className="h-5 w-20 bg-muted rounded-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-4 w-12 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function PlaceListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <PlaceCardSkeleton key={i} />
      ))}
    </div>
  );
}
