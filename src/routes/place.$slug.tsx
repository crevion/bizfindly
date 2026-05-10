import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  BadgeCheck,
  Clock,
  Globe,
  Heart,
  MapPin,
  Phone,
  Share2,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";
import { findPlace, places } from "@/lib/mockData";
import { PlaceCard } from "@/components/PlaceCard";

export const Route = createFileRoute("/place/$slug")({
  component: PlacePage,
  loader: ({ params }) => {
    const place = findPlace(params.slug);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.place.name} — BizFindly` },
          { name: "description", content: loaderData.place.description },
          { property: "og:title", content: loaderData.place.name },
          { property: "og:description", content: loaderData.place.description },
          { property: "og:image", content: loaderData.place.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Place not found</h1>
      <Link to="/discover" className="mt-4 inline-block text-brand">
        Back to discover
      </Link>
    </div>
  ),
});

const reviews = [
  {
    user: "Tahmid R.",
    rating: 5,
    date: "2 days ago",
    text: "Stunning rooftop and the lamb shank biryani was unreal. Service was attentive without being intrusive.",
    avatar: "TR",
  },
  {
    user: "Nazia A.",
    rating: 4,
    date: "1 week ago",
    text: "Loved the live music on Friday night. Bit pricey but the vibe makes up for it.",
    avatar: "NA",
  },
  {
    user: "Rafi K.",
    rating: 5,
    date: "3 weeks ago",
    text: "Took my parents for their anniversary — they loved it. Quiet corner table on request.",
    avatar: "RK",
  },
];

function PlacePage() {
  const { place } = Route.useLoaderData();
  const similar = places.filter((p) => p.id !== place.id && p.category === place.category).slice(0, 4);

  return (
    <div>
      {/* HERO GALLERY */}
      <div className="relative">
        <div className="grid h-[60vh] grid-cols-4 grid-rows-2 gap-1 overflow-hidden md:h-[520px]">
          <div className="col-span-4 row-span-2 md:col-span-2">
            <img src={place.gallery[0]} alt={place.name} className="h-full w-full object-cover" />
          </div>
          {place.gallery.slice(1, 5).map((g, i) => (
            <div key={i} className="hidden md:block">
              <img src={g} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="absolute right-4 top-4 flex gap-2 md:right-8 md:top-8">
          <button className="flex h-10 w-10 items-center justify-center rounded-full glass">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full glass">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          {/* MAIN */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="rounded-full bg-muted px-2.5 py-1 capitalize">{place.category}</span>
              {place.cuisine && <span className="rounded-full bg-muted px-2.5 py-1">{place.cuisine}</span>}
              {place.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-brand">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
              {place.trending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-background">
                  <TrendingUp className="h-3.5 w-3.5" /> Trending
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {place.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-brand text-brand" />
                <span className="font-bold text-foreground">{place.rating}</span>
                <span>({place.reviews} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {place.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {place.hours}
              </span>
            </div>

            {/* AI Summary */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-soft to-card p-6 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
                <Sparkles className="h-4 w-4" /> BizFindly AI summary
              </div>
              <p className="mt-3 text-lg font-medium leading-snug">{place.aiSummary}</p>
            </div>

            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold">About</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{place.description}</p>
            </section>

            {/* Tags */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold">Why people love it</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {place.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* Facilities */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold">Facilities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {place.facilities.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 rounded-2xl bg-card p-3 text-sm shadow-soft"
                  >
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    {f}
                  </div>
                ))}
              </div>
            </section>

            {/* Menu */}
            {place.menu && (
              <section className="mt-10">
                <h2 className="font-display text-2xl font-bold">Menu highlights</h2>
                <div className="mt-4 space-y-6">
                  {place.menu.map((cat) => (
                    <div key={cat.category}>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {cat.category}
                      </h3>
                      <div className="mt-2 divide-y divide-border rounded-2xl bg-card shadow-soft">
                        {cat.items.map((item) => (
                          <div key={item.name} className="flex items-center justify-between p-4">
                            <span className="font-medium">{item.name}</span>
                            <span className="font-semibold text-brand">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Reviews</h2>
                <button className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
                  Write a review
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r.user} className="rounded-3xl bg-card p-5 shadow-soft">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand text-sm font-bold text-brand-foreground">
                        {r.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{r.user}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                      <div className="inline-flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-brand text-brand" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pricing
              </div>
              <div className="mt-1 font-display text-2xl font-bold">{place.priceRange}</div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{place.location}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{place.phone}</span>
                </div>
                {place.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span>{place.website}</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{place.hours}</span>
                </div>
              </div>

              <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow">
                Reserve / Contact
              </button>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold">
                  Directions
                </button>
                <button className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold">
                  Save
                </button>
              </div>

              {/* fake map */}
              <div className="mt-5 h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-secondary">
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  Map preview
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 overflow-hidden rounded-3xl border border-dashed border-brand/40 bg-brand/5 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
                <Tag className="h-4 w-4" /> BizFindly offer
              </div>
              <div className="mt-2 font-display text-lg font-bold">10% off your first visit</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Mention code <span className="font-bold text-foreground">BIZ10</span> at checkout.
              </p>
            </div>
          </aside>
        </div>

        {/* Similar */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold md:text-3xl">You might also love</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {similar.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
