"use client";

import Link from "next/link";

const unsplash = (s: string) =>
  `https://images.unsplash.com/${s}?auto=format&fit=crop&w=1400&q=80`;

const collectionsData = [
  {
    id: "rooftop",
    slug: "best-rooftop-restaurants",
    title: "Best Rooftop Restaurants",
    description: "Skyline views, warm lights and unforgettable dinners across Dhaka.",
    cover: unsplash("photo-1414235077428-338989a2e8c0"),
    emoji: "🌆",
    to: "/ai-discover?category=restaurant&q=Rooftop",
  },
  {
    id: "romantic",
    slug: "romantic-date-places",
    title: "Romantic Date Places",
    description: "Intimate settings and couple-friendly picks — perfect for date nights.",
    cover: unsplash("photo-1519671482749-fd09be7ccebf"),
    emoji: "❤️",
    to: "/ai-discover?category=restaurant&q=Couple",
  },
  {
    id: "family",
    slug: "family-friendly-restaurants",
    title: "Family Friendly Restaurants",
    description: "Kid-safe seating, big menus and welcoming spaces for the whole family.",
    cover: unsplash("photo-1552566626-52f8b828add9"),
    emoji: "👨‍👩‍👧",
    to: "/ai-discover?category=restaurant&q=Family",
  },
  {
    id: "weekend",
    slug: "weekend-getaways-near-dhaka",
    title: "Weekend Getaways Near Dhaka",
    description: "Quick escapes within a few hours of the city — resorts, lakes and hills.",
    cover: unsplash("photo-1520250497591-112f2f40a3f4"),
    emoji: "🏞️",
    to: "/ai-discover?category=resort&area=Gazipur",
  },
  {
    id: "luxury",
    slug: "luxury-dining",
    title: "Luxury Dining",
    description: "Fine dining, premium omakase and celebration-worthy experiences.",
    cover: unsplash("photo-1546069901-ba9599a7e63c"),
    emoji: "🥂",
    to: "/ai-discover?category=restaurant&sort=Rating%3A+High+to+Low",
  },
  {
    id: "hidden",
    slug: "hidden-gems",
    title: "Hidden Gems",
    description: "Under-the-radar spots loved by locals but missed by search.",
    cover: unsplash("photo-1543007630-9710e4a00a20"),
    emoji: "💎",
    to: "/ai-discover?category=restaurant",
  },
  {
    id: "budget",
    slug: "budget-friendly-eats",
    title: "Budget Friendly Eats",
    description: "Great food, real portions, under ৳500 per person.",
    cover: unsplash("photo-1631515243349-e0cb75fb8d3a"),
    emoji: "💸",
    to: "/ai-discover?category=restaurant&sort=Price%3A+Low+to+High",
  },
  {
    id: "women-gyms",
    slug: "women-friendly-gyms",
    title: "Women Friendly Gyms",
    description: "Private, supportive fitness spaces with certified female trainers.",
    cover: unsplash("photo-1518611012118-696072aa579a"),
    emoji: "💪",
    to: "/ai-discover?category=gym&q=Women",
  },
];

export function Collections() {
  return (
    <section className="surface-warm border-y border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold tracking-wide text-brand uppercase">
              Collections
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Ideas for your next outing
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
              Explore restaurants, resorts and gyms by occasion, budget and atmosphere.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collectionsData.slice(0, 6).map((s) => {
            return (
              <Link
                key={s.id}
                href={s.to}
                className="group relative block h-72 overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card cursor-pointer"
              >
                <img
                  src={s.cover}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider opacity-90">
                    <span className="text-base">{s.emoji}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold leading-tight md:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm opacity-90">{s.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {collectionsData.slice(6).map((s) => (
            <Link
              key={s.id}
              href={s.to}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-soft transition hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand cursor-pointer"
            >
              <span>{s.emoji}</span>
              {s.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
