"use client";

import { useRef, useState } from "react";
import { ImageIcon, Star, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_GALLERY_IMAGES,
  type RejectedImage,
  useListingMediaStore,
} from "@/store/useListingMediaStore";
import { cn } from "@/lib/utils";

function reportRejections(rejected: RejectedImage[]) {
  for (const item of rejected.slice(0, 3)) {
    toast.error(`${item.name} ${item.reason}.`);
  }
  if (rejected.length > 3) {
    toast.error(`${rejected.length - 3} more file(s) were skipped.`);
  }
}

function DropTarget({
  multiple,
  title,
  hint,
  onFiles,
  className,
}: {
  multiple: boolean;
  title: string;
  hint: string;
  onFiles: (files: File[]) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = (list: FileList | null) => {
    if (!list?.length) return;
    onFiles(Array.from(list));
    // Let the same file be picked again after a removal.
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition",
        dragging
          ? "border-brand bg-brand/5"
          : "border-border bg-muted/20 hover:border-brand/50 hover:bg-muted/40",
        className,
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
        <Upload className="h-5 w-5 text-muted-foreground" />
      </span>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}

export function ListingPhotoUpload() {
  const cover = useListingMediaStore((s) => s.cover);
  const gallery = useListingMediaStore((s) => s.gallery);
  const setCover = useListingMediaStore((s) => s.setCover);
  const clearCover = useListingMediaStore((s) => s.clearCover);
  const addGallery = useListingMediaStore((s) => s.addGallery);
  const removeGalleryAt = useListingMediaStore((s) => s.removeGalleryAt);

  const galleryFull = gallery.length >= MAX_GALLERY_IMAGES;

  const handleCover = (files: File[]) => {
    const rejected = setCover(files[0]);
    if (rejected) reportRejections([rejected]);
    else toast.success("Cover photo ready to upload");
  };

  const handleGallery = (files: File[]) => {
    const rejected = addGallery(files);
    const accepted = files.length - rejected.length;
    if (accepted > 0) toast.success(`${accepted} photo(s) added to the gallery`);
    reportRejections(rejected);
  };

  return (
    <>
      {/* Cover photo — the backend stores exactly one per listing. */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground">Cover Photo</h3>
          <span className="text-xs text-muted-foreground">1 image</span>
        </div>
        <p className="text-xs text-muted-foreground">
          This is the banner shown on search results and your listing page. Landscape shots work
          best.
        </p>

        {cover ? (
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={cover.preview}
              alt="Cover photo preview"
              className="h-48 w-full object-cover md:h-56"
            />
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-foreground shadow-sm">
              <Star className="h-3 w-3" /> Cover
            </span>
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={clearCover}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-destructive cursor-pointer"
                aria-label="Remove cover photo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="border-t border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
              <span className="truncate font-medium text-foreground">{cover.file.name}</span>
              <span> · {(cover.file.size / 1024 / 1024).toFixed(1)}MB</span>
            </div>
          </div>
        ) : (
          <DropTarget
            multiple={false}
            title="Drag your cover photo here"
            hint="or click to browse · JPG, PNG, WebP up to 5MB"
            onFiles={handleCover}
          />
        )}

        {cover && (
          <DropTarget
            multiple={false}
            title="Replace cover photo"
            hint="Uploading a new file swaps the current cover"
            onFiles={handleCover}
            className="py-5"
          />
        )}
      </div>

      {/* Gallery — each image is uploaded as its own record, capped at 10. */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground">Gallery Photos</h3>
          <span
            className={cn(
              "text-xs font-semibold",
              galleryFull ? "text-brand" : "text-muted-foreground",
            )}
          >
            {gallery.length}/{MAX_GALLERY_IMAGES}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Select up to {MAX_GALLERY_IMAGES} photos at once — ambiance, food or services, and the
          venue. Listings with photos get 5x more clicks.
        </p>

        {galleryFull ? (
          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-4 text-center text-xs font-medium text-muted-foreground">
            You have reached the {MAX_GALLERY_IMAGES} photo limit. Remove one to add another.
          </div>
        ) : (
          <DropTarget
            multiple
            title="Drag photos here"
            hint={`or click to browse · ${MAX_GALLERY_IMAGES - gallery.length} slot(s) left · JPG, PNG, WebP up to 5MB each`}
            onFiles={handleGallery}
          />
        )}

        {gallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/10 py-8 text-center">
            <ImageIcon className="h-9 w-9 text-muted-foreground opacity-40" />
            <p className="mt-2 text-sm font-semibold text-foreground">No gallery photos yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your cover photo alone is enough to publish, but a gallery converts better.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((image, index) => (
              <div
                key={image.preview}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted shadow-soft"
              >
                <img src={image.preview} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeGalleryAt(index)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100 cursor-pointer hover:bg-destructive"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
