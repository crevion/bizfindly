import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, MapPin, Sparkles, Star, TrendingUp } from "lucide-react";
import { PlaceCard } from "@/components/PlaceCard";
import { places } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "BizFindly — Discover the best places around you" },
      {
        name: "description",
        content:
          "AI-powered local discovery for restaurants, cafes and resorts in Bangladesh. Find places that match your mood, budget and vibe.",
      },
    ],
  }),
});

function Section({
  title,
  subtitle,
  children,
  cta,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  cta?: { label: string; to: string };
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
        </div>
        {cta && (
          <Link
            to={cta.to}
            className="hidden items-center gap-1 text-sm font-semibold text-foreground hover:text-brand md:inline-flex"
          >
            {cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      {children}
    </div>
  );
}

function Home() {
  const trending = places.filter((p) => p.trending || p.rating >= 4.7);
  const cafes = places.filter((p) => p.category === "cafe");
  const resorts = places.filter((p) => p.category === "resort");
  const hidden = places.filter((p) => p.hiddenGem);
  const budget = places.filter((p) => p.priceLevel <= 2);
  const couple = places.filter((p) => p.tags.includes("Couple Spot"));

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full gradient-brand opacity-30 blur-3xl" />
          <div className="absolute -bottom-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-foreground/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16 md:px-8 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              AI-powered local discovery · Bangladesh
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Discover the best{" "}
              <span className="text-gradient-brand">places</span>{" "}
              around you.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Personalized recommendations for restaurants, cafes and resorts — based on your mood,
              budget and vibe. No more endless scrolling.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/ai"
                className="inline-flex items-center justify-center gap-2 rounded-full gradient-brand px-7 py-4 text-base font-semibold text-brand-foreground shadow-glow transition hover:opacity-95"
              >
                <Sparkles className="h-5 w-5" />
                Start Discovering
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-7 py-4 text-base font-semibold text-foreground transition hover:bg-muted"
              >
                <Compass className="h-5 w-5" />
                Browse Manually
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div>
                <div className="font-display text-2xl font-bold text-foreground">10K+</div>
                Places curated
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="font-display text-2xl font-bold text-foreground">4.8★</div>
                Avg user rating
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="font-display text-2xl font-bold text-foreground">25+</div>
                Cities covered
              </div>
            </div>
          </div>

          {/* Bento preview */}
          <div className="relative grid grid-cols-6 grid-rows-6 gap-3 md:h-[560px]">
            <div className="col-span-4 row-span-4 overflow-hidden rounded-3xl shadow-card">
              <img src={places[0].image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-2 row-span-2 overflow-hidden rounded-3xl shadow-card">
              <img src={places[2].image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-3xl gradient-brand p-4 text-brand-foreground shadow-glow">
              <Sparkles className="h-6 w-6" />
              <div>
                <div className="font-display text-xl font-bold leading-tight">Match your mood</div>
                <div className="mt-1 text-xs opacity-90">AI picks in 60s</div>
              </div>
            </div>
            <div className="col-span-3 row-span-2 overflow-hidden rounded-3xl shadow-card">
              <img src={places[4].image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-3 row-span-2 flex flex-col justify-between rounded-3xl bg-card p-4 shadow-card">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-brand" />
                TRENDING NOW
              </div>
              <div>
                <div className="font-display text-lg font-bold leading-tight">Rooftops in Gulshan</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-brand text-brand" />
                  4.8 · 1.2k reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SHORTCUTS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {[
            { label: "Restaurants", to: "/discover", img: places[0].image, count: "3.4k+" },
            { label: "Cafes", to: "/discover", img: places[1].image, count: "1.1k+" },
            { label: "Resorts", to: "/discover", img: places[2].image, count: "320+" },
          ].map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft md:aspect-[16/9]"
            >
              <img
                src={c.img}
                alt={c.label}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="font-display text-lg font-bold md:text-2xl">{c.label}</div>
                <div className="text-xs opacity-90">{c.count} places</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Section title="🔥 Trending now" subtitle="What everyone's saving this week" cta={{ label: "See all", to: "/discover" }}>
        <ScrollRow>
          {trending.map((p) => (
            <PlaceCard key={p.id} place={p} className="w-[260px] flex-none snap-start" />
          ))}
        </ScrollRow>
      </Section>

      <Section title="Popular cafes" subtitle="Specialty coffee, cozy corners and dessert moments" cta={{ label: "See all", to: "/discover" }}>
        <ScrollRow>
          {cafes.map((p) => (
            <PlaceCard key={p.id} place={p} className="w-[260px] flex-none snap-start" />
          ))}
        </ScrollRow>
      </Section>

      <Section title="Weekend resorts" subtitle="Quick escapes from Dhaka and beyond" cta={{ label: "See all", to: "/discover" }}>
        <ScrollRow>
          {resorts.map((p) => (
            <PlaceCard key={p.id} place={p} className="w-[260px] flex-none snap-start" />
          ))}
        </ScrollRow>
      </Section>

      <Section title="💎 Hidden gems" subtitle="Locally loved, under-the-radar finds">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {hidden.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
          {budget.slice(0, 2).map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </Section>

      <Section title="❤️ Couple-friendly picks" subtitle="Date nights, sorted">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {couple.concat(places.filter((p) => p.tags.includes("Fine Dining"))).slice(0, 4).map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </Section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 text-brand-foreground shadow-glow md:p-10">
            <Sparkles className="mb-4 h-8 w-8" />
            <h3 className="font-display text-2xl font-bold md:text-3xl">Get the BizFindly app</h3>
            <p className="mt-2 max-w-md text-sm opacity-90 md:text-base">
              Save places, get AI picks on the go and unlock exclusive coupons.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
                App Store
              </button>
              <button className="rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur">
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
              to="/discover"
              className="mt-6 inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground"
            >
              List your business <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
