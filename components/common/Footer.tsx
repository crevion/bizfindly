import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

const FOOTER_COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Restaurants", to: "/ai-discover?category=restaurant" },
      { label: "Resorts", to: "/ai-discover?category=resort" },
      { label: "Gyms", to: "/ai-discover?category=gym" },
      { label: "AI Finder", to: "/ai-discover" },
    ],
  },
  {
    title: "For Business",
    links: [
      { label: "List Your Business", to: "/list-business" },
      { label: "Claim Your Business", to: "/claim-business" },
      { label: "Owner Dashboard", to: "/dashboard" },
      { label: "Partner Support", to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact & Support", to: "/contact" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
  { icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com" },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 transition hover:opacity-90">
              <img
                src="/images/logo/bizfindly-logo.png"
                alt="BizFindly"
                className="h-8 w-auto md:h-9"
              />
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              AI-powered local discovery for restaurants, resorts, and gyms across Bangladesh.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="border-border bg-background text-muted-foreground hover:border-brand hover:text-brand grid h-9 w-9 place-items-center rounded-full border transition hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.to}
                      className="text-foreground/80 hover:text-brand transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border text-muted-foreground mt-12 flex flex-col items-start justify-between gap-4 border-t pt-6 text-xs md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} BizFindly. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-brand transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-brand transition">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-brand transition">
              Contact
            </Link>
            <div className="border-border bg-background text-foreground/80 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium">
              <GlobeIcon className="h-3.5 w-3.5" />
              Bangladesh
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
