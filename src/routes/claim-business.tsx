import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronRight,
  CloudUpload,
  FileText,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { AuthGate } from "@/components/auth/AuthGate";
import {
  DOC_TYPES,
  searchBusinesses,
  submitClaim,
  type SearchableBusiness,
} from "@/lib/verification";
import { VerifiedBadge } from "@/components/verification/VerifiedBadge";

export const Route = createFileRoute("/claim-business")({
  component: ClaimPage,
  head: () => ({
    meta: [
      { title: "Claim your business — BizFindly" },
      {
        name: "description",
        content:
          "Verify ownership of your restaurant, resort or gym on BizFindly. Secure document upload, fast review.",
      },
    ],
  }),
});

type StepId = "find" | "details" | "documents" | "social" | "review" | "done";

const STEPS: { id: StepId; label: string }[] = [
  { id: "find", label: "Find" },
  { id: "details", label: "Details" },
  { id: "documents", label: "Documents" },
  { id: "social", label: "Social" },
  { id: "review", label: "Review" },
];

const ROLES = ["Owner", "Co-owner", "Manager", "Authorized representative"];

function ClaimPage() {
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState<SearchableBusiness | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchableBusiness[]>([]);
  const [details, setDetails] = useState({
    name: user?.name || "",
    role: "Owner",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
  });
  const [docs, setDocs] = useState<
    Record<string, { name: string; size: number; preview?: string } | null>
  >({});
  const [social, setSocial] = useState({ facebook: "", instagram: "", website: "", googleBusiness: "" });
  const [submitting, setSubmitting] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);

  useEffect(() => {
    setResults(searchBusinesses(query));
  }, [query]);

  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!user) {
    return (
      <AuthGate
        title="Sign in to claim your business"
        subtitle="Verify ownership securely with Google or your mobile number."
      />
    );
  }

  const step = STEPS[stepIdx];
  const progress = ((stepIdx + 1) / STEPS.length) * 100;

  const canContinue = (() => {
    switch (step?.id) {
      case "find":
        return !!selected || creatingNew;
      case "details":
        return (
          details.name.trim().length > 1 &&
          details.phone.trim().length > 4 &&
          details.email.includes("@") &&
          details.address.trim().length > 3
        );
      case "documents":
        return DOC_TYPES.filter((d) => d.required).every((d) => !!docs[d.key]);
      case "social":
      case "review":
        return true;
      default:
        return false;
    }
  })();

  const next = () => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
  const back = () => {
    if (stepIdx === 0) navigate({ to: "/" });
    else setStepIdx((i) => i - 1);
  };

  const onSubmit = async () => {
    if (submitting || !user) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    const placeId = selected?.id || `new_${Date.now()}`;
    const claim = submitClaim({
      placeId,
      placeSlug: selected?.slug,
      placeName: selected?.name || details.name + "'s business",
      ownerId: user.id,
      ownerName: details.name,
      ownerEmail: details.email,
      ownerPhone: details.phone,
      ownerRole: details.role,
      businessAddress: details.address,
      documents: Object.entries(docs)
        .filter(([, v]) => v)
        .map(([key, v]) => {
          const cfg = DOC_TYPES.find((d) => d.key === key)!;
          return {
            key,
            label: cfg.label,
            name: v!.name,
            size: v!.size,
            preview: v!.preview,
          };
        }),
      social,
    });
    setDoneId(claim.id);
    setSubmitting(false);
  };

  if (doneId) return <SuccessScreen claimId={doneId} businessName={selected?.name || details.name} />;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3 md:px-8">
        <button
          onClick={back}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-foreground/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center gap-3 px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-sm font-semibold">Claim your business</div>
          </div>
          <div className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <Lock className="h-3.5 w-3.5" /> Secure verification
          </div>
        </div>
        <Link to="/" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex">
          Save & exit
        </Link>
      </header>

      {/* Progress */}
      <div className="border-b border-border/60 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="flex flex-1 items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  i <= stepIdx ? "bg-gradient-to-r from-sky-500 to-blue-600" : "bg-muted",
                )}
              />
            ))}
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            {stepIdx + 1}/{STEPS.length} · {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8 md:py-12">
          {step?.id === "find" && (
            <FindStep
              query={query}
              setQuery={setQuery}
              results={results}
              selected={selected}
              setSelected={(b) => {
                setSelected(b);
                setCreatingNew(false);
              }}
              creatingNew={creatingNew}
              onCreateNew={() => {
                setSelected(null);
                setCreatingNew(true);
              }}
            />
          )}

          {step?.id === "details" && (
            <DetailsStep details={details} setDetails={setDetails} />
          )}

          {step?.id === "documents" && (
            <DocumentsStep docs={docs} setDocs={setDocs} />
          )}

          {step?.id === "social" && <SocialStep social={social} setSocial={setSocial} />}

          {step?.id === "review" && (
            <ReviewStep
              selected={selected}
              creatingNew={creatingNew}
              details={details}
              docs={docs}
              social={social}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <button
            onClick={back}
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold"
          >
            Back
          </button>
          {step?.id === "review" ? (
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Submitting…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Submit for verification
                </>
              )}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!canContinue}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background disabled:opacity-40"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

/* ---------- STEP COMPONENTS ---------- */

function StepHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-sky-600">{eyebrow}</div>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">{sub}</p>
    </div>
  );
}

function FindStep({
  query,
  setQuery,
  results,
  selected,
  setSelected,
  creatingNew,
  onCreateNew,
}: {
  query: string;
  setQuery: (s: string) => void;
  results: SearchableBusiness[];
  selected: SearchableBusiness | null;
  setSelected: (b: SearchableBusiness) => void;
  creatingNew: boolean;
  onCreateNew: () => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 1 · Find your business"
        title="Which business do you own?"
        sub="Search by name or location, or add a new business if it's not on BizFindly yet."
      />
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:ring-2 focus-within:ring-sky-500/30">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search restaurants, resorts, gyms…"
          className="flex-1 bg-transparent text-sm outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-2">
        {results.map((b) => {
          const active = selected?.id === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelected(b)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition hover:border-foreground/30",
                active ? "border-sky-500 ring-2 ring-sky-500/30" : "border-border",
              )}
            >
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-muted">
                {b.image && <img src={b.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-semibold">{b.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  <MapPin className="mr-1 inline h-3 w-3" />
                  {b.location} · <span className="capitalize">{b.category}</span>
                </div>
              </div>
              {active && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          );
        })}
        {results.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
            No matches for "{query}".
          </div>
        )}
      </div>

      <button
        onClick={onCreateNew}
        className={cn(
          "mt-4 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed p-4 text-left transition",
          creatingNew
            ? "border-sky-500 bg-sky-500/5"
            : "border-border bg-surface hover:border-foreground/30",
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
          <Plus className="h-5 w-5" />
        </span>
        <div>
          <div className="text-sm font-semibold">Create a new business listing</div>
          <div className="text-xs text-muted-foreground">
            Don't see it? We'll create the listing during verification.
          </div>
        </div>
        {creatingNew && (
          <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white">
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    </div>
  );
}

function DetailsStep({
  details,
  setDetails,
}: {
  details: { name: string; role: string; phone: string; email: string; address: string };
  setDetails: (d: typeof details) => void;
}) {
  const set = <K extends keyof typeof details>(k: K, v: (typeof details)[K]) =>
    setDetails({ ...details, [k]: v });
  return (
    <div>
      <StepHeader
        eyebrow="Step 2 · Owner details"
        title="Tell us about you"
        sub="We use this to verify your role and contact you about the verification."
      />
      <div className="mt-6 grid gap-4">
        <Field icon={User} label="Owner full name">
          <input
            value={details.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Rahim Ahmed"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={Building2} label="Business role">
          <select
            value={details.role}
            onChange={(e) => set("role", e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field icon={Phone} label="Phone number">
            <input
              value={details.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+880 1700 000000"
              className="w-full bg-transparent text-sm outline-none"
            />
          </Field>
          <Field icon={Mail} label="Official business email">
            <input
              value={details.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="owner@business.com"
              className="w-full bg-transparent text-sm outline-none"
            />
          </Field>
        </div>
        <Field icon={MapPin} label="Business address">
          <input
            value={details.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Road 12, Banani, Dhaka"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
      </div>

      <PrivacyNote />
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:ring-2 focus-within:ring-sky-500/30">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}

function DocumentsStep({
  docs,
  setDocs,
}: {
  docs: Record<string, { name: string; size: number; preview?: string } | null>;
  setDocs: (d: typeof docs) => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 3 · Documents"
        title="Upload verification documents"
        sub="Upload at least the required documents. Files are encrypted and only used for verification."
      />
      <div className="mt-6 grid gap-3">
        {DOC_TYPES.map((d) => (
          <DocUpload
            key={d.key}
            label={d.label}
            required={d.required}
            value={docs[d.key]}
            onChange={(v) => setDocs({ ...docs, [d.key]: v })}
          />
        ))}
      </div>
      <PrivacyNote />
    </div>
  );
}

function DocUpload({
  label,
  required,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: { name: string; size: number; preview?: string } | null | undefined;
  onChange: (v: { name: string; size: number; preview?: string } | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      onChange({ name: file.name, size: file.size });
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      onChange({ name: file.name, size: file.size, preview: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
        <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted">
          {value.preview ? (
            <img src={value.preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <FileText className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">{label}</div>
          <div className="truncate text-xs text-muted-foreground">
            {value.name} · {(value.size / 1024).toFixed(0)} KB
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <Check className="h-3 w-3" /> Uploaded
        </span>
        <button
          onClick={() => onChange(null)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 border-dashed bg-surface p-3 transition",
        drag ? "border-sky-500 bg-sky-500/5" : "border-border",
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <CloudUpload className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </div>
        <div className="text-xs text-muted-foreground">
          Drag & drop, or click to upload (Image / PDF)
        </div>
      </div>
      <button
        onClick={() => ref.current?.click()}
        className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
      >
        Upload
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function SocialStep({
  social,
  setSocial,
}: {
  social: { facebook: string; instagram: string; website: string; googleBusiness: string };
  setSocial: (s: typeof social) => void;
}) {
  const set = <K extends keyof typeof social>(k: K, v: string) => setSocial({ ...social, [k]: v });
  return (
    <div>
      <StepHeader
        eyebrow="Step 4 · Social proof (optional)"
        title="Boost your trust score"
        sub="Linking your social profiles helps reviewers verify faster."
      />
      <div className="mt-6 grid gap-4">
        <Field icon={Globe} label="Website">
          <input
            value={social.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://yourbusiness.com"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={Sparkles} label="Facebook page">
          <input
            value={social.facebook}
            onChange={(e) => set("facebook", e.target.value)}
            placeholder="facebook.com/yourbusiness"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={Sparkles} label="Instagram">
          <input
            value={social.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="@yourbusiness"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={BadgeCheck} label="Google Business profile">
          <input
            value={social.googleBusiness}
            onChange={(e) => set("googleBusiness", e.target.value)}
            placeholder="Google Maps URL"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
      </div>
    </div>
  );
}

function ReviewStep({
  selected,
  creatingNew,
  details,
  docs,
  social,
}: {
  selected: SearchableBusiness | null;
  creatingNew: boolean;
  details: { name: string; role: string; phone: string; email: string; address: string };
  docs: Record<string, { name: string; size: number; preview?: string } | null>;
  social: { facebook: string; instagram: string; website: string; googleBusiness: string };
}) {
  const uploaded = useMemo(
    () => Object.entries(docs).filter(([, v]) => !!v),
    [docs],
  );
  const checks = [
    { ok: !!selected || creatingNew, label: "Business identified" },
    { ok: details.name && details.email && details.phone, label: "Owner details provided" },
    { ok: uploaded.length > 0, label: `${uploaded.length} document(s) uploaded` },
    { ok: !!(social.facebook || social.instagram || social.website), label: "Social proof linked (optional)" },
  ];
  return (
    <div>
      <StepHeader
        eyebrow="Step 5 · Review"
        title="Almost there. Review & submit."
        sub="Make sure everything below is accurate. You'll get an update within 24–48 hours."
      />
      <div className="mt-6 grid gap-4">
        <SummaryCard title="Business">
          {selected ? (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-muted">
                {selected.image && (
                  <img src={selected.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <div className="font-semibold">{selected.name}</div>
                <div className="text-xs text-muted-foreground">{selected.location}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm">New listing — will be created with your details.</div>
          )}
        </SummaryCard>

        <SummaryCard title="Owner details">
          <div className="grid gap-1 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              {details.name} · {details.role}
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              {details.email}
            </div>
            <div>
              <span className="text-muted-foreground">Phone: </span>
              {details.phone}
            </div>
            <div>
              <span className="text-muted-foreground">Address: </span>
              {details.address}
            </div>
          </div>
        </SummaryCard>

        <SummaryCard title="Documents">
          <div className="grid gap-2">
            {uploaded.map(([k, v]) => {
              const cfg = DOC_TYPES.find((d) => d.key === k)!;
              return (
                <div key={k} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{cfg.label}</span>
                  <span className="text-muted-foreground">— {v!.name}</span>
                </div>
              );
            })}
          </div>
        </SummaryCard>

        <SummaryCard title="Verification checklist">
          <div className="grid gap-2">
            {checks.map((c, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 text-sm",
                  c.ok ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full",
                    c.ok ? "bg-emerald-100 text-emerald-700" : "bg-muted",
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>
                {c.label}
              </div>
            ))}
          </div>
        </SummaryCard>
      </div>
      <PrivacyNote />
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function PrivacyNote() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-xs text-sky-900 dark:text-sky-200">
      <Shield className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <div className="font-semibold">Your documents are securely stored.</div>
        <div className="mt-0.5 opacity-80">
          We only use them to verify ownership. They are never shown publicly or shared with third parties.
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ claimId, businessName }: { claimId: string; businessName: string }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-card">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-[0_12px_40px_rgba(37,99,235,0.45)]">
          <ShieldCheck className="h-10 w-10 text-white" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Verification submitted</h1>
        <p className="mt-2 text-muted-foreground">
          Your verification request for <span className="font-semibold text-foreground">{businessName}</span>{" "}
          has been submitted. Our team will review your documents shortly.
        </p>
        <div className="mt-6 flex justify-center">
          <VerifiedBadge status="pending" size="lg" />
        </div>
        <div className="mt-3 text-xs text-muted-foreground">Estimated review time: 24–48 hours</div>
        <div className="mt-3 text-[11px] text-muted-foreground">Reference ID: {claimId}</div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Link
            to="/dashboard"
            className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
          >
            Go to dashboard
          </Link>
          <Link
            to="/"
            className="rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold"
          >
            Back to home <ChevronRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
