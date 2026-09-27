export function WhyBizFindly({ counts }: { counts: (number | undefined)[] }) {
  const stats = [
    { label: "Restaurants", desc: "Find a spot for your next meal." },
    { label: "Resorts", desc: "Explore places for your next getaway." },
    { label: "Gyms", desc: "Find a space for your fitness goals." },
  ].map((item, index) => ({ ...item, stat: counts[index]?.toLocaleString() ?? "—" }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="mb-10 max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Why BizFindly
        </h2>
        <p className="mt-3 text-muted-foreground">
          Explore businesses across Bangladesh. Listing totals update from our directory.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="font-display text-3xl font-bold text-foreground">{s.stat}</div>
            <div className="mt-1 text-sm font-semibold text-foreground">{s.label}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}