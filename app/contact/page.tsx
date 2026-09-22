"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  Store,
} from "lucide-react";
import toast from "react-hot-toast";

const FAQS = [
  {
    q: "How do I list my restaurant, resort, or gym on BizFindly?",
    a: "Click on 'List Your Business' in the header. Our step-by-step onboarding wizard will guide you through adding photos, menus, hours, and facilities. It takes under 5 minutes!",
  },
  {
    q: "How does business claim verification work?",
    a: "If your business is already listed, go to 'Claim Business' to verify ownership with an official email or trade license document. Once verified, you get a verified badge and full management access.",
  },
  {
    q: "Is BizFindly free for business owners?",
    a: "Yes! Listing your business, updating menus, and receiving customer reviews is completely free on BizFindly.",
  },
  {
    q: "How does the AI Finder recommend places?",
    a: "Our AI analyzes real visitor feedback, amenities, ambiance tags, and dietary/budget parameters to match venues directly to your personal vibe and preferences.",
  },
  {
    q: "How do I report inaccurate hours or place information?",
    a: "You can submit an inquiry through this contact form with the listing URL, and our editorial team will investigate and update the records within 24 hours.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent. We'll reply within 24 hours.");
      setFormData({ name: "", email: "", topic: "general", message: "" });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/80 bg-gradient-to-b from-card to-background py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
            <MessageSquare className="h-3.5 w-3.5 text-brand" />
            We&apos;re Here to Help
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Get in touch with <span className="text-brand">BizFindly</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Have questions about listing your place, verifying ownership, or using our AI tools?
            Drop us a message!
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Contact Form */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* Info Cards */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Contact channels
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Reach out directly or select the appropriate department below.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">General Inquiries</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">For support, feedback, and press.</p>
                  <a
                    href="mailto:support@bizfindly.com"
                    className="mt-2 inline-block text-xs font-semibold text-brand hover:underline"
                  >
                    support@bizfindly.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-info/10 text-info">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">Business & Verification</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Listing assistance and claiming status.</p>
                  <a
                    href="mailto:business@bizfindly.com"
                    className="mt-2 inline-block text-xs font-semibold text-info hover:underline"
                  >
                    business@bizfindly.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">Headquarters</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Gulshan-2, Dhaka 1212, Bangladesh</p>
                  <span className="mt-2 inline-block text-xs font-medium text-muted-foreground">
                    Hours: Sun – Thu (9:00 AM – 6:00 PM)
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Quick Links */}
            <div className="rounded-3xl border border-border surface-warm p-6">
              <h3 className="font-display text-base font-bold text-foreground">
                Looking for something specific?
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/list-business"
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-soft transition hover:border-brand hover:text-brand"
                >
                  List a Business →
                </Link>
                <Link
                  href="/claim-business"
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-soft transition hover:border-brand hover:text-brand"
                >
                  Claim Existing Place →
                </Link>
                <Link
                  href="/ai"
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-soft transition hover:border-brand hover:text-brand"
                >
                  Try AI Finder →
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill out the details and our support team will respond promptly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahim Ahmed"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahim@example.com"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Topic / Subject
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none cursor-pointer"
                >
                  <option value="general">General Inquiry & Feedback</option>
                  <option value="business">Listing or Claiming a Business</option>
                  <option value="verification">Verification & Documents</option>
                  <option value="report">Report Inaccurate Information</option>
                  <option value="partnership">Partnership & Advertising</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or how we can help..."
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-brand-foreground shadow-soft transition hover:shadow-card disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="surface-warm border-t border-border py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand">
              <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Common questions & answers
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <h3 className="font-display text-base font-bold text-foreground md:text-lg">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
