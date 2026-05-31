import Link from "next/link";
import { Compass, Sparkles, Star, TrendingUp } from "lucide-react";

const heroImg = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const HERO_IMAGES = [
  heroImg("photo-1517248135467-4c7edcad34c4"),
  heroImg("photo-1566073771259-6a8506099945"),
  heroImg("photo-1414235077428-338989a2e8c0"),
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="gradient-brand absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full opacity-30 blur-3xl" />
        <div className="bg-foreground/10 absolute -bottom-32 left-[-10%] h-[420px] w-[420px] rounded-full blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16 md:px-8 md:py-20">
        <div>
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
            <Sparkles className="text-brand h-3.5 w-3.5" />
            AI-powered local discovery · Bangladesh
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Discover the best <span className="text-gradient-brand">places</span> around you.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-base md:text-lg">
            Personalized recommendations for restaurants, cafes and resorts — based on your mood,
            budget and vibe. No more endless scrolling.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ai"
              className="gradient-brand text-brand-foreground shadow-glow inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold transition hover:opacity-95"
            >
              <Sparkles className="h-5 w-5" />
              Start Discovering
            </Link>
            <Link
              href="/discover"
              className="border-border bg-surface text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-base font-semibold transition"
            >
              <Compass className="h-5 w-5" />
              Browse Manually
            </Link>
          </div>

          <div className="text-muted-foreground mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <div>
              <div className="font-display text-foreground text-2xl font-bold">10K+</div>
              Places curated
            </div>
            <div className="bg-border h-8 w-px" />
            <div>
              <div className="font-display text-foreground text-2xl font-bold">4.8★</div>
              Avg user rating
            </div>
            <div className="bg-border h-8 w-px" />
            <div>
              <div className="font-display text-foreground text-2xl font-bold">25+</div>
              Cities covered
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-6 grid-rows-6 gap-3 md:h-[560px]">
          <div className="shadow-card col-span-4 row-span-4 overflow-hidden rounded-3xl">
            <img src={HERO_IMAGES[0]} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="shadow-card col-span-2 row-span-2 overflow-hidden rounded-3xl">
            <img src={HERO_IMAGES[1]} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="gradient-brand text-brand-foreground shadow-glow col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-3xl p-4">
            <Sparkles className="h-6 w-6" />
            <div>
              <div className="font-display text-xl leading-tight font-bold">Match your mood</div>
              <div className="mt-1 text-xs opacity-90">AI picks in 60s</div>
            </div>
          </div>
          <div className="shadow-card col-span-3 row-span-2 overflow-hidden rounded-3xl">
            <img src={HERO_IMAGES[2]} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="bg-card shadow-card col-span-3 row-span-2 flex flex-col justify-between rounded-3xl p-4">
            <div className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
              <TrendingUp className="text-brand h-4 w-4" />
              TRENDING NOW
            </div>
            <div>
              <div className="font-display text-lg leading-tight font-bold">
                Rooftops in Gulshan
              </div>
              <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <Star className="fill-brand text-brand h-3 w-3" />
                4.8 · 1.2k reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
