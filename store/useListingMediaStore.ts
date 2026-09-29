"use client";

import { create } from "zustand";

/** The backend takes one cover_photo per listing and one gallery row per image. */
export const MAX_GALLERY_IMAGES = 10;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";

export interface PickedImage {
  file: File;
  /** Object URL for the local thumbnail — revoked when the image is dropped. */
  preview: string;
}

export interface RejectedImage {
  name: string;
  reason: string;
}

interface ListingMediaState {
  cover: PickedImage | null;
  gallery: PickedImage[];
  /** Returns the rejection when the file is not a usable image, else null. */
  setCover: (file: File) => RejectedImage | null;
  clearCover: () => void;
  /** Adds what fits and returns everything that was turned away. */
  addGallery: (files: File[]) => RejectedImage[];
  removeGalleryAt: (index: number) => void;
  /** Empties the picker but keeps the object URLs alive for the success screen. */
  detach: () => void;
  reset: () => void;
}

const ALLOWED = new Set(ACCEPTED_IMAGE_TYPES.split(","));

function validate(file: File): RejectedImage | null {
  if (!ALLOWED.has(file.type)) {
    return { name: file.name, reason: "must be a JPG, PNG, or WebP image" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { name: file.name, reason: "is larger than 5MB" };
  }
  return null;
}

function pick(file: File): PickedImage {
  return { file, preview: URL.createObjectURL(file) };
}

function release(image: PickedImage | null | undefined) {
  if (image) URL.revokeObjectURL(image.preview);
}

/**
 * Selected files live outside the persisted listing draft: File objects cannot
 * survive localStorage, so a reload clears the picker and the owner re-picks.
 */
export const useListingMediaStore = create<ListingMediaState>()((set, get) => ({
  cover: null,
  gallery: [],

  setCover: (file) => {
    const rejected = validate(file);
    if (rejected) return rejected;
    release(get().cover);
    set({ cover: pick(file) });
    return null;
  },

  clearCover: () => {
    release(get().cover);
    set({ cover: null });
  },

  addGallery: (files) => {
    const current = get().gallery;
    let room = MAX_GALLERY_IMAGES - current.length;
    const accepted: PickedImage[] = [];
    const rejected: RejectedImage[] = [];

    for (const file of files) {
      const problem = validate(file);
      if (problem) {
        rejected.push(problem);
        continue;
      }
      if (room <= 0) {
        rejected.push({
          name: file.name,
          reason: `did not fit — ${MAX_GALLERY_IMAGES} photos is the limit`,
        });
        continue;
      }
      accepted.push(pick(file));
      room -= 1;
    }

    if (accepted.length) set({ gallery: [...current, ...accepted] });
    return rejected;
  },

  removeGalleryAt: (index) => {
    const gallery = get().gallery;
    release(gallery[index]);
    set({ gallery: gallery.filter((_, i) => i !== index) });
  },

  detach: () => set({ cover: null, gallery: [] }),

  reset: () => {
    release(get().cover);
    get().gallery.forEach(release);
    set({ cover: null, gallery: [] });
  },
}));
