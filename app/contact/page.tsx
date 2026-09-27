"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Building2, HelpCircle, Mail, MessageSquare, Send, Store } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/backend/api";
import { contactApi, type ContactInput } from "@/lib/backend/contact/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const page = useQuery({ queryKey: ["contact-page"], queryFn: contactApi.page, retry: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };
    setFieldErrors({});
    setResult(null);
    if (!payload.name || !payload.email || !payload.message) {
      setResult({ success: false, message: "Please fill in all required fields." });
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    try {
      const response = await contactApi.submit(payload);
      setResult({ success: true, message: response.detail });
      toast.success(response.detail);
      setFormData({ name: "", email: "", topic: "general", message: "" });
    } catch (error) {
      if (error instanceof ApiError && error.data && typeof error.data === "object") {
        const errors: Partial<Record<keyof ContactInput, string>> = {};
        for (const key of ["name", "email", "topic", "message"] as const) {
          const value = (error.data as Record<string, unknown>)[key];
          if (Array.isArray(value)) errors[key] = value.join(" ");
        }
        setFieldErrors(errors);
      }
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to send your message. Please try again.",
      });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  if (page.isPending)
    return (
      <div className="mx-auto max-w-7xl px-4 py-16" role="status">
        Loading contact information…
      </div>
    );
  if (page.isError)
    return (
      <div className="mx-auto max-w-7xl px-4 py-16" role="alert">
        <p>{page.error.message}</p>
        <button onClick={() => void page.refetch()} className="mt-3 underline">
          Try again
        </button>
      </div>
    );
  const contact = page.data;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="border-border/80 from-card to-background border-b bg-gradient-to-b py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="border-border bg-card text-muted-foreground shadow-soft inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold">
            <MessageSquare className="text-brand h-3.5 w-3.5" />
            We&apos;re Here to Help
          </span>
          <h1 className="font-display mt-5 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Get in touch with <span className="text-brand">BizFindly</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base">
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
              <h2 className="font-display text-foreground text-2xl font-bold tracking-tight">
                Contact channels
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Reach out directly or select the appropriate department below.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="border-border bg-card shadow-soft flex items-start gap-4 rounded-3xl border p-5">
                <div className="bg-brand-soft text-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-foreground text-sm font-bold">
                    General Inquiries
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    For support, feedback, and press.
                  </p>
                  <a
                    href={`mailto:${contact.support_email}`}
                    className="text-brand mt-2 inline-block text-xs font-semibold hover:underline"
                  >
                    {contact.support_email}
                  </a>
                </div>
              </div>

              <div className="border-border bg-card shadow-soft flex items-start gap-4 rounded-3xl border p-5">
                <div className="bg-info/10 text-info flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-foreground text-sm font-bold">
                    Business & Verification
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Listing assistance and claiming status.
                  </p>
                  <a
                    href={`mailto:${contact.business_email}`}
                    className="text-info mt-2 inline-block text-xs font-semibold hover:underline"
                  >
                    {contact.business_email}
                  </a>
                </div>
              </div>

              <div className="border-border bg-card shadow-soft flex items-start gap-4 rounded-3xl border p-5">
                <div className="bg-brand-soft text-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-foreground text-sm font-bold">Headquarters</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">{contact.address}</p>
                  <span className="text-muted-foreground mt-2 inline-block text-xs font-medium">
                    Hours: {contact.office_hours}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Quick Links */}
            <div className="border-border surface-warm rounded-3xl border p-6">
              <h3 className="font-display text-foreground text-base font-bold">
                Looking for something specific?
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/list-business"
                  className="border-border bg-card text-foreground shadow-soft hover:border-brand hover:text-brand rounded-full border px-3.5 py-1.5 text-xs font-semibold transition"
                >
                  List a Business →
                </Link>
                <Link
                  href="/claim-business"
                  className="border-border bg-card text-foreground shadow-soft hover:border-brand hover:text-brand rounded-full border px-3.5 py-1.5 text-xs font-semibold transition"
                >
                  Claim Existing Place →
                </Link>
                <Link
                  href="/ai-discover"
                  className="border-border bg-card text-foreground shadow-soft hover:border-brand hover:text-brand rounded-full border px-3.5 py-1.5 text-xs font-semibold transition"
                >
                  Try AI Finder →
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border-border bg-card shadow-soft rounded-3xl border p-6 md:p-8">
            <h2 className="font-display text-foreground text-2xl font-bold tracking-tight">
              Send us a message
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Fill out the details and our support team will respond promptly.
            </p>

            {result && (
              <p
                role={result.success ? "status" : "alert"}
                className={`mt-4 rounded-xl border p-3 text-sm ${result.success ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
              >
                {result.message}
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <fieldset disabled={isSubmitting} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      id="contact-name"
                      maxLength={150}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahim Ahmed"
                      className="border-input bg-background text-foreground focus:border-brand focus:ring-brand/20 mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
                    />
                    {fieldErrors.name && (
                      <p id="contact-name-error" className="mt-1 text-xs text-red-600">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      id="contact-email"
                      maxLength={254}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahim@example.com"
                      className="border-input bg-background text-foreground focus:border-brand focus:ring-brand/20 mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
                    />
                    {fieldErrors.email && (
                      <p id="contact-email-error" className="mt-1 text-xs text-red-600">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                  >
                    Topic / Subject
                  </label>
                  <select
                    id="contact-topic"
                    aria-invalid={!!fieldErrors.topic}
                    aria-describedby={fieldErrors.topic ? "contact-topic-error" : undefined}
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="border-input bg-background text-foreground focus:border-brand focus:ring-brand/20 mt-1.5 w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
                  >
                    {contact.topics.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.topic && (
                    <p id="contact-topic-error" className="mt-1 text-xs text-red-600">
                      {fieldErrors.topic}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                  >
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    id="contact-message"
                    maxLength={10000}
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or how we can help..."
                    className="border-input bg-background text-foreground focus:border-brand focus:ring-brand/20 mt-1.5 w-full resize-none rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
                  />
                  {fieldErrors.message && (
                    <p id="contact-message-error" className="mt-1 text-xs text-red-600">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand text-brand-foreground shadow-soft hover:shadow-card inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {contact.faqs.length > 0 && (
        <section className="surface-warm border-border border-t py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 md:px-8">
            <div className="text-center">
              <span className="text-brand inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
              </span>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Common questions & answers
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {contact.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border-border bg-card shadow-soft rounded-2xl border p-6"
                >
                  <h3 className="font-display text-foreground text-base font-bold md:text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
