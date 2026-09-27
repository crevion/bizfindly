"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MenuManager } from "./MenuManager";

const DescriptionEditor = dynamic(() => import("./DescriptionEditor"), { ssr: false });
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Heart,
  Star,
  ImagePlus,
  Tag,
  TrendingUp,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  dashboardApi,
  type DashboardListing,
  type OwnerReview,
} from "@/lib/backend/owner/dashboard";
import { useAuthStore } from "@/lib/backend/auth";
import { Section } from "./Section";
import { Stat } from "./Stat";
import { parseCoordinatePair } from "@/lib/maps";
import { OpeningHoursFields, listingFormData } from "./OpeningHoursFields";

const inputClass = "border-border bg-background mt-1 w-full rounded-xl border px-3 py-2 text-sm";
const buttonClass =
  "bg-foreground text-background rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50";
type Panel = "details" | "photos" | "offer" | "promotion" | "menu" | null;

export function DashboardListingPanel({ listing }: { listing: DashboardListing }) {
  const token = useAuthStore((s) => s.token);
  const client = useQueryClient();
  const [panel, setPanel] = useState<Panel>(null);
  const key = ["dashboard", token, listing.id];
  const detail = useQuery({
    queryKey: [...key, "detail"],
    queryFn: () => dashboardApi.detail(listing),
    retry: false,
  });
  const reviews = useInfiniteQuery({
    queryKey: [...key, "reviews"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => dashboardApi.reviews(listing, pageParam),
    getNextPageParam: (last, pages) => (last.next ? pages.length + 1 : undefined),
    retry: false,
  });
  const photos = useInfiniteQuery({
    queryKey: [...key, "photos"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => dashboardApi.photos(listing, pageParam),
    getNextPageParam: (last, pages) => (last.next ? pages.length + 1 : undefined),
    enabled: panel === "photos",
    retry: false,
  });
  const mutation = useMutation({
    mutationFn: (work: () => Promise<unknown>) => work(),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["dashboard", token] }),
        client.invalidateQueries({ queryKey: ["place-detail", listing.slug] }),
      ]);
      toast.success("Changes saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const run = (suffix: string, method: "PATCH" | "POST" | "PUT" | "DELETE", body?: unknown) =>
    mutation
      .mutateAsync(() => dashboardApi.change(listing, suffix, method, body))
      .then(
        () => true,
        () => false,
      );
  function open(next: Panel) {
    setPanel(next);
    setTimeout(
      () =>
        document
          .getElementById("dashboard-editor")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  }
  if (detail.isPending)
    return (
      <p className="py-8" role="status">
        Loading listing…
      </p>
    );
  if (detail.isError)
    return (
      <p className="py-8" role="alert">
        {detail.error.message}{" "}
        <button className="underline" onClick={() => void detail.refetch()}>
          Try again
        </button>
      </p>
    );
  const data = detail.data;
  const pending = mutation.isPending;
  const maxSaves = Math.max(1, ...data.saves_week.map((day) => day.count));
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="min-w-0 space-y-6">
        <div className="border-border bg-card overflow-hidden rounded-3xl border">
          <div className="bg-muted relative h-48">
            {data.cover_photo && (
              <img src={data.cover_photo} alt={data.name} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs uppercase">{data.category}</p>
              <h2 className="font-display text-2xl font-bold">{data.name}</h2>
              <p className="text-sm">{[data.area, data.city].filter(Boolean).join(", ")}</p>
              <Link href={`/place/${data.slug}`} className="mt-2 inline-block text-sm underline">
                View public listing
              </Link>
            </div>
          </div>
          <div className="divide-border grid grid-cols-3 divide-x">
            <Stat
              icon={Eye}
              label="Views"
              value={data.views.toLocaleString()}
              trend="Total recorded"
            />
            <Stat
              icon={Heart}
              label="Saves"
              value={data.saves.toLocaleString()}
              trend="Currently saved"
            />
            <Stat
              icon={Star}
              label="Rating"
              value={Number(data.rating) > 0 ? Number(data.rating).toFixed(1) : "—"}
              trend={`${data.review_count} reviews`}
            />
          </div>
        </div>
        <Section title="Saves this week" icon={Heart}>
          <div className="flex h-40 items-end gap-2">
            {data.saves_week.map((day) => (
              <div
                key={day.date}
                className="flex flex-1 flex-col items-center gap-1"
                title={`${day.date}: ${day.count} saves`}
              >
                <span className="text-xs">{day.count}</span>
                <div
                  className="gradient-brand w-full rounded-t-lg"
                  style={{ height: `${Math.max(2, (day.count / maxSaves) * 95)}px` }}
                />
                <span className="text-muted-foreground text-xs">
                  {new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, {
                    weekday: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 text-xs">
            Saves made in the last seven days that are still active.
          </p>
        </Section>
        <div id="dashboard-editor" className="scroll-mt-24">
          {panel && (
            <Section
              title={
                {
                  details: "Edit listing",
                  photos: "Manage photos",
                  offer: "Manage coupon",
                  promotion: "Boost listing",
                  menu: "Manage menu",
                }[panel]
              }
            >
              <div className="mb-4 text-right">
                <button onClick={() => setPanel(null)} className="text-sm underline">
                  Close
                </button>
              </div>
              {panel === "details" && (
                <form
                  key={data.id}
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const form = new FormData(event.currentTarget);
                    if (await run("", "PATCH", listingFormData(form, data.opening_hours)))
                      setPanel(null);
                  }}
                  className="space-y-3"
                >
                  <fieldset disabled={pending} className="space-y-3">
                    {(
                      [
                        ["name", "Business name"],
                        ["city", "City"],
                        ["area", "Area"],
                        ["address", "Address"],
                        ["google_map_url", "Google Maps URL"],
                        ["phone", "Phone"],
                        ["website", "Website"],
                      ] as const
                    ).map(([field, label]) => (
                      <label className="block text-sm font-medium" key={field}>
                        {label}
                        <input
                          name={field}
                          defaultValue={data[field]}
                          required={field === "name" || field === "city"}
                          type={field === "website" || field === "google_map_url" ? "url" : "text"}
                          maxLength={
                            field === "phone" ? 20 : field === "google_map_url" ? 500 : 255
                          }
                          placeholder={
                            field === "google_map_url" ? "https://maps.google.com/…" : undefined
                          }
                          className={inputClass}
                        />
                      </label>
                    ))}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["latitude", "Latitude", "23.7266815"],
                          ["longitude", "Longitude", "90.3836836"],
                        ] as const
                      ).map(([field, label, placeholder]) => (
                        <label className="block text-sm font-medium" key={field}>
                          {label}
                          <input
                            name={field}
                            defaultValue={data[field] ?? ""}
                            type="number"
                            step="any"
                            inputMode="decimal"
                            placeholder={placeholder}
                            onPaste={(event) => {
                              // Google Maps copies both numbers at once — split them.
                              const pair = parseCoordinatePair(
                                event.clipboardData.getData("text"),
                              );
                              const form = event.currentTarget.form;
                              if (!pair || !form) return;
                              event.preventDefault();
                              for (const [name, value] of [
                                ["latitude", pair.lat],
                                ["longitude", pair.lng],
                              ]) {
                                const input = form.elements.namedItem(name);
                                if (input instanceof HTMLInputElement) input.value = value;
                              }
                            }}
                            className={inputClass}
                          />
                        </label>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Right-click your pin in Google Maps and copy the coordinates — pasting them
                      into either box fills both.
                    </p>
                    <OpeningHoursFields value={data.opening_hours} category={data.category} />
                    <DescriptionEditor value={data.description} disabled={pending} />
                    <button className={buttonClass}>{pending ? "Saving…" : "Save listing"}</button>
                  </fieldset>
                </form>
              )}
              {panel === "menu" && listing.category === "restaurant" && (
                <MenuManager listing={listing} />
              )}
              {panel === "offer" && (
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (
                      await run(
                        "",
                        "PATCH",
                        Object.fromEntries(new FormData(event.currentTarget).entries()),
                      )
                    )
                      setPanel(null);
                  }}
                >
                  <fieldset disabled={pending} className="space-y-3">
                    <label className="block text-sm">
                      Coupon code
                      <input
                        name="offer_code"
                        defaultValue={data.offer_code}
                        maxLength={50}
                        required
                        className={inputClass}
                      />
                    </label>
                    <label className="block text-sm">
                      Offer description
                      <textarea
                        name="offer_description"
                        defaultValue={data.offer_description}
                        required
                        rows={3}
                        className={inputClass}
                      />
                    </label>
                    <p className="text-muted-foreground text-xs">
                      This replaces the current offer on your public listing.
                    </p>
                    <button className={buttonClass}>{pending ? "Saving…" : "Publish offer"}</button>
                  </fieldset>
                </form>
              )}
              {panel === "photos" && (
                <div className="space-y-5">
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const form = event.currentTarget;
                      if (await run("", "PATCH", new FormData(form))) form.reset();
                    }}
                  >
                    <fieldset disabled={pending} className="space-y-2">
                      <label className="block text-sm font-medium">
                        Replace cover photo
                        <input
                          type="file"
                          name="cover_photo"
                          accept="image/*"
                          required
                          className={inputClass}
                        />
                      </label>
                      <button className={buttonClass}>Upload cover</button>
                      {data.cover_photo && (
                        <button
                          type="button"
                          className="ml-3 text-sm underline"
                          onClick={() => {
                            if (window.confirm("Remove the cover photo?"))
                              void run("cover/", "DELETE");
                          }}
                        >
                          Remove cover
                        </button>
                      )}
                    </fieldset>
                  </form>
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const form = event.currentTarget;
                      if (await run("gallery/", "POST", new FormData(form))) form.reset();
                    }}
                  >
                    <fieldset disabled={pending} className="space-y-2">
                      <label className="block text-sm font-medium">
                        Add gallery photo
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          required
                          className={inputClass}
                        />
                      </label>
                      <label className="block text-sm">
                        Caption
                        <input name="caption" maxLength={255} className={inputClass} />
                      </label>
                      <button className={buttonClass}>Add photo</button>
                    </fieldset>
                  </form>
                  {photos.isPending && <p role="status">Loading photos…</p>}
                  {photos.isError && (
                    <p role="alert">
                      {photos.error.message}{" "}
                      <button className="underline" onClick={() => void photos.refetch()}>
                        Try again
                      </button>
                    </p>
                  )}
                  {photos.data?.pages[0].count === 0 && <p>No gallery photos yet.</p>}
                  <div className="grid grid-cols-2 gap-3">
                    {photos.data?.pages
                      .flatMap((page) => page.results)
                      .map((photo) => (
                        <div
                          key={photo.id}
                          className="border-border overflow-hidden rounded-xl border"
                        >
                          <img
                            src={photo.image}
                            alt={photo.caption || "Gallery photo"}
                            className="h-32 w-full object-cover"
                          />
                          <div className="p-2">
                            <p className="text-sm">{photo.caption}</p>
                            <button
                              disabled={pending}
                              className="text-sm text-red-600 underline disabled:opacity-50"
                              onClick={() => {
                                if (window.confirm("Remove this gallery photo?"))
                                  void run(`gallery/${photo.id}/`, "DELETE");
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                  {photos.hasNextPage && (
                    <button
                      disabled={photos.isFetchingNextPage}
                      onClick={() => void photos.fetchNextPage()}
                      className="underline"
                    >
                      More photos
                    </button>
                  )}
                </div>
              )}
              {panel === "promotion" && (
                <div className="space-y-3">
                  <p className="text-sm">
                    Request a promotion for this listing. Our team will review your request and
                    contact you. Submitting does not charge you or automatically change your
                    listing’s ranking.
                  </p>
                  {data.promotion_status ? (
                    <>
                      <p className="font-semibold">Request status: {data.promotion_status}</p>
                      {data.promotion_status === "pending" && (
                        <button
                          disabled={pending}
                          onClick={() => void run("promotion/", "DELETE")}
                          className={buttonClass}
                        >
                          Cancel request
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      disabled={pending}
                      onClick={() => void run("promotion/", "POST")}
                      className={buttonClass}
                    >
                      Request promotion
                    </button>
                  )}
                </div>
              )}
            </Section>
          )}
        </div>
        <div id="dashboard-reviews" className="scroll-mt-24">
          <Section title="Customer reviews" icon={MessageSquare}>
            {reviews.isPending && <p role="status">Loading reviews…</p>}
            {reviews.isError && (
              <p role="alert">
                {reviews.error.message}{" "}
                <button className="underline" onClick={() => void reviews.refetch()}>
                  Try again
                </button>
              </p>
            )}
            {reviews.data?.pages[0].count === 0 && (
              <p className="text-muted-foreground text-sm">No reviews yet.</p>
            )}
            <div className="space-y-3">
              {reviews.data?.pages
                .flatMap((page) => page.results)
                .map((review) => (
                  <ReviewRow
                    key={`${review.id}:${review.owner_reply}`}
                    review={review}
                    pending={pending}
                    save={(reply) =>
                      run(`reviews/${review.id}/reply/`, "PUT", { owner_reply: reply })
                    }
                  />
                ))}
            </div>
            {reviews.hasNextPage && (
              <button
                className="mt-4 underline"
                disabled={reviews.isFetchingNextPage}
                onClick={() => void reviews.fetchNextPage()}
              >
                More reviews
              </button>
            )}
          </Section>
        </div>
      </div>
      <div className="space-y-6">
        <Section title="Quick actions">
          <div className="space-y-2">
            {[
              { label: "Edit listing", icon: Pencil, action: () => open("details") },
              ...(listing.category === "restaurant"
                ? [{ label: "Manage menu", icon: Pencil, action: () => open("menu") }]
                : []),
              { label: "Edit photos", icon: ImagePlus, action: () => open("photos") },
              { label: "Create coupon", icon: Tag, action: () => open("offer") },
              { label: "Boost listing", icon: TrendingUp, action: () => open("promotion") },
              {
                label: "Manage reviews",
                icon: MessageSquare,
                action: () =>
                  document
                    .getElementById("dashboard-reviews")
                    ?.scrollIntoView({ behavior: "smooth" }),
              },
            ].map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="border-border bg-surface hover:border-foreground/30 flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm font-semibold"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </Section>
        <Section title="Active offer">
          {data.offer_code || data.offer_description ? (
            <div className="space-y-3">
              <p className="font-semibold">{data.offer_code}</p>
              <p className="text-sm">{data.offer_description}</p>
              <button onClick={() => open("offer")} className={buttonClass}>
                Edit offer
              </button>
              <button
                disabled={pending}
                onClick={() => {
                  if (window.confirm("Remove this offer from your listing?"))
                    void run("", "PATCH", { offer_code: "", offer_description: "" });
                }}
                className="ml-3 text-sm underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-3 text-sm">
                No offers yet. Create a coupon to attract new guests.
              </p>
              <button onClick={() => open("offer")} className={buttonClass}>
                New offer
              </button>
            </div>
          )}
        </Section>
        <Section title="Danger zone" icon={Trash2}>
          <p className="text-muted-foreground text-sm">
            Removing hides this listing from search and your dashboard. It stays in your account
            — contact support to bring it back.
          </p>
          <button
            disabled={pending}
            onClick={() => {
              if (
                window.confirm(
                  `Remove "${data.name}" from BizFindly? It will be hidden from search and your dashboard.`,
                )
              )
                void run("", "DELETE");
            }}
            className="mt-3 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
          >
            Delete listing
          </button>
        </Section>
      </div>
    </div>
  );
}

function ReviewRow({
  review,
  pending,
  save,
}: {
  review: OwnerReview;
  pending: boolean;
  save: (reply: string) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [reply, setReply] = useState(review.owner_reply);
  return (
    <div className="border-border bg-surface rounded-2xl border p-4">
      <div className="flex justify-between gap-3">
        <p className="font-semibold">{review.user_name || "Guest"}</p>
        <span className="text-brand text-sm">{review.star}/5 ★</span>
      </div>
      <p className="text-muted-foreground text-xs">
        {new Date(review.created_at).toLocaleDateString()}
      </p>
      <p className="mt-2 text-sm whitespace-pre-wrap">{review.comment}</p>
      {review.owner_reply && (
        <div className="border-brand mt-3 border-l-2 pl-3">
          <p className="text-xs font-semibold">Your reply</p>
          <p className="text-sm whitespace-pre-wrap">{review.owner_reply}</p>
        </div>
      )}
      {editing ? (
        <form
          className="mt-3"
          onSubmit={async (event) => {
            event.preventDefault();
            if (await save(reply)) setEditing(false);
          }}
        >
          <label className="text-sm">
            Your reply
            <textarea
              required
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              maxLength={5000}
              rows={3}
              className={inputClass}
            />
          </label>
          <button disabled={pending} className={buttonClass}>
            Save reply
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="ml-3 text-sm underline"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setEditing(true)} className="text-brand mt-3 text-sm font-semibold">
          {review.owner_reply ? "Edit reply" : "Reply"}
        </button>
      )}
      {review.owner_reply && (
        <button
          disabled={pending}
          onClick={() => {
            if (window.confirm("Remove your reply?")) void save("");
          }}
          className="ml-3 text-sm underline"
        >
          Remove reply
        </button>
      )}
    </div>
  );
}
