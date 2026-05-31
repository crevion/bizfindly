import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { AuthGate } from "@/components/auth/AuthGate";
import { submitClaim } from "@/lib/verification";
import {
  CATEGORIES,
  CATEGORY_LIST,
  type CategoryConfig,
  type ListingCategory,
  type ListingDraft,
  emptyDraft,
  loadDraft,
  publishListing,
  saveDraft,
} from "@/lib/listingCategories";

export const Route = createFileRoute("/list-business")({
  component: ListBusiness,
  head: () => ({
    meta: [
      { title: "List your business — BizFindly" },
      {
        name: "description",
        content:
          "List your restaurant, resort or gym on BizFindly with our smart, AI-assisted onboarding.",
      },
    ],
  }),
});

type StepId =
  | "category"
  | "basics"
  | "details"
  | "facilities"
  | "tags"
  | "images"
  | "description"
  | "preview"
  | "done";

const STEPS: { id: StepId; label: string }[] = [
  { id: "category", label: "Category" },
  { id: "basics", label: "Basics" },
  { id: "details", label: "Details" },
  { id: "facilities", label: "Facilities" },
  { id: "tags", label: "Tags" },
  { id: "images", label: "Photos" },
  { id: "description", label: "Story" },
  { id: "preview", label: "Preview" },
];

const STEP_KEY = "bizfindly:listing-step";

function ListBusiness() {
  const { user, hydrated: authHydrated } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ListingDraft>(emptyDraft);
  const [stepIdx, setStepIdx] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "done" | "error">("idle");
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Restore draft + exact step after auth (also runs on first hydrate if already signed in)
  useEffect(() => {
    if (!user) return;
    const d = loadDraft();
    setDraft(d);
    try {
      const savedStep = typeof window !== "undefined" ? localStorage.getItem(STEP_KEY) : null;
      const idx = savedStep ? parseInt(savedStep, 10) : NaN;
      if (Number.isFinite(idx) && idx >= 0 && idx < STEPS.length) {
        setStepIdx(idx);
      } else if (d.category) {
        setStepIdx(1);
      }
    } catch {
      if (d.category) setStepIdx(1);
    }
    setHydrated(true);
  }, [user]);

  // Persist draft
  useEffect(() => {
    if (hydrated && publishState === "idle") saveDraft(draft);
  }, [draft, hydrated, publishState]);

  // Persist current step so we can resume on the exact step after sign-in
  useEffect(() => {
    if (!hydrated || publishState !== "idle") return;
    try {
      localStorage.setItem(STEP_KEY, String(stepIdx));
    } catch {
      /* ignore */
    }
  }, [stepIdx, hydrated, publishState]);

  if (!authHydrated) {
    return <div className="flex min-h-screen items-center justify-center bg-background" />;
  }
  if (!user) {
    return (
      <AuthGate
        title="Sign in to list your business"
        subtitle="Reach thousands of discovery users in Bangladesh. Sign in with Google or your mobile number to continue."
      />
    );
  }

  const cfg = draft.category ? CATEGORIES[draft.category] : null;
  const isDone = publishState === "done";
  const step = STEPS[stepIdx] ?? STEPS[STEPS.length - 1];
  const progress = ((stepIdx + 1) / STEPS.length) * 100;

  const update = (patch: Partial<ListingDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const next = () => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
  const back = () => {
    if (stepIdx === 0) navigate({ to: "/" });
    else setStepIdx((i) => i - 1);
  };

  const canContinue = useMemo(() => {
    switch (step.id) {
      case "category":
        return !!draft.category;
      case "basics":
        return draft.name.trim().length > 1 && draft.location.trim().length > 1;
      case "details":
        return (
          draft.priceMin.trim().length > 0 &&
          draft.priceMax.trim().length > 0 &&
          draft.hours.trim().length > 0
        );
      case "facilities":
      case "tags":
        return true;
      case "images":
        return Object.values(draft.images).some((arr) => arr && arr.length > 0);
      case "description":
        return draft.description.trim().length > 10;
      default:
        return true;
    }
  }, [step.id, draft]);

  const onPublish = async () => {
    if (publishState === "publishing") return;
    setPublishState("publishing");
    setPublishError(null);
    try {
      // Simulate async publish for smooth transition
      await new Promise((r) => setTimeout(r, 900));
      const final = publishListing(draft);
      // Auto-create a pending verification claim for the publishing owner
      if (user && final.id) {
        try {
          submitClaim({
            placeId: final.id,
            placeName: final.name,
            ownerId: user.id,
            ownerName: user.name,
            ownerEmail: user.email || "",
            ownerPhone: user.phone || "",
            ownerRole: "Owner",
            businessAddress: final.location,
            documents: [],
            social: {},
          });
        } catch {
          /* non-fatal */
        }
      }
      setPublishedId(final.id ?? null);
      setPublishState("done");
      try {
        localStorage.removeItem(STEP_KEY);
      } catch {
        /* ignore */
      }
    } catch (e) {
      console.error("publish failed", e);
      setPublishError("Something went wrong while submitting your listing. Please try again.");
      setPublishState("error");
    }
  };

  if (isDone && cfg) {
    return <SuccessScreen draft={draft} cfg={cfg} listingId={publishedId} />;
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3 md:px-8">
        <button
          onClick={back}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-foreground/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
            <Sparkles className="h-4 w-4 text-brand-foreground" />
          </span>
          <span className="font-display text-base font-bold">List your business</span>
        </div>
        <Link
          to="/"
          className="rounded-full px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Link>
      </header>

      {/* Progress */}
      <div className="px-4 pt-3 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>
              Step {stepIdx + 1} of {STEPS.length} · {step.label}
            </span>
            <span>Autosaved</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full gradient-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-12">
        <div key={step.id} className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          {step.id === "category" && (
            <CategoryStep
              value={draft.category}
              onSelect={(c) => {
                update({ category: c });
                setTimeout(next, 250);
              }}
            />
          )}
          {step.id === "basics" && cfg && (
            <BasicsStep cfg={cfg} draft={draft} update={update} />
          )}
          {step.id === "details" && cfg && (
            <DetailsStep cfg={cfg} draft={draft} update={update} />
          )}
          {step.id === "facilities" && cfg && (
            <FacilitiesStep cfg={cfg} draft={draft} update={update} />
          )}
          {step.id === "tags" && cfg && (
            <TagsStep cfg={cfg} draft={draft} update={update} />
          )}
          {step.id === "images" && cfg && (
            <ImagesStep cfg={cfg} draft={draft} update={update} />
          )}
          {step.id === "description" && cfg && (
            <DescriptionStep cfg={cfg} draft={draft} update={update} />
          )}
          {step.id === "preview" && cfg && (
            <PreviewStep cfg={cfg} draft={draft} />
          )}

          {publishError && (
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {publishError}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <footer className="border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            onClick={back}
            disabled={publishState === "publishing"}
            className="rounded-full px-5 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Back
          </button>
          {step.id === "preview" ? (
            <button
              onClick={onPublish}
              disabled={publishState === "publishing"}
              className="inline-flex items-center gap-2 rounded-full gradient-brand px-7 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition hover:opacity-95 disabled:opacity-80"
            >
              {publishState === "publishing" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground" />
                  Publishing your business…
                </>
              ) : (
                <>
                  Publish listing <Check className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!canContinue}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition",
                canContinue
                  ? "gradient-brand text-brand-foreground shadow-glow hover:opacity-95"
                  : "bg-muted text-muted-foreground",
              )}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function SuccessScreen({
  draft,
  cfg,
  listingId,
}: {
  draft: ListingDraft;
  cfg: CategoryConfig;
  listingId: string | null;
}) {
  const hero = Object.values(draft.images).flat()[0] || cfg.image;
  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.6)]">
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Your business has been submitted successfully.
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
          Our team will review your listing shortly. You'll get a notification the moment it goes live.
        </p>

        {/* Thumbnail preview */}
        <div className="mt-8 w-full overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="relative h-40 w-full">
            <img src={hero} alt={draft.name} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-white">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
                {cfg.label} · Pending review
              </div>
              <div className="font-display text-lg font-bold leading-tight">
                {draft.name || "Your business"}
              </div>
              <div className="flex items-center gap-1 text-xs opacity-90">
                <MapPin className="h-3 w-3" /> {draft.location || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow"
          >
            View Dashboard <ChevronRight className="h-4 w-4" />
          </Link>
          {listingId && (
            <Link
              to="/list-business"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold"
            >
              Edit Listing
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Steps ---------------- */

function StepHeader({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs font-semibold uppercase tracking-wider text-brand">{kicker}</div>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
        {title}
      </h1>
      {sub && <p className="mt-2 text-sm text-muted-foreground md:text-base">{sub}</p>}
    </div>
  );
}

function CategoryStep({
  value,
  onSelect,
}: {
  value: ListingCategory | null;
  onSelect: (c: ListingCategory) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker="Step 1"
        title="What would you like to list?"
        sub="Pick a category — we'll tailor the next steps to your business."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {CATEGORY_LIST.map((c) => {
          const Icon = c.icon;
          const active = value === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={cn(
                "group relative aspect-[4/5] overflow-hidden rounded-3xl text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow md:aspect-[3/4]",
                active && "ring-2 ring-brand ring-offset-2 ring-offset-background",
              )}
            >
              <img
                src={c.image}
                alt={c.label}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t opacity-90",
                  c.gradient,
                )}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <Icon className="h-5 w-5" />
                  </span>
                  {active && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-foreground">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold leading-tight">
                    {c.label}
                  </div>
                  <div className="mt-1 text-sm opacity-90">{c.tagline}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm font-semibold text-foreground">{label}</div>
      {children}
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

function PriceInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-muted-foreground">
        ৳
      </span>
      <input
        aria-label={ariaLabel}
        inputMode="numeric"
        className={cn(inputCls, "pl-9")}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
      />
    </div>
  );
}

function BasicsStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker={`Step 2 · ${cfg.label}`}
        title="Let's start with the basics"
        sub="The essentials people need to find and contact you."
      />
      <div className="space-y-5">
        <Field label={cfg.nameLabel}>
          <input
            className={inputCls}
            placeholder={`e.g. ${cfg.label === "Restaurant" ? "Noor Rooftop" : cfg.label === "Resort" ? "Sahara Beach Resort" : "Iron Pulse Fitness"}`}
            value={draft.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </Field>

        {cfg.id === "restaurant" && (
          <Field label="Cuisine type" hint="Comma-separated">
            <input
              className={inputCls}
              placeholder="Bangla, Continental, Italian"
              value={draft.cuisine || ""}
              onChange={(e) => update({ cuisine: e.target.value })}
            />
          </Field>
        )}

        <Field label="Address / Location">
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={cn(inputCls, "pl-11")}
              placeholder="Street address, city"
              value={draft.location}
              onChange={(e) => update({ location: e.target.value })}
            />
          </div>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Area">
            <input
              className={inputCls}
              placeholder="Gulshan, Cox's Bazar, Banani…"
              value={draft.area}
              onChange={(e) => update({ area: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={cn(inputCls, "pl-11")}
                placeholder="+880 1700 000000"
                value={draft.phone}
                onChange={(e) => update({ phone: e.target.value })}
              />
            </div>
          </Field>
        </div>

        <Field label="Google Maps URL" hint="Optional — paste a share link">
          <input
            className={inputCls}
            placeholder="https://maps.google.com/…"
            value={draft.mapUrl}
            onChange={(e) => update({ mapUrl: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}

function DetailsStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker={`Step 3 · ${cfg.label}`}
        title="Pricing & hours"
        sub="Set guest expectations up front."
      />
      <div className="space-y-5">
        <div>
          <div className="mb-1.5 text-sm font-semibold text-foreground">
            {cfg.pricingLabel} <span className="text-muted-foreground">· price range</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PriceInput
              placeholder={cfg.priceMinPlaceholder}
              value={draft.priceMin}
              onChange={(v) => update({ priceMin: v, pricing: `৳${v}${draft.priceMax ? ` – ৳${draft.priceMax}` : ""}` })}
              ariaLabel="Starting price"
            />
            <PriceInput
              placeholder={cfg.priceMaxPlaceholder}
              value={draft.priceMax}
              onChange={(v) => update({ priceMax: v, pricing: `৳${draft.priceMin || "?"} – ৳${v}` })}
              ariaLabel="Maximum price"
            />
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">
            Helps with smart filtering and AI recommendations.
          </div>
        </div>

        {cfg.id === "resort" ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Check-in">
                <input
                  className={inputCls}
                  placeholder="2:00 PM"
                  value={draft.checkIn || ""}
                  onChange={(e) => update({ checkIn: e.target.value })}
                />
              </Field>
              <Field label="Check-out">
                <input
                  className={inputCls}
                  placeholder="12:00 PM"
                  value={draft.checkOut || ""}
                  onChange={(e) => update({ checkOut: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Number of rooms">
              <input
                className={inputCls}
                type="number"
                placeholder="24"
                value={draft.rooms || ""}
                onChange={(e) => update({ rooms: e.target.value })}
              />
            </Field>
            <Field label="Reception hours">
              <input
                className={inputCls}
                placeholder="24/7 Reception"
                value={draft.hours}
                onChange={(e) => update({ hours: e.target.value })}
              />
            </Field>
          </>
        ) : (
          <Field label="Opening hours">
            <input
              className={inputCls}
              placeholder={cfg.id === "gym" ? "6:00 AM – 11:00 PM" : "12:00 PM – 11:30 PM"}
              value={draft.hours}
              onChange={(e) => update({ hours: e.target.value })}
            />
          </Field>
        )}
      </div>
    </div>
  );
}

function FacilitiesStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  const toggle = (key: string) =>
    update({
      facilities: { ...draft.facilities, [key]: !draft.facilities[key] },
    });
  return (
    <div>
      <StepHeader
        kicker={`Step 4 · ${cfg.label}`}
        title="What facilities do you offer?"
        sub="Tap everything that applies — these power smart filters."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {cfg.facilities.map((f) => {
          const active = !!draft.facilities[f.key];
          return (
            <button
              key={f.key}
              onClick={() => toggle(f.key)}
              className={cn(
                "group flex items-center justify-between rounded-2xl border-2 px-4 py-4 text-left text-sm font-semibold transition",
                active
                  ? "border-brand bg-brand/5 text-foreground"
                  : "border-border bg-surface text-foreground hover:border-foreground/30",
              )}
            >
              <span>{f.label}</span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition",
                  active ? "gradient-brand text-brand-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {active ? <Check className="h-3.5 w-3.5" /> : <span className="block h-2 w-2 rounded-full bg-current opacity-30" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TagsStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  const toggle = (t: string) => {
    const has = draft.tags.includes(t);
    update({ tags: has ? draft.tags.filter((x) => x !== t) : [...draft.tags, t] });
  };

  const aiSuggest = () => {
    // Simple heuristic AI suggestions based on facilities + category
    const suggestions = new Set<string>();
    if (cfg.id === "restaurant") {
      if (draft.facilities.rooftop) suggestions.add("Rooftop Dining");
      if (draft.facilities.kids) suggestions.add("Family Friendly");
      if (draft.facilities.buffet) suggestions.add("Buffet");
      if (draft.facilities.liveMusic) suggestions.add("Couple Friendly");
      if (!draft.facilities.buffet) suggestions.add("Instagrammable");
    }
    if (cfg.id === "resort") {
      if (draft.facilities.pool) suggestions.add("Luxury Resort");
      if (draft.facilities.couple) suggestions.add("Couple Retreat");
      if (draft.facilities.family) suggestions.add("Family Resort");
      suggestions.add("Staycation");
    }
    if (cfg.id === "gym") {
      if (draft.facilities.femaleTrainer) suggestions.add("Women Only");
      if (draft.facilities.trainer) suggestions.add("Beginner Friendly");
      suggestions.add("Mixed Gym");
      suggestions.add("Premium Fitness");
    }
    const merged = Array.from(new Set([...draft.tags, ...suggestions]));
    update({ tags: merged });
  };

  return (
    <div>
      <StepHeader
        kicker={`Step 5 · ${cfg.label}`}
        title="Pick a few vibe tags"
        sub="Help us match you with the right people."
      />
      <button
        onClick={aiSuggest}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/20"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Suggest tags with AI
      </button>
      <div className="flex flex-wrap gap-2">
        {cfg.tags.map((t) => {
          const active = draft.tags.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-foreground hover:border-foreground/40",
              )}
            >
              <Tag className="mr-1.5 inline h-3.5 w-3.5 opacity-70" />
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ImagesStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker={`Step 6 · ${cfg.label}`}
        title="Upload your photos"
        sub="Visuals make or break a listing. Drag & drop or tap to upload."
      />
      <div className="space-y-6">
        {cfg.imageGroups.map((g) => (
          <ImageDropzone
            key={g.key}
            label={g.label}
            files={draft.images[g.key] || []}
            onChange={(files) =>
              update({ images: { ...draft.images, [g.key]: files } })
            }
          />
        ))}
      </div>
    </div>
  );
}

function ImageDropzone({
  label,
  files,
  onChange,
}: {
  label: string;
  files: string[];
  onChange: (files: string[]) => void;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).slice(0, 6);
    const dataUrls = await Promise.all(
      arr.map(
        (f) =>
          new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.onerror = rej;
            r.readAsDataURL(f);
          }),
      ),
    );
    onChange([...files, ...dataUrls].slice(0, 8));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{files.length}/8</div>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition",
          drag
            ? "border-brand bg-brand/5"
            : "border-border bg-surface hover:border-foreground/30",
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Upload className="h-5 w-5" />
        </span>
        <div className="text-sm font-semibold">Drag photos here</div>
        <div className="text-xs text-muted-foreground">or click to browse · JPG, PNG up to 5MB</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4">
          {files.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DescriptionStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const facKeys = Object.entries(draft.facilities)
        .filter(([, v]) => v)
        .map(([k]) => k);
      const facLabels = cfg.facilities
        .filter((f) => facKeys.includes(f.key))
        .map((f) => f.label.toLowerCase());
      const tagPart = draft.tags.slice(0, 3).join(", ").toLowerCase();
      const facPart = facLabels.slice(0, 3).join(", ");
      const generated =
        cfg.id === "restaurant"
          ? `${draft.name || "This spot"} in ${draft.area || draft.location || "the city"} blends ${draft.cuisine || "modern"} flavours with ${facPart || "warm hospitality"}. Perfect for ${tagPart || "everyday cravings"} — built around a memorable guest experience.`
          : cfg.id === "resort"
            ? `Escape to ${draft.name || "our resort"} in ${draft.area || draft.location || "a stunning location"}. Featuring ${facPart || "premium amenities"}, our property is designed for ${tagPart || "couples, families and friends"} looking to unwind in style.`
            : `${draft.name || "Our gym"} in ${draft.area || draft.location || "your neighbourhood"} offers ${facPart || "modern equipment"} with a community-driven vibe. Ideal for ${tagPart || "all fitness levels"}.`;
      update({ description: generated });
      setGenerating(false);
    }, 900);
  };

  return (
    <div>
      <StepHeader
        kicker={`Step 7 · ${cfg.label}`}
        title="Tell your story"
        sub="A short, honest description converts best. Or let AI draft one for you."
      />
      <div className="space-y-3">
        <button
          onClick={generate}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/20 disabled:opacity-60"
        >
          <Sparkles className={cn("h-3.5 w-3.5", generating && "animate-pulse")} />
          {generating ? "Generating…" : "Generate with AI"}
        </button>
        <textarea
          className={cn(inputCls, "min-h-[180px] resize-none leading-relaxed")}
          placeholder="What makes your business special? Vibe, food, ambiance, story…"
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
        />
        <div className="text-xs text-muted-foreground">
          {draft.description.length} characters · ~{Math.max(1, Math.round(draft.description.length / 5))} words
        </div>
      </div>
    </div>
  );
}

function PreviewStep({ cfg, draft }: { cfg: CategoryConfig; draft: ListingDraft }) {
  const allImages = Object.values(draft.images).flat();
  const hero = allImages[0] || cfg.image;
  const facLabels = cfg.facilities
    .filter((f) => draft.facilities[f.key])
    .map((f) => f.label);

  return (
    <div>
      <StepHeader
        kicker="Almost there"
        title="Live preview"
        sub="This is what people will see. Looks good? Hit publish."
      />
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="relative h-56 w-full md:h-72">
          <img src={hero} alt={draft.name} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">{cfg.label}</span>
              {draft.tags.slice(0, 2).map((t) => (
                <span key={t} className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{draft.name || "Your business"}</div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="h-3.5 w-3.5" /> {draft.location || "Location"}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Star className="h-4 w-4 fill-brand text-brand" /> New
            </span>
            <span>·</span>
            <span>{draft.pricing || "Pricing"}</span>
            <span>·</span>
            <span>{draft.hours || "Hours"}</span>
          </div>

          <div className="mt-4 rounded-2xl border border-brand/20 bg-brand/5 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
              <Sparkles className="h-3.5 w-3.5" /> AI SUMMARY
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">
              {draft.description || "Your business description will appear here."}
            </p>
          </div>

          {facLabels.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Facilities
              </div>
              <div className="flex flex-wrap gap-2">
                {facLabels.map((f) => (
                  <span key={f} className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {allImages.length > 1 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Gallery
              </div>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                {allImages.slice(1, 9).map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {draft.mapUrl && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm">
              <MapPin className="h-4 w-4 text-brand" />
              <a href={draft.mapUrl} target="_blank" rel="noreferrer" className="truncate text-foreground hover:underline">
                {draft.mapUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
