import Link from "next/link";

const shortcutImg = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export function CategoryShortcuts() {
  const shortcuts = [
    {
      label: "Restaurants",
      to: "/discover?cat=restaurant",
      img: shortcutImg("photo-1517248135467-4c7edcad34c4"),
      count: "3.4k+",
    },
    {
      label: "Resorts",
      to: "/discover?cat=resort",
      img: shortcutImg("photo-1469854523086-cc02fe5d8800"),
      count: "320+",
    },
    {
      label: "Gyms",
      to: "/discover?cat=gym",
      img: shortcutImg("photo-1534438327276-14e5300c3a48"),
      count: "180+",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold md:text-3xl">Explore by category</h2>
        <p className="text-muted-foreground mt-2">Browse restaurants, resorts and gyms across Bangladesh</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {shortcuts.map((c) => (
          <Link
            key={c.label}
            href={c.to}
            className="group shadow-card relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-[16/9]"
          >
            <img
              src={c.img}
              alt={c.label}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="font-display text-2xl font-bold md:text-3xl">{c.label}</div>
              <div className="mt-1 text-sm opacity-90">{c.count} places</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
