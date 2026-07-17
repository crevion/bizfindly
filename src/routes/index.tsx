import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, MapPin, Sparkles, Store } from "lucide-react";
import { AnimatedGallery } from "@/components/homepage/AnimatedGallery";
import { TrendingTabs } from "@/components/homepage/TrendingTabs";
import { CollectionsSection } from "@/components/homepage/CollectionsSection";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "BizFindly — AI-powered local discovery for Bangladesh" },
      {
        name: "description",
        content:
          "Discover restaurants, resorts and gyms across Bangladesh with AI-powered search, verified listings, and curated collections.",
      },
      { property: "og:title", content: "BizFindly — AI-powered local discovery" },
      { property: "og:description", content: "Find restaurants, resorts and gyms that match your mood, budget and vibe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Home() {
  return (
    <div>
      {/* HERO — minimal, premium */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-20 md:px-8 md:pt-24 md:pb-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              AI-powered Local Discovery
            </span>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              Find your next <span className="text-brand">favorite</span> place.
            </h1>

            <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
              Discover restaurants, resorts and gyms with AI-powered recommendations.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/ai"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <Sparkles className="h-4 w-4" />
                AI Discover
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-muted"
              >
                <Compass className="h-4 w-4" />
                Manual Discover
              </Link>
              <Link
                to="/list-business"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-foreground transition hover:text-brand"
              >
                <Store className="h-4 w-4" />
                List Your Business
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Animated vertical gallery */}
          <div className="relative hidden md:block">
            <AnimatedGallery />
          </div>

          {/* Mobile gallery preview */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {[
                "photo-1517248135467-4c7edcad34c4",
                "photo-1566073771259-6a8506099945",
                "photo-1534438327276-14e5300c3a48",
                "photo-1520250497591-112f2f40a3f4",
              ].map((id) => (
                <div key={id} className="aspect-square overflow-hidden rounded-2xl shadow-soft">
                  <img
                    src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Unified trending with tabs */}
      <TrendingTabs />

      {/* Collections */}
      <CollectionsSection />

      {/* Why BizFindly — trust moved here */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Why BizFindly
          </h2>
          <p className="mt-3 text-muted-foreground">
            A curated, verified network of places across Bangladesh — powered by real reviews and
            AI-matched recommendations.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { stat: "2,400+", label: "Verified businesses", desc: "Every listing reviewed by our team." },
            { stat: "12k+", label: "Real reviews", desc: "From locals, tourists and regulars." },
            { stat: "98%", label: "Owner claimed", desc: "Direct answers from the businesses themselves." },
          ].map((it) => (
            <div key={it.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="font-display text-3xl font-bold text-foreground">{it.stat}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{it.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{it.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-brand p-8 text-brand-foreground shadow-card md:p-10">
            <Sparkles className="mb-4 h-8 w-8" />
            <h3 className="font-display text-2xl font-bold md:text-3xl">Get the BizFindly app</h3>
            <p className="mt-2 max-w-md text-sm opacity-90 md:text-base">
              Save places, get AI picks on the go and unlock exclusive coupons.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-soft transition hover:-translate-y-0.5">
                App Store
              </button>
              <button className="rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
                Google Play
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-background shadow-card md:p-10">
            <MapPin className="mb-4 h-8 w-8 text-brand" />
            <h3 className="font-display text-2xl font-bold md:text-3xl">Own a business?</h3>
            <p className="mt-2 max-w-md text-sm opacity-80 md:text-base">
              Claim your listing, reach thousands of nearby customers and grow with insights.
            </p>
            <Link
              to="/list-business"
              className="btn-primary mt-6 inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              List your business <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

