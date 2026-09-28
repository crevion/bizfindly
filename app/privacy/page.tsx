import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — BizFindly",
  description:
    "Learn how BizFindly protects and manages your personal data, privacy rights, and AI discovery preferences.",
};

const SECTIONS = [
  {
    id: "information-collected",
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, including:
• Account Information: Name, email address, password, profile photo, and contact details.
• Business Profile Data: When submitting or claiming a business, we collect business name, trade license documentation, phone numbers, menus, and operating hours.
• Usage and Device Data: IP address, device type, browser settings, operating system, and interaction data (e.g. places saved, search keywords).
• Location Information: With your explicit permission, we collect approximate or precise location coordinates to show nearby places and accurate distances.`,
  },
  {
    id: "how-we-use-info",
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:
• Provide, maintain, and optimize BizFindly's discovery and recommendation features.
• Deliver personalized AI search results based on your preferences, mood, and past searches.
• Verify business ownership and maintain genuine ratings and reviews.
• Prevent fraud, spam, and unauthorized account access.
• Communicate service updates, account notices, and customer support responses.`,
  },
  {
    id: "cookies-and-tracking",
    title: "3. Cookies & Local Storage",
    content: `We use cookies, local storage, and similar technologies to remember your preferences (such as dark mode, saved venues, and filter options), analyze traffic, and ensure session authentication. You can configure your browser to block or delete cookies, though certain features of the service may be impacted.`,
  },
  {
    id: "data-sharing",
    title: "4. Information Sharing & Disclosure",
    content: `We do not sell your personal data to third parties. We may share information only under the following circumstances:
• Public Content: Reviews, photos, and ratings you publish on public place profiles are visible to all users.
• Service Providers: Trusted third-party vendors that assist us with hosting, database management, and analytics (subject to strict confidentiality obligations).
• Legal Compliance: When required by applicable law, regulation, or legal process in Bangladesh.`,
  },
  {
    id: "security",
    title: "5. Data Security",
    content: `We employ industry-standard encryption, firewalls, and secure token authentication to safeguard your personal data. While we strive to use commercially acceptable means to protect your information, no method of transmission over the internet or electronic storage is 100% secure.`,
  },
  {
    id: "your-rights",
    title: "6. Your Privacy Rights & Choices",
    content: `You have the right to access, update, or delete your account information at any time from your Profile settings. If you wish to permanently erase your data or request a copy of your records, please reach out to our privacy team.`,
  },
  {
    id: "contact-privacy",
    title: "7. Contact Our Privacy Officer",
    content: `If you have questions, feedback, or complaints regarding this Privacy Policy or our data practices, please contact us at privacy@bizfindly.com or through our Contact page.`,
  },
];

export default function PrivacyPage() {
  console.log("trigger deployment");
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/80 bg-gradient-to-b from-card to-background py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
            <Lock className="h-3.5 w-3.5 text-brand" />
            Your Privacy Matters
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: August 2026 • We are committed to protecting your personal data and privacy.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <div className="space-y-10">
          {SECTIONS.map((sec) => (
            <div
              key={sec.id}
              id={sec.id}
              className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft"
            >
              <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
                {sec.title}
              </h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-border surface-warm p-6 md:p-8 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-brand" />
          <h3 className="mt-3 font-display text-lg font-bold text-foreground">
            Have questions about how your data is used?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            We are always here to provide clarity on our privacy policies.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-soft transition hover:scale-105"
            >
              Contact Privacy Team
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
