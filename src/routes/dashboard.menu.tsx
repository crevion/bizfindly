import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Flame,
  ImagePlus,
  Leaf,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AuthGate } from "@/components/auth/AuthGate";
import { loadListings, type ListingDraft } from "@/lib/listingCategories";
import {
  discountPercent,
  formatPrice,
  loadMenu,
  saveMenu,
  uid,
  type MenuCategory,
  type MenuProduct,
  type ProductStatus,
} from "@/lib/menu";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/menu")({
  component: MenuManagement,
  head: () => ({ meta: [{ title: "Menu management — BizFindly" }] }),
});

function MenuManagement() {
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingDraft[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [editing, setEditing] = useState<{ catId: string; product?: MenuProduct } | null>(null);
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    const list = loadListings().filter((l) => l.category === "restaurant");
    setListings(list);
    if (list[0]?.id) setActiveId(list[0].id);
  }, [user]);

  useEffect(() => {
    if (!activeId) return;
    setMenu(loadMenu(activeId));
  }, [activeId]);

  const updateMenu = (next: MenuCategory[]) => {
    setMenu(next);
    if (activeId) saveMenu(activeId, next);
  };

  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!user) {
    return (
      <AuthGate
        title="Sign in to manage your menu"
        subtitle="Only restaurant owners can access menu management."
      />
    );
  }

  if (listings.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand shadow-glow">
          <UtensilsCrossed className="h-7 w-7 text-brand-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Menu management is for restaurants</h1>
        <p className="mt-3 text-muted-foreground">
          List a restaurant to start building your menu. Gyms and resorts don't use this feature.
        </p>
        <Link
          to="/list-business"
          className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> List a restaurant
        </Link>
      </div>
    );
  }

  const active = listings.find((l) => l.id === activeId) || listings[0];

  const addCategory = () => {
    const name = window.prompt("Category name (e.g. Biryani, Drinks, Desserts)");
    if (!name?.trim()) return;
    updateMenu([
      ...menu,
      { id: uid("cat"), name: name.trim(), order: menu.length, products: [] },
    ]);
  };

  const deleteCategory = (id: string) => {
    if (!confirm("Delete this category and all its products?")) return;
    updateMenu(menu.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i })));
  };

  const moveCategory = (id: string, dir: -1 | 1) => {
    const idx = menu.findIndex((c) => c.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= menu.length) return;
    const next = [...menu];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    updateMenu(next.map((c, i) => ({ ...c, order: i })));
  };

  const upsertProduct = (catId: string, p: MenuProduct) => {
    updateMenu(
      menu.map((c) =>
        c.id !== catId
          ? c
          : {
              ...c,
              products: c.products.some((x) => x.id === p.id)
                ? c.products.map((x) => (x.id === p.id ? p : x))
                : [...c.products, p],
            },
      ),
    );
  };

  const deleteProduct = (catId: string, pid: string) => {
    updateMenu(
      menu.map((c) =>
        c.id !== catId ? c : { ...c, products: c.products.filter((p) => p.id !== pid) },
      ),
    );
  };

  const setStatus = (catId: string, pid: string, status: ProductStatus) => {
    updateMenu(
      menu.map((c) =>
        c.id !== catId
          ? c
          : {
              ...c,
              products: c.products.map((p) => (p.id === pid ? { ...p, status } : p)),
            },
      ),
    );
  };

  const updateCategory = (cat: MenuCategory) => {
    updateMenu(menu.map((c) => (c.id === cat.id ? cat : c)));
  };

  const filteredMenu = useMemo(() => {
    if (!search.trim()) return menu;
    const q = search.toLowerCase();
    return menu
      .map((c) => ({
        ...c,
        products: c.products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.shortDescription?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.products.length > 0);
  }, [menu, search]);

 return (
    <DashboardShell variant="owner">
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <button
        onClick={() => navigate({ to: "/dashboard" })}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">
            Restaurant tools
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">Menu management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build categories and products. Changes save automatically.
          </p>
        </div>
        <button
          onClick={addCategory}
          className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> New category
        </button>
      </div>

      {listings.length > 1 && (
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {listings.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveId(l.id!)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                l.id === active.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-foreground"
              }`}
            >
              {l.name || "Untitled"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Editor column */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items…"
              className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3 text-sm shadow-soft outline-none focus:border-foreground/30"
            />
          </div>

          {menu.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
              <UtensilsCrossed className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-3 font-display text-xl font-bold">Start your menu</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first category — e.g. <em>Popular</em>, <em>Biryani</em>, <em>Drinks</em>.
              </p>
              <button
                onClick={addCategory}
                className="mt-4 inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-glow"
              >
                <Plus className="h-4 w-4" /> New category
              </button>
            </div>
          ) : (
            filteredMenu.map((cat) => (
              <div
                key={cat.id}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-card"
              >
                <div className="flex items-center gap-2 border-b border-border p-4">
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveCategory(cat.id, -1)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveCategory(cat.id, 1)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-lg font-bold">{cat.name}</div>
                    {cat.description && (
                      <div className="text-xs text-muted-foreground">{cat.description}</div>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingCat(cat)}
                    className="rounded-full border border-border bg-surface p-2 text-muted-foreground hover:text-foreground"
                    aria-label="Edit category"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setEditing({ catId: cat.id })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add item
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="rounded-full p-2 text-muted-foreground hover:text-destructive"
                    aria-label="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {cat.products.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No items yet. Add your first dish.
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {cat.products.map((p) => {
                      const off = discountPercent(p.price, p.originalPrice);
                      return (
                        <li key={p.id} className="flex items-center gap-3 p-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                            {p.image ? (
                              <img src={p.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <ImagePlus className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-semibold">{p.name}</span>
                              {p.flags.bestseller && (
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              )}
                              {p.flags.veg && <Leaf className="h-3.5 w-3.5 text-emerald-600" />}
                              {p.flags.spicy && <Flame className="h-3.5 w-3.5 text-rose-600" />}
                              {p.flags.chef && (
                                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                              )}
                            </div>
                            {p.shortDescription && (
                              <div className="line-clamp-1 text-xs text-muted-foreground">
                                {p.shortDescription}
                              </div>
                            )}
                            <div className="mt-1 flex items-center gap-2 text-sm">
                              <span className="font-bold">{formatPrice(p.price)}</span>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <>
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(p.originalPrice)}
                                  </span>
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                    {off}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <select
                            value={p.status}
                            onChange={(e) =>
                              setStatus(cat.id, p.id, e.target.value as ProductStatus)
                            }
                            className="rounded-full border border-border bg-surface px-2 py-1 text-xs font-semibold"
                          >
                            <option value="available">Available</option>
                            <option value="out">Out of stock</option>
                            <option value="seasonal">Seasonal</option>
                          </select>
                          <button
                            onClick={() => setEditing({ catId: cat.id, product: p })}
                            className="rounded-full p-2 text-muted-foreground hover:text-foreground"
                            aria-label="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(cat.id, p.id)}
                            className="rounded-full p-2 text-muted-foreground hover:text-destructive"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Live preview</h3>
              {active.id && (
                <Link
                  to="/place/$slug"
                  params={{ slug: active.id }}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Open page →
                </Link>
              )}
            </div>
            <MenuPreview menu={menu} />
          </div>
        </aside>
      </div>

      {editing && (
        <ProductDialog
          catId={editing.catId}
          product={editing.product}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            upsertProduct(editing.catId, p);
            setEditing(null);
          }}
        />
      )}

      {editingCat && (
        <CategoryDialog
          category={editingCat}
          onClose={() => setEditingCat(null)}
          onSave={(c) => {
            updateCategory(c);
            setEditingCat(null);
          }}
        />
      )}
    </div>
    </DashboardShell>
  );
}

function MenuPreview({ menu }: { menu: MenuCategory[] }) {
  if (menu.length === 0) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        Add categories and products to see how customers will view your menu.
      </p>
    );
  }
  return (
    <div className="mt-4 space-y-5">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {menu.map((c) => (
          <span
            key={c.id}
            className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold"
          >
            {c.name}
          </span>
        ))}
      </div>
      {menu.slice(0, 2).map((c) => (
        <div key={c.id}>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {c.name}
          </div>
          <div className="mt-2 space-y-2">
            {c.products.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-2xl border border-border p-2"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{formatPrice(p.price)}</div>
                </div>
              </div>
            ))}
            {c.products.length === 0 && (
              <div className="text-xs text-muted-foreground">No items yet</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryDialog({
  category,
  onClose,
  onSave,
}: {
  category: MenuCategory;
  onClose: () => void;
  onSave: (c: MenuCategory) => void;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  return (
    <DialogShell title="Edit category" onClose={onClose}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Category name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1.5 w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm"
      />
      <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Description (optional)
      </label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-1.5 w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm"
      />
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave({ ...category, name: name.trim() || category.name, description })}
          className="rounded-full gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-glow"
        >
          Save
        </button>
      </div>
    </DialogShell>
  );
}

function ProductDialog({
  catId,
  product,
  onClose,
  onSave,
}: {
  catId: string;
  product?: MenuProduct;
  onClose: () => void;
  onSave: (p: MenuProduct) => void;
}) {
  void catId;
  const [name, setName] = useState(product?.name || "");
  const [shortDescription, setShort] = useState(product?.shortDescription || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() || "");
  const [image, setImage] = useState(product?.image);
  const [status, setStatus] = useState<ProductStatus>(product?.status || "available");
  const [flags, setFlags] = useState(product?.flags || {});
  const fileRef = useRef<HTMLInputElement>(null);

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    pickImage(e.dataTransfer.files?.[0]);
  };

  const save = () => {
    const priceNum = parseFloat(price);
    if (!name.trim() || isNaN(priceNum)) return;
    onSave({
      id: product?.id || uid("prod"),
      name: name.trim(),
      shortDescription: shortDescription.trim() || undefined,
      description: description.trim() || undefined,
      price: priceNum,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image,
      status,
      flags,
    });
  };

  const toggle = (k: keyof MenuProduct["flags"]) =>
    setFlags((f) => ({ ...f, [k]: !f[k] }));

  return (
    <DialogShell title={product ? "Edit item" : "Add item"} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface text-center text-sm text-muted-foreground transition hover:border-foreground/30"
        >
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="p-6">
              <ImagePlus className="mx-auto h-6 w-6" />
              <div className="mt-2 font-semibold">Drop image or click to upload</div>
              <div className="text-xs">PNG, JPG, WEBP</div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => pickImage(e.target.files?.[0])}
          />
        </div>

        <div className="space-y-3">
          <Field label="Product name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm"
            />
          </Field>
          <Field label="Short description">
            <input
              value={shortDescription}
              onChange={(e) => setShort(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm"
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Price (৳)">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm"
              />
            </Field>
            <Field label="Original (৳)">
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Optional"
                className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm"
              />
            </Field>
          </div>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm"
            >
              <option value="available">Available</option>
              <option value="out">Out of stock</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </Field>
        </div>
      </div>

      <Field label="Full description" className="mt-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm"
        />
      </Field>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tags
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { k: "veg", label: "Vegetarian", icon: Leaf },
            { k: "spicy", label: "Spicy", icon: Flame },
            { k: "bestseller", label: "Bestseller", icon: Star },
            { k: "chef", label: "Chef's pick", icon: Sparkles },
            { k: "new", label: "New" },
          ].map((t) => {
            const active = !!flags[t.k as keyof MenuProduct["flags"]];
            const Icon = t.icon;
            return (
              <button
                key={t.k}
                onClick={() => toggle(t.k as keyof MenuProduct["flags"])}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={save}
          className="rounded-full gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-glow"
        >
          Save item
        </button>
      </div>
    </DialogShell>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function DialogShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 md:items-center md:p-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-card p-6 shadow-card md:rounded-3xl">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
