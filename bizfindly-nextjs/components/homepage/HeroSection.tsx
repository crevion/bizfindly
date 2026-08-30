import Link from "next/link";
import { ArrowRight, Compass, Sparkles, Store } from "lucide-react";
import { places } from "@/content/places";

const heroHeights = ["h-56", "h-72", "h-64", "h-80", "h-60", "h-72", "h-52", "h-64"];

const fallbackImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80",
];

const allImages = places.length > 0 ? places.map((p) => p.image) : fallbackImages;

function MarqueeColumn({ images, anim }: { images: string[]; anim: string }) {
  const repeated = [...images, ...images];
  return (
    <div className="mask-fade-y relative h-full overflow-hidden">
      <div className={`flex flex-col gap-3 ${anim}`}>
        {repeated.map((src, i) => (
          <div
            key={i}
            className={`${heroHeights[i % heroHeights.length]} w-full overflow-hidden rounded-2xl bg-muted shadow-soft`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroImageGrid() {
  const col1 = allImages.filter((_, i) => i % 3 === 0);
  const col2 = allImages.filter((_, i) => i % 3 === 1);
  const col3 = allImages.filter((_, i) => i % 3 === 2);

  return (
    <div className="relative h-[560px] w-full">
      <div className="grid h-full grid-cols-3 gap-3">
        <MarqueeColumn images={col1} anim="marquee-up" />
        <MarqueeColumn images={col2} anim="marquee-down" />
        <MarqueeColumn images={col3} anim="marquee-up-slow" />
      </div>
    </div>
  );
}

export function HeroSection() {
  const mobileImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
  ];

  return (
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
              href="/ai"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <Sparkles className="h-4 w-4" />
              AI Discover
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-muted"
            >
              <Compass className="h-4 w-4" />
              Manual Discover
            </Link>
            <Link
              href="/list-business"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-foreground transition hover:text-brand"
            >
              <Store className="h-4 w-4" />
              List Your Business
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative hidden md:block">
          <HeroImageGrid />
        </div>

        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {mobileImages.map((img) => (
              <div key={img} className="aspect-square overflow-hidden rounded-2xl shadow-soft">
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
