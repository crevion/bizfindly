"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Shield, Sparkles } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-brand/30 absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-accent/30 absolute right-0 bottom-0 h-[360px] w-[360px] rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 py-6 md:py-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="border-border/60 bg-background/60 text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm backdrop-blur transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="bg-background/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur">
            <Shield className="h-3.5 w-3.5" /> Secure sign-in
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <span className="gradient-brand shadow-glow flex h-12 w-12 items-center justify-center rounded-2xl">
            <Sparkles className="text-brand-foreground h-6 w-6" />
          </span>
          <div className="font-display text-2xl font-bold tracking-tight">
            Biz<span className="text-gradient-brand">Findly</span>
          </div>
        </div>

        <h1 className="font-display mt-8 text-3xl leading-tight font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">{subtitle}</p>

        {children}

        <p className="text-muted-foreground mt-6 text-center text-xs">
          🔒 Your information is encrypted and never shared.
        </p>
      </div>
    </div>
  );
}
