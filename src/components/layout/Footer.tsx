import { Link } from "@tanstack/react-router";
import { Facebook, Globe, Instagram, Twitter, Youtube } from "lucide-react";

const columns: {
  title: string;
  links: { label: string; to?: string; href?: string }[];
}[] = [
  {
    title: "Discover",
    links: [
      { label: "Restaurants", to: "/discover" },
      { label: "Resorts", to: "/discover" },
      { label: "Gyms", to: "/discover" },
      { label: "Collections", to: "/" },
      { label: "AI Discover", to: "/ai" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "List Your Business", to: "/list-business" },
      { label: "Claim Business", to: "/claim-business" },
      { label: "Business Dashboard", to: "/dashboard" },
      { label: "Advertising", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground font-display text-lg font-black">
                B
              </span>
              <span className="font-display text-xl font-bold tracking-tight">BizFindly</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-powered local discovery for restaurants, resorts and gyms across Bangladesh.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-foreground/80 transition hover:text-brand"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-foreground/80 transition hover:text-brand"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} BizFindly. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 font-medium text-foreground/80 transition hover:border-brand hover:text-brand">
              <Globe className="h-3.5 w-3.5" />
              English (BD)
            </button>
            <a href="#" className="transition hover:text-brand">
              Cookies
            </a>
            <a href="#" className="transition hover:text-brand">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
