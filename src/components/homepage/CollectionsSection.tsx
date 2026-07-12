import { Link } from "@tanstack/react-router";
import { Bookmark, Users } from "lucide-react";
import { collections, getCollectionPlaces } from "@/lib/collections";

export function CollectionsSection() {
  return (
    <section className="surface-warm border-y border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold tracking-wide text-brand uppercase">
              Collections
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Curated lists to skip the search
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
              Handpicked bundles of the best places in Bangladesh — updated weekly by our editors and AI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.slice(0, 6).map((c) => {
            const count = getCollectionPlaces(c).length;
            return (
              <Link
                key={c.id}
                to="/discover"
                className="group relative block h-72 overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <img
                  src={c.cover}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="glass flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition hover:bg-white/20"
                    aria-label="Save collection"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider opacity-90">
                    <span className="text-base">{c.emoji}</span>
                    <span>{count} places</span>
                    <span className="opacity-50">·</span>
                    <Users className="h-3 w-3" />
                    {c.followers.toLocaleString()}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold leading-tight md:text-2xl">
                    {c.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm opacity-90">{c.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {collections.slice(6).map((c) => (
            <Link
              key={c.id}
              to="/discover"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-soft transition hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand"
            >
              <span>{c.emoji}</span>
              {c.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
