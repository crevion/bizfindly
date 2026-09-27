import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeSection({
  title,
  subtitle,
  children,
  cta,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  cta?: { label: string; to: string };
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-sm md:text-base">{subtitle}</p>
          )}
        </div>
        {cta && (
          <Link
            href={cta.to}
            className="text-foreground hover:text-brand hidden items-center gap-1 text-sm font-semibold md:inline-flex"
          >
            {cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      {children}
    </div>
  );
}
