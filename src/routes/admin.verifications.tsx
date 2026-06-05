import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldX,
  User,
  X,
} from "lucide-react";
import {
  loadClaims,
  updateClaimStatus,
  type ClaimRecord,
  type VerificationStatus,
} from "@/lib/verification";
import { VerifiedBadge } from "@/components/verification/VerifiedBadge";

export const Route = createFileRoute("/admin/verifications")({
  component: AdminVerifications,
  head: () => ({ meta: [{ title: "Admin · Verifications — BizFindly" }] }),
});

const FILTERS: { id: "all" | VerificationStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "verified", label: "Verified" },
  { id: "rejected", label: "Rejected" },
];

function AdminVerifications() {
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("pending");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const list = loadClaims();
    setClaims(list);
    if (list[0]) setActiveId(list[0].id);
  }, []);

  const visible = claims.filter((c) => filter === "all" || c.status === filter);
  const active = claims.find((c) => c.id === activeId) || visible[0];

  const action = (status: VerificationStatus) => {
    if (!active) return;
    updateClaimStatus(active.id, status, note || undefined);
    const next = loadClaims();
    setClaims(next);
    setNote("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-600">Admin tools</div>
          <h1 className="mt-1 font-display text-3xl font-extrabold md:text-4xl">Verification queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review submitted claims and approve, reject or request more info.
          </p>
        </div>
        <Link
          to="/"
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold"
        >
          Back to site
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.id === "all" ? claims.length : claims.filter((c) => c.status === f.id).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface"
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {claims.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border p-16 text-center">
          <Shield className="mx-auto h-8 w-8 text-muted-foreground" />
          <div className="mt-3 text-lg font-semibold">No claim submissions yet</div>
          <p className="mt-1 text-sm text-muted-foreground">
            When business owners submit a verification request, it will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* List */}
          <div className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2">
            {visible.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`block w-full rounded-2xl border bg-card p-4 text-left transition hover:border-foreground/30 ${
                  c.id === active?.id ? "border-sky-500 ring-2 ring-sky-500/20" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{c.placeName}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {c.ownerName} · {c.ownerRole}
                    </div>
                  </div>
                  <VerifiedBadge status={c.status} size="sm" />
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  Submitted {new Date(c.submittedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Nothing in this filter.
              </div>
            )}
          </div>

          {/* Detail */}
          {active && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {active.placeSlug ? "Existing listing" : "New listing"}
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold">{active.placeName}</h2>
                </div>
                <VerifiedBadge status={active.status} size="lg" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailRow icon={User} label="Owner" value={`${active.ownerName} · ${active.ownerRole}`} />
                <DetailRow icon={Mail} label="Email" value={active.ownerEmail} />
                <DetailRow icon={Phone} label="Phone" value={active.ownerPhone} />
                <DetailRow icon={MapPin} label="Address" value={active.businessAddress} />
              </div>

              <div className="mt-6">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Documents
                </div>
                <div className="grid gap-2">
                  {active.documents.map((d) => (
                    <div
                      key={d.key}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-muted">
                        {d.preview ? (
                          <img src={d.preview} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <FileText className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{d.label}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {d.name} · {(d.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                    </div>
                  ))}
                  {active.documents.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      No documents uploaded.
                    </div>
                  )}
                </div>
              </div>

              {(active.social.facebook ||
                active.social.instagram ||
                active.social.website ||
                active.social.googleBusiness) && (
                <div className="mt-6">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Social proof
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {active.social.website && <Pill>{active.social.website}</Pill>}
                    {active.social.facebook && <Pill>FB · {active.social.facebook}</Pill>}
                    {active.social.instagram && <Pill>IG · {active.social.instagram}</Pill>}
                    {active.social.googleBusiness && <Pill>Google Business</Pill>}
                  </div>
                </div>
              )}

              {active.reviewerNote && (
                <div className="mt-6 rounded-2xl bg-muted p-4 text-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Last review note
                  </div>
                  <div className="mt-1">{active.reviewerNote}</div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 border-t border-border pt-5">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional reviewer note (sent with decision)…"
                  className="min-h-[80px] w-full rounded-2xl border border-border bg-surface p-3 text-sm outline-none focus:ring-2 focus:ring-sky-500/30"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => action("verified")}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
                  >
                    <BadgeCheck className="h-4 w-4" /> Approve & verify
                  </button>
                  <button
                    onClick={() => action("pending")}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold"
                  >
                    <Check className="h-4 w-4" /> Request more info
                  </button>
                  <button
                    onClick={() => action("rejected")}
                    className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-5 py-2.5 text-sm font-semibold text-destructive"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => action("rejected")}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-destructive"
                  >
                    <ShieldX className="h-4 w-4" /> Revoke badge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span>{value}</span>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1 font-semibold">
      {children}
    </span>
  );
}
