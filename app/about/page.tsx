import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — BizFindly",
  description:
    "Discover the story, technology, and curated lifestyle network behind BizFindly — Bangladesh's premier AI-powered local discovery platform.",
};

const STATS = [
  {
    value: "3,500+",
    label: "Curated Venues",
    desc: "Restaurants, resorts, and gyms across Bangladesh",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    badge: "Verified Listings",
  },
  {
    value: "15,000+",
    label: "Authentic Reviews",
    desc: "From genuine foodies, travelers, and lifters",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    badge: "Real Patrons",
  },
  {
    value: "64",
    label: "Districts Active",
    desc: "From Dhaka & Chittagong to Sylhet & Cox's Bazar",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    badge: "Nationwide",
  },
  {
    value: "98%",
    label: "Owner Verified",
    desc: "Direct menus, live hours, and instant owner updates",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    badge: "Direct Sync",
  },
];

const CATEGORY_SHOWCASE = [
  {
    title: "Culinary & Dining",
    count: "3.4k+ spots",
    desc: "From rooftop sunset bistros in Dhanmondi to cozy specialty coffee shops in Banani and authentic biryani houses in Old Dhaka.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tag: "Dining & Cafés",
    href: "/discover?cat=restaurant",
  },
  {
    title: "Resorts & Getaways",
    count: "320+ retreats",
    desc: "Eco-resorts nestled in Gazipur sal forests, tea-estate villas in Sreemangal, and beachfront sanctuaries in Cox's Bazar.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    tag: "Stays & Stays",
    href: "/discover?cat=resort",
  },
  {
    title: "Fitness & Studios",
    count: "180+ gyms",
    desc: "Premier strength gyms with imported equipment, women-only studios with certified female coaches, and high-intensity CrossFit boxes.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    tag: "Fitness & Health",
    href: "/discover?cat=gym",
  },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "AI-Powered Vibe Matching",
    description:
      "Our neural discovery engine understands nuanced context — whether you need quiet laptop seating with fast Wi-Fi, a romantic rooftop anniversary spot, or a private family resort villa.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Paid Spam & True Verification",
    description:
      "No fake reviews or pay-to-win rankings. We verify business owners through official documents, keeping operating hours, prices, and amenities 100% accurate.",
  },
  {
    icon: Building2,
    title: "Empowering Local Businesses",
    description:
      "We provide neighborhood business owners with complimentary digital storefront tools — instant menu publishing, review management, and direct customer engagement.",
  },
  {
    icon: HeartHandshake,
    title: "Built by Locals, for Bangladesh",
    description:
      "We understand local culture, from dietary preferences and halal certification to district travel dynamics, celebrating local hidden gems alongside flagship brands.",
  },
];

const COMMUNITY_VOICES = [
  {
    quote:
      "BizFindly helped us find a serene resort in Gazipur with a private pool and BBQ setup within 20 seconds. The AI recommendations were spot-on.",
    author: "Tanvir Ahmed",
    role: "Explorer & Photographer",
    location: "Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "As a restaurant owner in Dhanmondi, claiming our profile on BizFindly brought dozens of new dinner guests who found us via the AI mood finder.",
    author: "Nusrat Jahan",
    role: "Café Owner",
    location: "Dhanmondi, Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "Finding gyms with certified female trainers used to require calling 10 places. BizFindly filtered all verified women-friendly studios instantly.",
    author: "Farhana Kabir",
    role: "Fitness Enthusiast",
    location: "Uttara, Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Hero Section with Rich Bento Photo Gallery */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-card via-background to-background py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Narrative */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                The Story Behind BizFindly
              </span>
              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl leading-[1.05]">
                Redefining how Bangladesh discovers <span className="text-brand">local lifestyle</span>.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                We combine artificial intelligence with verified local curation so you can skip endless searches
                and step straight into the best restaurants, serene resorts, and boutique gyms.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/ai"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <Sparkles className="h-4 w-4" /> Try AI Finder
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-muted"
                >
                  <Compass className="h-4 w-4" /> Explore Places
                </Link>
              </div>

              {/* Mini Social Proof */}
              <div className="mt-10 flex items-center gap-4 pt-6 border-t border-border/60">
                <div className="flex -space-x-2.5">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="User avatar"
                      className="h-9 w-9 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1 font-bold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5.0</span>
                    <span className="text-muted-foreground font-normal">from 15k+ patrons</span>
                  </div>
                  <div className="text-muted-foreground">Trusted across 64 districts</div>
                </div>
              </div>
            </div>

            {/* Right: Rich Bento Image Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Tile 1: Tall Dining Hero */}
              <div className="group relative row-span-2 overflow-hidden rounded-3xl border border-border shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Rooftop Dining"
                  className="h-full min-h-[380px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground shadow-sm">
                    Dining & Cafés
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 3,400+ Verified Spots
                  </div>
                  <h3 className="font-display text-lg font-bold">Rooftops & Fine Dining</h3>
                  <p className="mt-0.5 text-xs opacity-80">Dhaka, Chittagong & Sylhet</p>
                </div>
              </div>

              {/* Tile 2: Resort Tile */}
              <div className="group relative overflow-hidden rounded-3xl border border-border shadow-soft h-[185px]">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                  alt="Luxury Resort"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                    Getaways
                  </div>
                  <div className="font-display text-sm font-bold">Resorts & Villas</div>
                </div>
              </div>

              {/* Tile 3: Gym & Fitness Tile */}
              <div className="group relative overflow-hidden rounded-3xl border border-border shadow-soft h-[185px]">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                  alt="Fitness Gym"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                    Fitness
                  </div>
                  <div className="font-display text-sm font-bold">Gyms & Studios</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Photo-Backed Stat Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Our Nationwide Reach
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Numbers that drive local confidence
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Empowering explorers with authentic data verified directly by venue owners and our editorial team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative h-44 w-full overflow-hidden bg-muted">
                <img
                  src={s.image}
                  alt={s.label}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-black/30 to-transparent" />
                <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                  {s.badge}
                </span>
              </div>
              <div className="p-6">
                <div className="font-display text-3xl font-black text-brand md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 font-display text-base font-bold text-foreground">
                  {s.label}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Three Large Visual Showcase Cards */}
      <section className="surface-warm border-y border-border py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                What We Curate
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Three core lifestyle pillars
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Designed to cover every moment of your week — from weekday workouts to Friday dinners and weekend getaways.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-brand transition"
            >
              Explore all categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CATEGORY_SHOWCASE.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
                    {cat.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 text-xs font-bold text-white/90">
                    {cat.count}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-brand transition">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground flex-1">
                    {cat.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand">
                    <span>Browse {cat.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How the AI Recommendation Engine Works */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              The Technology
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-5xl leading-tight">
              AI tuned for real human moods and moments.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Traditional search engines return sponsored ads or chaotic links. BizFindly processes natural
              prompts to understand vibe, dietary needs, operating schedules, and price levels in real-time.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">Natural Mood Queries</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    &quot;Rooftop dinner in Dhanmondi for 2 under ৳2000 with live music&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">Live Verification Filter</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Instantly verifies if the venue is currently open, has available parking, and matches dietary tags.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">Match Score & AI Summary</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Summarizes hundreds of patron reviews into a concise 2-sentence verdict.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background shadow-soft transition hover:bg-foreground/90"
              >
                <Sparkles className="h-4 w-4 text-brand" /> Launch AI Finder
              </Link>
            </div>
          </div>

          {/* Graphic / Interactive Mock Preview */}
          <div className="relative rounded-3xl border border-border bg-gradient-to-br from-card to-muted p-6 shadow-card">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-soft">
              <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                <span className="flex items-center gap-1.5 font-bold text-brand">
                  <Sparkles className="h-3.5 w-3.5" /> AI Discovery Query
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  Instant Match
                </span>
              </div>
              <p className="mt-3 text-xs font-mono text-muted-foreground bg-muted/60 p-2.5 rounded-xl">
                &quot;Quiet aesthetic café in Banani for remote work with power outlets and great pour-over coffee&quot;
              </p>

              <div className="mt-4 rounded-2xl border border-border bg-card p-3 shadow-soft flex gap-3 items-center">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80"
                  alt="Artisanal Cafe"
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-sm font-bold text-foreground truncate">
                      The Artisan Roastery
                    </span>
                    <BadgeCheck className="h-3.5 w-3.5 text-info shrink-0" />
                  </div>
                  <div className="text-[11px] text-muted-foreground">Road 11, Banani · ৳৳</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <Sparkles className="h-3 w-3" /> 98% Match for Laptop Work & Coffee
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-background p-4 shadow-soft">
                <div className="text-2xl font-black text-brand">0.3s</div>
                <div className="text-xs font-semibold text-foreground">Search Latency</div>
                <div className="text-[10px] text-muted-foreground">Neural vector matching</div>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 shadow-soft">
                <div className="text-2xl font-black text-foreground">100%</div>
                <div className="text-xs font-semibold text-foreground">Privacy Guaranteed</div>
                <div className="text-[10px] text-muted-foreground">No tracking or data sales</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Values & Principles */}
      <section className="surface-warm border-y border-border py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Our Principles
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              What we stand for every day
            </h2>
            <p className="mt-3 text-muted-foreground text-sm">
              Our commitments to visitors, patrons, and the business owners who power Bangladesh&apos;s lifestyle scene.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground flex-1">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Community Voices & Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Community Love
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Loved by explorers & business owners
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hear how BizFindly connects people with places that matter across Bangladesh.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {COMMUNITY_VOICES.map((item) => (
            <div
              key={item.author}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:shadow-card"
            >
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-xs italic leading-relaxed text-muted-foreground flex-1">
                &quot;{item.quote}&quot;
              </p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="h-10 w-10 rounded-full object-cover border border-border"
                />
                <div>
                  <div className="font-display text-sm font-bold text-foreground">{item.author}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.role} · {item.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. High-Impact Closing CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-background md:p-16">
          <div className="absolute inset-0 opacity-15">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand" /> Join the BizFindly Ecosystem
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight md:text-5xl text-background leading-tight">
              Ready to find your next favorite place or list your business?
            </h2>
            <p className="mt-3 text-sm opacity-90 md:text-base leading-relaxed">
              Join thousands of daily explorers using BizFindly to uncover Bangladesh&apos;s best dining spots,
              weekend getaways, and fitness destinations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-brand-foreground shadow-soft transition hover:scale-105"
              >
                <Sparkles className="h-4 w-4" /> Try AI Finder
              </Link>
              <Link
                href="/list-business"
                className="inline-flex items-center gap-2 rounded-xl border border-background/30 bg-background/10 px-6 py-3.5 text-sm font-bold text-background backdrop-blur transition hover:bg-background/20"
              >
                <Store className="h-4 w-4" /> List Your Business Free
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-background/80 hover:text-background"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
