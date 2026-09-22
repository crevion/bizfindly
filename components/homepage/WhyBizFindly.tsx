export function WhyBizFindly() {
  const stats = [
    {
      stat: "2,400+",
      label: "Verified businesses",
      desc: "Every listing reviewed by our team.",
    },
    {
      stat: "12k+",
      label: "Real reviews",
      desc: "From locals, tourists and regulars.",
    },
    {
      stat: "98%",
      label: "Owner claimed",
      desc: "Direct answers from the businesses themselves.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="mb-10 max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Why BizFindly
        </h2>
        <p className="mt-3 text-muted-foreground">
          A curated, verified network of places across Bangladesh — powered by real reviews and
          AI-matched recommendations.
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