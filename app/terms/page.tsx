import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Shield, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions — BizFindly",
  description:
    "Review the terms and conditions governing the use of BizFindly's website, mobile apps, and discovery services.",
};

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using BizFindly (the "Service", "Platform", "we", "us", or "our"), you agree to be bound by these Terms & Conditions ("Terms"). If you disagree with any part of the terms, you may not access or use the Service. These terms apply to all visitors, registered users, business owners, and others who access the Service.`,
  },
  {
    id: "eligibility",
    title: "2. User Accounts & Registration",
    content: `To access certain features such as saving places, submitting reviews, or claiming a business profile, you may need to register an account. You agree to provide accurate, current, and complete information during registration and to keep this information updated. You are responsible for safeguarding your credentials and for all activities occurring under your account.`,
  },
  {
    id: "business-listings",
    title: "3. Business Listings & Owner Verification",
    content: `Business owners or authorized representatives may submit new listings or claim existing listings on BizFindly. By listing or claiming a venue, you warrant that:
• You are authorized to manage the business listing.
• All information submitted (menus, operating hours, amenities, pricing, photos) is accurate and not deceptive.
• BizFindly reserves the right to verify, edit, reject, or remove any listing at our sole discretion to maintain platform quality and safety.`,
  },
  {
    id: "user-content",
    title: "4. User Content & Review Guidelines",
    content: `Users may submit reviews, photos, ratings, and tags ("User Content"). By submitting User Content, you grant BizFindly a non-exclusive, worldwide, royalty-free, perpetual license to use, display, and distribute such content.
You agree not to post User Content that:
• Is fraudulent, defamatory, offensive, or harassing.
• Is posted in exchange for financial compensation or incentives from the business.
• Infringes any third-party copyright, trademark, or intellectual property rights.
BizFindly reserves the right to moderate or delete reviews that violate these standards.`,
  },
  {
    id: "ai-services",
    title: "5. AI Discovery & Recommendations",
    content: `BizFindly provides AI-generated suggestions, mood matching, and automated summaries. While we strive to provide helpful and up-to-date recommendations, AI-generated content is provided for informational purposes only. We do not guarantee that AI summaries will be 100% error-free or represent current venue conditions at all times.`,
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property",
    content: `The Service and its original content (excluding User Content and business-owned trademarks), features, and functionality are and will remain the exclusive property of BizFindly and its licensors. Our logos, brand names, and software algorithms may not be copied, reproduced, or distributed without prior written consent.`,
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, BizFindly shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your access to or use of the platform, venue visits, or third-party offerings.`,
  },
  {
    id: "changes",
    title: "8. Changes to Terms",
    content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Material changes will be indicated with an updated "Last modified" date. Your continued use of the Service following the posting of changes constitutes acceptance of the new Terms.`,
  },
  {
    id: "contact",
    title: "9. Contact Us",
    content: `If you have any questions or concerns regarding these Terms & Conditions, please contact us via our Contact Page or email us at legal@bizfindly.com.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/80 bg-gradient-to-b from-card to-background py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
            <FileText className="h-3.5 w-3.5 text-brand" />
            Legal Agreement
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last modified: August 2026 • Please read these terms carefully before using BizFindly.
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
          <Shield className="mx-auto h-8 w-8 text-brand" />
          <h3 className="mt-3 font-display text-lg font-bold text-foreground">
            Have questions about our terms?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Our support and legal team is here to assist you.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-soft transition hover:scale-105"
            >
              Contact Support
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
