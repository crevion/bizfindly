import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

export function HomeCtaStrip() {
  return (
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
            href="/list-business"
            className="btn-primary mt-6 inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            List your business <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
