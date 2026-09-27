"use client";

import { useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/backend/auth";
import type { DashboardListing } from "@/lib/backend/owner/dashboard";
import { ownerMenuApi, type OwnerMenuItem } from "@/lib/backend/owner/menu";

const input = "border-border bg-background mt-1 w-full rounded-xl border px-3 py-2 text-sm";
const button =
  "bg-foreground text-background rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50";

export function MenuManager({ listing }: { listing: DashboardListing }) {
  const token = useAuthStore((s) => s.token);
  const client = useQueryClient();
  const [editing, setEditing] = useState<OwnerMenuItem | "new" | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const key = ["owner-menu", token, listing.slug];
  const items = useInfiniteQuery({
    queryKey: key,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => ownerMenuApi.list(listing.slug, pageParam),
    getNextPageParam: (last, pages) => (last.next ? pages.length + 1 : undefined),
    retry: false,
  });
  const categories = useQuery({
    queryKey: ["menu-categories", token],
    queryFn: ownerMenuApi.categories,
    retry: false,
  });
  const change = useMutation({
    mutationFn: (work: () => Promise<unknown>) => work(),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: key }),
        client.invalidateQueries({ queryKey: ["place-detail", listing.slug] }),
      ]);
      toast.success("Menu updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const categoryMutation = useMutation({
    mutationFn: ownerMenuApi.createCategory,
    onSuccess: async () => {
      setNewCategory("");
      await client.invalidateQueries({ queryKey: ["menu-categories", token] });
      toast.success("Category added");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const pending = change.isPending;
  const item = editing && editing !== "new" ? editing : undefined;
  return (
    <div className="space-y-5">
      <button type="button" disabled={pending} className={button} onClick={() => setEditing("new")}>
        Add menu item
      </button>
      {editing && (
        <form
          key={item?.id ?? "new"}
          className="border-border space-y-3 rounded-2xl border p-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const image = form.get("image");
            if (!(image instanceof File) || !image.size) form.delete("image");
            form.set("is_available", form.has("is_available") ? "true" : "false");
            form.set("remove_image", form.has("remove_image") ? "true" : "false");
            try {
              await change.mutateAsync(() => ownerMenuApi.save(listing.slug, item?.id, form));
              setEditing(null);
            } catch {
              /* Error shown by mutation. */
            }
          }}
        >
          <h4 className="font-semibold">{item ? "Edit menu item" : "New menu item"}</h4>
          <fieldset disabled={pending} className="space-y-3">
            <label className="block text-sm">
              Name
              <input
                className={input}
                name="name"
                defaultValue={item?.name ?? ""}
                required
                maxLength={255}
              />
            </label>
            <label className="block text-sm">
              Category
              <select
                name="category"
                defaultValue={item?.category ?? ""}
                className={input}
                disabled={categories.isPending || categories.isError}
              >
                <option value="">Other items</option>
                {categories.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            {categories.isError && (
              <p role="alert" className="text-sm">
                {categories.error.message}{" "}
                <button
                  type="button"
                  onClick={() => void categories.refetch()}
                  className="underline"
                >
                  Retry categories
                </button>
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                Price (৳)
                <input
                  className={input}
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  max="99999999.99"
                  defaultValue={item?.price ?? ""}
                  required
                />
              </label>
              <label className="block text-sm">
                Discount price (৳, optional)
                <input
                  className={input}
                  name="discount_price"
                  type="number"
                  step="0.01"
                  min="0"
                  max="99999999.99"
                  defaultValue={item?.discount_price ?? ""}
                />
              </label>
            </div>
            <label className="block text-sm">
              Description
              <textarea
                className={input}
                rows={3}
                name="description"
                defaultValue={item?.description ?? ""}
              />
            </label>
            <label className="block text-sm">
              Photo
              <input className={input} type="file" accept="image/*" name="image" />
            </label>
            {item?.image && (
              <div className="space-y-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-32 rounded-xl object-cover"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="remove_image" /> Remove existing photo
                </label>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_available"
                defaultChecked={item?.is_available ?? true}
              />{" "}
              Available
            </label>
            <div className="flex gap-3">
              <button
                className={button}
                disabled={pending || categories.isPending || categories.isError}
              >
                {pending ? "Saving…" : "Save item"}
              </button>
              <button type="button" className="text-sm underline" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </fieldset>
        </form>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          categoryMutation.mutate(newCategory.trim());
        }}
        className="flex items-end gap-2"
      >
        <label className="flex-1 text-sm">
          New category
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            required
            maxLength={255}
            className={input}
            placeholder="e.g. Desserts"
          />
        </label>
        <button className={button} disabled={categoryMutation.isPending || !newCategory.trim()}>
          Add category
        </button>
      </form>
      {items.isPending && <p role="status">Loading menu…</p>}
      {items.isError && (
        <p role="alert">
          {items.error.message}{" "}
          <button className="underline" onClick={() => void items.refetch()}>
            Try again
          </button>
        </p>
      )}
      {items.data?.pages[0].count === 0 && (
        <p className="text-muted-foreground text-sm">No menu items yet.</p>
      )}
      <div className="space-y-3">
        {items.data?.pages
          .flatMap((page) => page.results)
          .map((row) => (
            <div
              key={row.id}
              className="border-border flex flex-wrap items-center gap-3 rounded-xl border p-3"
            >
              {row.image && (
                <img src={row.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{row.name}</p>
                <p className="text-muted-foreground text-xs">
                  {row.category_name || "Other items"} ·{" "}
                  {row.is_available ? "Available" : "Unavailable"}
                </p>
                <p className="text-sm">
                  ৳{row.discount_price ?? row.price}
                  {row.discount_price !== null && (
                    <s className="text-muted-foreground ml-2">৳{row.price}</s>
                  )}
                </p>
              </div>
              <button
                disabled={pending}
                onClick={() => setEditing(row)}
                className="text-sm underline"
              >
                Edit
              </button>
              <button
                disabled={pending}
                onClick={() => {
                  if (window.confirm(`Delete ${row.name} from the menu?`))
                    change.mutate(() => ownerMenuApi.remove(listing.slug, row.id), {
                      onSuccess: () => {
                        if (item?.id === row.id) setEditing(null);
                      },
                    });
                }}
                className="text-sm text-red-600 underline"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
      {items.hasNextPage && (
        <button
          disabled={items.isFetchingNextPage}
          onClick={() => void items.fetchNextPage()}
          className="underline"
        >
          Load more items
        </button>
      )}
    </div>
  );
}
