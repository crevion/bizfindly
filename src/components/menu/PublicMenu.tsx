import { useMemo, useState } from "react";
import { Flame, Leaf, Search, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import {
  discountPercent,
  formatPrice,
  loadMenu,
  type MenuCategory,
} from "@/lib/menu";

interface PublicMenuProps {
  restaurantId: string;
  fallback?: { category: string; items: { name: string; price: string }[] }[];
}

export function PublicMenu({ restaurantId, fallback }: PublicMenuProps) {
  const stored = useMemo(() => loadMenu(restaurantId), [restaurantId]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(stored[0]?.id ?? null);

  if (stored.length === 0) {
    if (!fallback || fallback.length === 0) {
      return (
        <div className="mt-4 rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <UtensilsCrossed className="mx-auto h-6 w-6 text-muted-foreground" />
          <div className="mt-2 text-sm font-semibold">Menu coming soon</div>
          <p className="text-xs text-muted-foreground">
            The owner hasn't published a menu yet.
          </p>
        </div>
      );
    }
    return (
      <div className="mt-4 space-y-6">
        {fallback.map((cat) => (
          <div key={cat.category}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {cat.category}
            </h3>
            <div className="mt-2 divide-y divide-border rounded-2xl bg-card shadow-soft">
              {cat.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-4">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-semibold text-brand">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const filtered: MenuCategory[] = search.trim()
    ? stored
        .map((c) => ({
          ...c,
          products: c.products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()),
          ),
        }))
        .filter((c) => c.products.length > 0)
    : stored;

  return (
    <div className="mt-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu…"
          className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3 text-sm shadow-soft outline-none focus:border-foreground/30"
        />
      </div>

      <div className="no-scrollbar sticky top-16 z-10 -mx-1 mt-3 flex gap-2 overflow-x-auto bg-background/85 px-1 py-2 backdrop-blur">
        {filtered.map((c) => (
          <a
            key={c.id}
            href={`#cat-${c.id}`}
            onClick={() => setActiveCat(c.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              activeCat === c.id
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface"
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>

      <div className="mt-4 space-y-8">
        {filtered.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`}>
            <h3 className="font-display text-xl font-bold">{cat.name}</h3>
            {cat.description && (
              <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
            )}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {cat.products.map((p) => {
                const off = discountPercent(p.price, p.originalPrice);
                const unavailable = p.status === "out";
                return (
                  <article
                    key={p.id}
                    className={`group relative flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition hover:border-foreground/20 ${
                      unavailable ? "opacity-60" : ""
                    }`}
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <UtensilsCrossed className="h-5 w-5" />
                        </div>
                      )}
                      {off > 0 && (
                        <span className="absolute left-1 top-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          {off}% off
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-1 font-semibold">{p.name}</h4>
                        <div className="flex items-center gap-1 text-xs">
                          {p.flags.bestseller && (
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          )}
                          {p.flags.veg && <Leaf className="h-3.5 w-3.5 text-emerald-600" />}
                          {p.flags.spicy && <Flame className="h-3.5 w-3.5 text-rose-600" />}
                          {p.flags.chef && (
                            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                          )}
                        </div>
                      </div>
                      {p.shortDescription && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {p.shortDescription}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-bold">{formatPrice(p.price)}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                        {p.flags.new && (
                          <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase text-brand">
                            New
                          </span>
                        )}
                        {unavailable && (
                          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">
                            Sold out
                          </span>
                        )}
                        {p.status === "seasonal" && (
                          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">
                            Seasonal
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
