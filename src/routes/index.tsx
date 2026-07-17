import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { GlobalSearchHero } from "@/components/homepage/GlobalSearchHero";
import { AnimatedGallery } from "@/components/homepage/AnimatedGallery";
import { TrustStrip } from "@/components/homepage/TrustStrip";
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
          "Discover restaurants, resorts and gyms across Bangladesh with AI-powered search, verified listings, and curated collections. Skip the Facebook groups.",
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
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-16 md:px-8 md:pt-16 md:pb-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-soft">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              AI-powered local discovery · Bangladesh
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Find your next favourite <span className="text-brand">place</span> — in seconds.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Skip Facebook groups and Google guesswork. BizFindly uses AI to match you with the best
              restaurants, resorts and gyms in Bangladesh — filtered by your mood, budget and location.
            </p>

            <div className="mt-7">
              <GlobalSearchHero />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold md:text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-soft">
                <BadgeCheck className="h-4 w-4 text-info" /> 2,400+ verified
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-soft">
                <ShieldCheck className="h-4 w-4 text-success" /> Owner claimed
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-soft">
                <Sparkles className="h-4 w-4 text-brand" /> Real reviews
              </span>
            </div>

          </div>

          {/* Animated vertical gallery */}
          <div className="relative hidden md:block">
            <AnimatedGallery />
          </div>

          {/* Mobile gallery preview */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {["photo-1517248135467-4c7edcad34c4", "photo-1566073771259-6a8506099945", "photo-1534438327276-14e5300c3a48", "photo-1520250497591-112f2f40a3f4"].map(
                (id) => (
                  <div key={id} className="aspect-square overflow-hidden rounded-2xl shadow-soft">
                    <img
                      src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Unified trending with tabs */}
      <TrendingTabs />

      {/* Collections */}
      <CollectionsSection />

      {/* CTA STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
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
