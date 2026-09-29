"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import type { Review } from "@/lib/backend/reviews";
import { cn } from "@/lib/utils";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

// auto_now keeps updated_at a hair ahead of created_at on insert, so an edit is
// only worth flagging once the two are more than a moment apart.
const EDIT_THRESHOLD_MS = 2000;

function wasEdited(review: Review) {
  if (!review.updated_at) return false;
  const created = new Date(review.created_at).getTime();
  const updated = new Date(review.updated_at).getTime();
  if (Number.isNaN(created) || Number.isNaN(updated)) return false;
  return updated - created > EDIT_THRESHOLD_MS;
}

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden
          className={cn(
            "h-4 w-4",
            star <= value ? "fill-brand text-brand" : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}

function StarPicker({
  value,
  onChange,
  name,
}: {
  value: number;
  onChange: (value: number) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Rating *</legend>
      <div className="mt-2 flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              className="peer sr-only"
              aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
            />
            <span className="block rounded-lg p-1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
              <Star
                className={cn(
                  "h-7 w-7",
                  star <= value ? "fill-brand text-brand" : "text-muted-foreground",
                )}
              />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface Props {
  review: Review;
  onSave: (values: { star: number; comment: string }) => Promise<void>;
  onDelete: () => Promise<void>;
  saving: boolean;
  deleting: boolean;
  error?: string;
  /** Off on a business page, which already names the business above the card. */
  showBusiness?: boolean;
}

export function MyReviewCard({
  review,
  onSave,
  onDelete,
  saving,
  deleting,
  error,
  showBusiness = true,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [star, setStar] = useState(review.star);
  const [comment, setComment] = useState(review.comment);
  const business = review.business;
  const busy = saving || deleting;

  const startEditing = () => {
    setStar(review.star);
    setComment(review.comment);
    setConfirmingDelete(false);
    setEditing(true);
  };

  return (
    <article className="border-border bg-card shadow-soft rounded-3xl border p-5">
      <div className="flex items-start gap-4">
        {showBusiness &&
          (business?.cover_photo ? (
            <img
              src={business.cover_photo}
              alt={business.name}
              loading="lazy"
              className="h-16 w-16 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <span className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
              <Star className="text-muted-foreground h-5 w-5" />
            </span>
          ))}
        <div className="min-w-0 flex-1">
          {!showBusiness ? (
            <span className="font-semibold">Your review</span>
          ) : business ? (
            <Link href={`/place/${business.slug}`} className="font-semibold hover:underline">
              {business.name}
            </Link>
          ) : (
            <span className="font-semibold">A place that is no longer listed</span>
          )}
          {showBusiness && business && (business.area || business.city) && (
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              {[business.area, business.city].filter(Boolean).join(", ")}
            </div>
          )}
          <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-xs">
            <Stars value={review.star} />
            <span>{formatDate(review.created_at)}</span>
            {wasEdited(review) && <span className="bg-muted rounded-full px-2 py-0.5">Edited</span>}
          </div>
        </div>
        {!editing && (
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={startEditing}
              disabled={busy}
              className="hover:bg-muted inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={busy}
              className="hover:bg-muted inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <form
          className="mt-4 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            if (saving) return;
            await onSave({ star, comment: comment.trim() });
            setEditing(false);
          }}
        >
          <fieldset disabled={saving} className="space-y-4">
            <StarPicker value={star} onChange={setStar} name={`rating-${review.id}`} />
            <label className="block text-sm font-medium">
              Review (optional)
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                className="border-border bg-background mt-2 w-full rounded-xl border px-3 py-2 font-normal"
                placeholder="Share what you liked or what could be better…"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex items-center gap-3">
              <button className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="text-sm underline">
                Cancel
              </button>
            </div>
          </fieldset>
        </form>
      ) : (
        <>
          {review.comment && (
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
          )}
          {review.owner_reply && (
            <div className="border-brand mt-3 border-l-2 pl-3">
              <p className="text-sm font-semibold">Response from the owner</p>
              <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
                {review.owner_reply}
              </p>
            </div>
          )}
          {confirmingDelete && (
            <div className="border-border bg-surface mt-4 flex flex-wrap items-center gap-3 rounded-2xl border p-3">
              <p className="flex-1 text-sm font-medium">
                Delete this review? This cannot be undone.
              </p>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  await onDelete();
                  setConfirmingDelete(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
                className="text-sm underline"
              >
                Cancel
              </button>
            </div>
          )}
          {error && !confirmingDelete && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </>
      )}
    </article>
  );
}
